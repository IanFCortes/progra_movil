import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeCPage } from './home-c.page';

const routes: Routes = [
  {
    path: '',
    component: HomeCPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeCPageRoutingModule {}
