import { Component, OnInit, inject } from '@angular/core';
import { RouteConfigLoadStart, Router } from '@angular/router';
import { ActionSheetController, AlertController, IonButton, IonButtons, NavController } from '@ionic/angular';
import { User } from 'firebase/auth';
import { Viaje } from 'src/app/models/viaje.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-viaje',
  templateUrl: './viaje.page.html',
  styleUrls: ['./viaje.page.scss'],
})
export class ViajePage implements OnInit {

  constructor(
    private actionSheetController: ActionSheetController,
    private navCtrl: NavController,
    private firebaseService: FirebaseService,
    private alertController: AlertController,
    private router: Router
    ) { 
    
  }

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  viajes: Viaje[] = [];
  filteredViajes: Viaje[] = [];
  usuarioLogeado: User;
  user = {} as User;

  

  ngOnInit() {
    
    this.user = this.utilsSvc.getFromLocalStorage('user');
  }
  ionViewWillEnter() {
    this.getViajes();
    this.filteredViajes = this.viajes;
  }
  

  getViajes() {
    let path = '/viajes';

    let sub = this.firebaseSvc.getCollectionData(path).subscribe({
      next: (res: any) => {
        console.log(res);
        this.viajes = res.filter(viaje => viaje.emailP === this.user.email && !viaje.completo);
        this.filteredViajes = this.viajes;
        sub.unsubscribe();
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  async presentActionSheet(viaje: Viaje) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Esta seguro que desea eliminar?',
      buttons: [
        {
          text: 'Eliminar',
          role: 'complete',
          handler: async () => {
            // Lógica para marcar el viaje como completo
            try {

              
              
              await this.firebaseService.disponible(viaje.id, viaje.disponibles+1);              
              await this.firebaseService.emailPasajerp(viaje.id, "no hay");
              
              
              
              console.log('Completar viaje clicked', viaje);
              this.filteredViajes = this.filteredViajes.filter(v => v !== viaje);
              
              
              this.navCtrl.navigateRoot(['/main/home']);
              
              this.utilsSvc.presentToast({
                message: 'Viaje eliminado',
                duration: 3500,
                color: 'danger',
                position: 'middle',
                icon: 'checkmark-circle-outline'
              })

            } catch (error) {
              console.error('Error al completar el viaje:', error);
            }
          }
        },
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            // Lógica al cancelar el Action Sheet
            console.log('Cancelar clicked');
          }
        }
      ]
    });

    await actionSheet.present();
  }
}
