import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomeCPageRoutingModule } from './home-c-routing.module';

import { HomeCPage } from './home-c.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomeCPageRoutingModule
  ],
  declarations: [HomeCPage]
})
export class HomeCPageModule {}
