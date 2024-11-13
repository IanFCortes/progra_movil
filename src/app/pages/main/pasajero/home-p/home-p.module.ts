import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomePPageRoutingModule } from './home-p-routing.module';

import { HomePPage } from './home-p.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePPageRoutingModule
  ],
  declarations: [HomePPage]
})
export class HomePPageModule {}
