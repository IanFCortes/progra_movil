import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CompletadosPageRoutingModule } from './completados-routing.module';

import { CompletadosPage } from './completados.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CompletadosPageRoutingModule
  ],
  declarations: [CompletadosPage]
})
export class CompletadosPageModule {}
