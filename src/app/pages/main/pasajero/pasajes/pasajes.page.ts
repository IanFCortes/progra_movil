import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ActionSheetController, NavController, ToastController } from '@ionic/angular';
import { User } from 'src/app/models/user.model';
import { Viaje } from 'src/app/models/viaje.model';
import { Geolocation } from '@capacitor/geolocation';

import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { collection } from '@angular/fire/firestore';

interface ViajeConUbicacion extends Viaje {
  ubicacion?: { lat: number, lng: number };
}

@Component({
  selector: 'app-pasajes',
  templateUrl: './pasajes.page.html',
  styleUrls: ['./pasajes.page.scss'],
})
export class PasajesPage implements OnInit {

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);
  viajes: ViajeConUbicacion[] = [];
  viajeId: string;
  viajeData: Viaje;
  filteredViajes: ViajeConUbicacion[] = [];
  usuarioLogeado: User;
  user = {} as User;
  private duocUCLocation = {
    lat: -36.8265,   // Latitud de Duoc UC
    lng: -73.0492,   // Longitud de Duoc UC
  };
  constructor(
    private activatedRoute: ActivatedRoute,
    private firebaseService: FirebaseService,
    private navCtrl: NavController,
    private actionSheetController: ActionSheetController
  ) {}

  ngOnInit() {
    this.viajeData = JSON.parse(this.activatedRoute.snapshot.paramMap.get('viajeData'));
    this.user = this.utilsSvc.getFromLocalStorage('user');
    console.log(localStorage);
    console.log(Geolocation.getCurrentPosition())
  }

  async obtenerUbicacion(viaje: Viaje) {
    try {
      // Solicitar la ubicación
      const position = await Geolocation.getCurrentPosition();
      const ubicacion = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      const distancia = this.calcularDistancia(ubicacion.lat, ubicacion.lng, this.duocUCLocation.lat, this.duocUCLocation.lng);
      // Crear un ID único para el viaje (puede ser basado en el email y timestamp)
      if (distancia <= 1) {  // 1 km
        // Si está cerca, permitir la reserva
        this.guardarUbicacionEnLocalStorage(viaje, ubicacion);
        console.log('Reserva permitida');
        // Lógica para agregar el viaje
      } else {
        // Si no está cerca, mostrar mensaje de error
        this.utilsSvc.presentToast({
          message: 'Debe estar cerca de Duoc UC, Concepción, Chile para realizar la reserva.',
          duration: 3500,
          color: 'danger',
          position: 'middle',
          icon: 'warning',
        });
        console.log('Reserva no permitida: Usuario demasiado lejos');
      }

    } catch (error) {
      console.error('Error al obtener la ubicación', error);
    }
  }

  calcularDistancia(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371; // Radio de la Tierra en km
    const dLat = this.degreesToRadians(lat2 - lat1);
    const dLng = this.degreesToRadians(lng2 - lng1);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(this.degreesToRadians(lat1)) * Math.cos(this.degreesToRadians(lat2)) *
              Math.sin(dLng / 2) * Math.sin(dLng / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distancia = R * c; // Distancia en km
    return distancia;
  }

  degreesToRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  guardarUbicacionEnLocalStorage(viaje: Viaje, ubicacion: { lat: number, lng: number }) {
    const viajeLocal = {
      id: viaje.id, // Usa el ID de Firestore
      email: this.user.email,
      ubicacion: ubicacion,
    };

    // Guarda en localStorage con el ID del viaje
    localStorage.setItem(`viaje_${viaje.id}`, JSON.stringify(viajeLocal));
  }

  ionViewWillEnter() {
    this.getViajes();
  }

  getViajes() {
    let path = '/viajes';

    let sub = this.firebaseSvc.getCollectionData(path).subscribe({
      next: (res: any) => {
        // Filtra los viajes que no están completos y que no pertenecen al usuario
        this.viajes = res.filter((viaje: Viaje) => !viaje.completo && viaje.emailP !== this.user.email);

        // Agrega la ubicación desde localStorage si está disponible
        const viajesConUbicacion = this.viajes.map((viaje: Viaje) => {
          const localStorageKey = `viaje_${viaje.id}`;
          const localStorageData = localStorage.getItem(localStorageKey);

          if (localStorageData) {
            try {
              const storedData = JSON.parse(localStorageData);
              return { ...viaje, ubicacion: storedData.ubicacion };
            } catch (error) {
              console.error(`Error parseando datos del localStorage para el viaje ${viaje.id}:`, error);
            }
          }
          return { ...viaje };
        });

        // Actualiza las listas de viajes con ubicación
        this.viajes = viajesConUbicacion;
        this.filteredViajes = this.viajes;
        console.log('Viajes con ubicación:', this.viajes);

        sub.unsubscribe();
      },
      error: (error) => {
        console.error('Error al obtener los viajes desde Firestore:', error);
        sub.unsubscribe();
      }
    });
  }
  async validarUbicacion(viaje: ViajeConUbicacion): Promise<boolean> {
    try {
      const position = await Geolocation.getCurrentPosition();
      const ubicacion = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      
      // Calcular la distancia entre la ubicación del usuario y Duoc UC
      const distancia = this.calcularDistancia(ubicacion.lat, ubicacion.lng, this.duocUCLocation.lat, this.duocUCLocation.lng);
  
      if (distancia <= 100) {  // 1 km
        console.log('Usuario dentro del área permitida');
        return true;  // Usuario cerca de Duoc UC
      } else {
        console.log('Usuario demasiado lejos de Duoc UC');
        return false;  // Usuario demasiado lejos
      }
    } catch (error) {
      console.error('Error al obtener la ubicación', error);
      return false;  // En caso de error, no permitimos la reserva
    }
  }
  // Método para agendar el viaje
  async presentActionSheet(viaje: ViajeConUbicacion) {
    const actionSheet = await this.actionSheetController.create({
      header: '¿Está seguro que desea agendar este viaje?',
      buttons: [
        {
          text: 'Confirmar',
          role: 'complete',
          handler: async () => {
            try {
              // Primero validamos si el usuario está cerca de Duoc UC
              const esCerca = await this.validarUbicacion(viaje);
  
              if (!esCerca) {
                // Si no está cerca, mostramos un mensaje y cancelamos la confirmación
                this.utilsSvc.presentToast({
                  message: 'Debe estar cerca de Duoc UC, Concepción, Chile para realizar la reserva.',
                  duration: 3500,
                  color: 'danger',
                  position: 'middle',
                  icon: 'warning',
                });
                return;  // Cancelamos el proceso de agendar el viaje
              }
  
              // Si está cerca, continuamos con el proceso
              // Restar disponibilidad y asociar el usuario al viaje
              await this.firebaseService.disponible(viaje.id, viaje.disponibles - 1);
              await this.firebaseService.emailPasajerp(viaje.id, this.user.email);
  
              console.log('Viaje agendado:', viaje);
              this.filteredViajes = this.filteredViajes.filter(v => v !== viaje);
              this.viajes = this.viajes.filter(v => v !== viaje);
  
              // Navega y muestra un mensaje de éxito
              this.navCtrl.navigateRoot(['/main/home']);
              this.utilsSvc.presentToast({
                message: 'Viaje agendado exitosamente',
                duration: 3500,
                color: 'success',
                position: 'middle',
                icon: 'checkmark-circle-outline'
              });
            } catch (error) {
              console.error('Error al agendar el viaje:', error);
            }
          }
        },
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Cancelado');
          }
        }
      ]
    });
  
    await actionSheet.present();
  }
}
