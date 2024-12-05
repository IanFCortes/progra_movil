import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { initializeApp, FirebaseError, getApp, FirebaseApp } from 'firebase/app';
import { environment } from '../../../environments/environment';
import { UtilsService } from 'src/app/services/utils.service';

let app: FirebaseApp, auth;

try {
  if (!getApp()) {  // Verifica si Firebase ya está inicializado
    app = initializeApp(environment.firebaseConfig);
    auth = getAuth(app);
    console.log('Firebase inicializado correctamente');
  } else {
    app = getApp();
    auth = getAuth(app);
  }
} catch (error: FirebaseError | any) {
  console.error('Error al inicializar Firebase:', error.message);
}

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {
  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  constructor(private utilsSvc: UtilsService) {}

  ngOnInit() {
    console.log('AuthPage cargado correctamente');
  }

  async submit() {
    if (this.form.valid) {
      const loading = await this.utilsSvc.loading();
      await loading.present();

      try {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          this.form.value.email!,
          this.form.value.password!
        );

        this.utilsSvc.saveInLocalStorage('user', {
          uid: userCredential.user.uid,
          email: userCredential.user.email,
          name: userCredential.user.displayName || 'Usuario',
        });

        this.utilsSvc.routerLink('/main/home');
        this.utilsSvc.presentToast({
          message: `Bienvenido ${userCredential.user.email}`,
          duration: 1500,
          color: 'success',
          position: 'middle',
          icon: 'checkmark-circle-outline',
        });
        this.form.reset();
      } catch (error: any) {
        console.error('Error de autenticación:', error.message);

        this.utilsSvc.presentToast({
          message: 'Credenciales incorrectas. Intente nuevamente.',
          duration: 3500,
          color: 'danger',
          position: 'middle',
          icon: 'alert-circle-outline',
        });
      } finally {
        loading.dismiss();
      }
    }
  }
}
