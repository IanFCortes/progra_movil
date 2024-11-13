import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Viaje } from 'src/app/models/viaje.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { NavController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-modificar-viaje2',
  templateUrl: './modificar-viaje2.page.html',
  styleUrls: ['./modificar-viaje2.page.scss'],
})

export class ModificarViaje2Page implements OnInit {
  viajeId: string;
  viajeData: Viaje;

  constructor(
    private activatedRoute: ActivatedRoute,
    private firebaseService: FirebaseService,
    private navCtrl: NavController,
    private toastController: ToastController
  ) {}
  

  ngOnInit() {
    this.viajeData = JSON.parse(this.activatedRoute.snapshot.paramMap.get('viajeData'));
  }

  async guardarCambios() {
    try {
      await this.firebaseService.actualizarViaje(this.viajeData.id, this.viajeData);
      
      const toast = await this.toastController.create({
        message: 'Guardado con éxito',
        duration: 2000,
        position: 'middle',
        color: 'success'
      });
      toast.present();
  
      this.navCtrl.navigateBack(['/main/home']);
    } catch (error) {
      console.error('Error al actualizar el viaje:', error);
    }
  }
}

