import { Component, OnInit, inject } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { User } from 'src/app/models/user.model';
import { Viaje } from 'src/app/models/viaje.model';

@Component({
  selector: 'app-completados',
  templateUrl: './completados.page.html',
  styleUrls: ['./completados.page.scss'],
})
export class CompletadosPage implements OnInit {

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  viajes: Viaje[] = [];
  usuarioLogeado: User;

  ngOnInit() {
    this.usuarioLogeado = this.user();
    this.getViajesCompletados();
  }

  user(): User {
    return this.utilsSvc.getFromLocalStorage('user');
  }

  getViajesCompletados() {
    let path = '/viajes';

    let sub = this.firebaseSvc.getCollectionData(path).subscribe({
      next: (res: any) => {
        console.log(res);
        this.viajes = res.filter(viaje => viaje.email === this.usuarioLogeado.email && viaje.completo);
        sub.unsubscribe();
      },
      error: (error) => {
        console.error(error);
      }
    });
  }
}
