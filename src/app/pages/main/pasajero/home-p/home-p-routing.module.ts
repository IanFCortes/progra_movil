import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomePPage } from './home-p.page';

const routes: Routes = [
  {
    path: '',
    component: HomePPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomePPageRoutingModule {}
