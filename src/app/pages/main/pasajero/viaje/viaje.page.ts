import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ActionSheetController, AlertController, NavController } from '@ionic/angular';
import { User } from 'firebase/auth';
import { Viaje } from 'src/app/models/viaje.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

interface ViajeConUbicacion extends Viaje {
  ubicacion?: { lat: number, lng: number };
}

@Component({
  selector: 'app-viaje',
  templateUrl: './viaje.page.html',
  styleUrls: ['./viaje.page.scss'],
})
export class ViajePage implements OnInit {
  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  viajes: ViajeConUbicacion[] = [];
  filteredViajes: ViajeConUbicacion[] = [];
  user = {} as User;

  constructor(
    private actionSheetController: ActionSheetController,
    private navCtrl: NavController,
    private firebaseService: FirebaseService,
    private alertController: AlertController,
    private router: Router
  ) {}

  ngOnInit() {
    this.user = this.utilsSvc.getFromLocalStorage('user');
  }

  ionViewWillEnter() {
    this.cargarViajesDesdeFirestore();
  }
  
  cargarViajesDesdeFirestore() {
    this.firebaseSvc.getCollectionData('viajes').subscribe(
      (viajesFirestore: Viaje[]) => {
        const viajesUsuario = viajesFirestore.filter(viaje => viaje.emailP === this.user.email);

        const viajesConUbicacion = viajesUsuario.map(viaje => {
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

        this.viajes = viajesConUbicacion;
        this.filteredViajes = this.viajes;
        console.log('Viajes combinados con ubicación:', this.viajes);
      },
      error => {
        console.error('Error al obtener los viajes desde Firestore:', error);
      }
    );
  }

  // Función para mostrar el ActionSheet y manejar la cancelación
  async presentActionSheet(viaje: ViajeConUbicacion) {
    const actionSheet = await this.actionSheetController.create({
      header: '¿Está seguro que desea eliminar este viaje?',
      buttons: [
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: async () => {
            try {
              // Actualizamos los cupos disponibles en Firestore
              await this.firebaseService.disponible(viaje.id, viaje.disponibles + 1);

              // Eliminamos el email del pasajero en Firestore
              await this.firebaseService.emailPasajerp(viaje.id, 'no hay');

              // Eliminamos el viaje del localStorage
              const viajeLocalStorageKey = `viaje_${viaje.id}_${this.user.email}`;
              if (localStorage.getItem(viajeLocalStorageKey)) {
                localStorage.removeItem(viajeLocalStorageKey);
              }

              // Eliminamos el viaje de las listas de la aplicación
              this.filteredViajes = this.filteredViajes.filter(v => v !== viaje);
              this.viajes = this.viajes.filter(v => v !== viaje);

              // Navegamos al home
              this.navCtrl.navigateRoot(['/main/home']);
              this.utilsSvc.presentToast({
                message: 'Viaje eliminado',
                duration: 3500,
                color: 'danger',
                position: 'middle',
                icon: 'trash-bin-outline',
              });
            } catch (error) {
              console.error('Error al eliminar el viaje:', error);
            }
          },
        },
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Cancelado');
          },
        },
      ],
    });

    // Mostramos el ActionSheet
    await actionSheet.present();
  }
}
