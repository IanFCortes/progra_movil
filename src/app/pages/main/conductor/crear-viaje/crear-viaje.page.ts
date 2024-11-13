import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { User } from 'firebase/auth';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-crear-viaje',
  templateUrl: './crear-viaje.page.html',
  styleUrls: ['./crear-viaje.page.scss'],
})
export class CrearViajePage implements OnInit {

  form = new FormGroup({
    id: new FormControl(''),
    patente: new FormControl('',[Validators.required,Validators.minLength(6), Validators.maxLength(6),Validators.pattern('[a-zA-Z0-9 ]*')]),
    salida: new FormControl('', [Validators.required]),
    destino: new FormControl('',[Validators.required, Validators.minLength(3), Validators.maxLength(30),Validators.pattern('[a-zA-Z ]*')]),
    coste: new FormControl('',[Validators.required, Validators.min(0),Validators.max(99999),Validators.pattern('[0-9]*')]),
    pasajeros: new FormControl('',[Validators.required, Validators.min(1),Validators.max(9),Validators.pattern('[0-9]*')]),
    disponibles : new FormControl(''),
    email : new FormControl(''),
    emailP : new FormControl(''),
    completo: new FormControl(false),
  })

  user = {} as User;
  ngOnInit() {
    this.user = this.utilsSvc.getFromLocalStorage('user');
    
  }

  constructor(private navCtrl: NavController) {}

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);


  async submit() {
    if (this.form.valid) {

      let path ='/viajes'
      const loading = await this.utilsSvc.loading();
      await loading.present();

      delete this.form.value.id;
      
      this.form.value.email = this.user.email;
      this.form.value.disponibles = this.form.value.pasajeros;
      this.form.value.emailP = "none"

      this.firebaseSvc.addDocument(path, this.form.value).then(async res => {

        this.navCtrl.navigateRoot(['/main/home']);
       
        this.utilsSvc.presentToast({
          message: 'Viaje creado exitosamente',
          duration: 3500,
          color: 'success',
          position: 'middle',
          icon: 'checkmark-circle-outline'
        })
        

      }).catch(error => {
        console.log(error);

        this.utilsSvc.presentToast({
          message: error.message,
          duration: 3500,
          color: 'secondary',
          position: 'middle',
          icon: 'alert-circle-outline'
        })

      }).finally(() => {
        loading.dismiss();
      })
    }
  }

  
  
}
