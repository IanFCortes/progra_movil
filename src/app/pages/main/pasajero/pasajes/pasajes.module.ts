import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PasajesPageRoutingModule } from './pasajes-routing.module';

import { PasajesPage } from './pasajes.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PasajesPageRoutingModule
  ],
  declarations: [PasajesPage]
})
export class PasajesPageModule {}
