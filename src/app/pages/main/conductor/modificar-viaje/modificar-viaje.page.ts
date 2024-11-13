import { Component, OnInit, inject } from '@angular/core';
import { ActionSheetController, AlertController, NavController } from '@ionic/angular';
import { User } from 'src/app/models/user.model';
import { Viaje } from 'src/app/models/viaje.model';
import { Router } from '@angular/router';

import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-modificar-viaje',
  templateUrl: './modificar-viaje.page.html',
  styleUrls: ['./modificar-viaje.page.scss'],
})
export class ModificarViajePage implements OnInit {

  constructor(
    private actionSheetController: ActionSheetController,
    private navCtrl: NavController,
    private firebaseService: FirebaseService,
    private alertController: AlertController,
    private router: Router
  ) { }

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  viajes: Viaje[] = [];
  filteredViajes: Viaje[] = [];
  usuarioLogeado: User;

  async presentActionSheet(viaje: Viaje) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Opciones de Modificación',
      buttons: [
        {
          text: 'Modificar Detalles',
          handler: () => {
            this.router.navigate(['/main/modificar-viaje2', { viajeId: viaje.id, viajeData: JSON.stringify(viaje) }]);
          }
        },
        {
          text: 'Completar Viaje',
          role: 'complete',
          handler: async () => {
            const confirmAlert = await this.alertController.create({
              header: 'Confirmar Completar Viaje',
              message: '¿Estás seguro de que deseas marcar este viaje como completo?',
              buttons: [
                {
                  text: 'Cancelar',
                  role: 'cancel',
                  handler: () => {
                    console.log('Canceló la completitud del viaje');
                  }
                },
                {
                  text: 'Confirmar',
                  handler: async () => {
                    try {
                      await this.firebaseService.marcarViajeCompleto(viaje.id);
                      console.log('Completar viaje clicked', viaje);
                      this.filteredViajes = this.filteredViajes.filter(v => v !== viaje);
                    } catch (error) {
                      console.error('Error al completar el viaje:', error);
                    }
                  }
                }
              ]
            });
            await confirmAlert.present();
          }
        },
        {
          text: 'Cancelar Viaje',
          role: 'destructive',
          handler: () => {
            this.cancelarViaje(viaje);
          }
        },
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Cancelar clicked');
          }
        }
      ]
    });
    await actionSheet.present();
  }

  async cancelarViaje(viaje: Viaje) {
    const confirmAlert = await this.alertController.create({
      header: 'Confirmar Cancelación',
      message: '¿Estás seguro de que deseas cancelar este viaje?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Canceló la cancelación del viaje');
          }
        },
        {
          text: 'Confirmar',
          handler: async () => {
            try {
              // Llama al método de tu servicio para eliminar el viaje
              await this.firebaseService.eliminarViaje(viaje.id);
  
              // Actualiza la lista local
              this.filteredViajes = this.filteredViajes.filter(v => v !== viaje);
  
              console.log('Cancelar viaje clicked', viaje);
            } catch (error) {
              console.error('Error al cancelar el viaje:', error);
            }
          }
        }
      ]
    });
    await confirmAlert.present();
  }

  ngOnInit() {
    this.usuarioLogeado = this.user();
  }

  user(): User {
    return this.utilsSvc.getFromLocalStorage('user');
  }

  ionViewWillEnter() {
    this.getViajes();
    this.filteredViajes = this.viajes;
  }

  filterViajes(event: any) {
    const searchTerm = event.detail.value.toLowerCase();

    this.filteredViajes = this.viajes.filter(viaje =>
      viaje.destino.toLowerCase().includes(searchTerm)
    );
  }

  getViajes() {
    let path = '/viajes';

    let sub = this.firebaseSvc.getCollectionData(path).subscribe({
      next: (res: any) => {
        console.log(res);
        this.viajes = res.filter(viaje => viaje.email === this.usuarioLogeado.email && !viaje.completo);
        this.filteredViajes = this.viajes;
        sub.unsubscribe();
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

}
