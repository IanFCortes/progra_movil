import { Component, OnInit, inject } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { Viaje } from 'src/app/models/viaje.model';

import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-home-p',
  templateUrl: './home-p.page.html',
  styleUrls: ['./home-p.page.scss'],
})
export class HomePPage implements OnInit {

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  viajes: Viaje[] = [];

  
  
  ngOnInit() {
  }
  
  user () : User{
    return this.utilsSvc.getFromLocalStorage('user')
  }
  ionViewWillEnter(){
   this.getViajes();
  }

  getViajes(){
    let path ='/viajes';

    let sub = this.firebaseSvc.getCollectionData(path).subscribe({
      next: (res: any)=> {
        console.log(res);
        this.viajes = res;
        sub.unsubscribe();
      }
    })
  }

  restar(v : Viaje){

    if (v.pasajeros > 0){
      v.pasajeros--;
    }
    else{
      this.utilsSvc.presentToast({
        message: 'no hay cupos disponibles',
        duration: 3500,
        color: 'danger',
        position: 'middle',
        icon: 'checkmark-circle-outline'
      })
    }

  }
}
