import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CompletadosPage } from './completados.page';

const routes: Routes = [
  {
    path: '',
    component: CompletadosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CompletadosPageRoutingModule {}
