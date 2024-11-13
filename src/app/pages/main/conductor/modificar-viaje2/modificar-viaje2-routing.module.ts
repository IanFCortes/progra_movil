import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModificarViaje2Page } from './modificar-viaje2.page';

const routes: Routes = [
  {
    path: '',
    component: ModificarViaje2Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModificarViaje2PageRoutingModule {}
