import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModificarViaje2PageRoutingModule } from './modificar-viaje2-routing.module';

import { ModificarViaje2Page } from './modificar-viaje2.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModificarViaje2PageRoutingModule,
    ReactiveFormsModule,
    SharedModule
  ],
  declarations: [ModificarViaje2Page]
})
export class ModificarViaje2PageModule {}
