import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PasajesPage } from './pasajes.page';

const routes: Routes = [
  {
    path: '',
    component: PasajesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PasajesPageRoutingModule {}
