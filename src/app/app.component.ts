import { Component, inject } from '@angular/core';
import { FirebaseService } from './services/firebase.service';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  
  firebaseSvc = inject(FirebaseService);

  constructor(private menuController: MenuController) {}

      // === Cerrar sesion ===
      signOut() {
        this.firebaseSvc.signOut();
        this.menuController.close();
      }

      closed() {
        this.menuController.close();
      }

}
