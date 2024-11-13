import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModificarViajePageRoutingModule } from './modificar-viaje-routing.module';

import { ModificarViajePage } from './modificar-viaje.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModificarViajePageRoutingModule,
    SharedModule,
    ReactiveFormsModule
  ],
  declarations: [ModificarViajePage]
})
export class ModificarViajePageModule {}
