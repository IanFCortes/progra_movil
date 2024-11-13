import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MainPage } from './main.page';

const routes: Routes = [
  {
    path: '',
    component: MainPage
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'profile',
    loadChildren: () => import('./profile/profile.module').then( m => m.ProfilePageModule)
  },  {
    path: 'home-c',
    loadChildren: () => import('./conductor/home-c/home-c.module').then( m => m.HomeCPageModule)
  },
  {
    path: 'crear-viaje',
    loadChildren: () => import('./conductor/crear-viaje/crear-viaje.module').then( m => m.CrearViajePageModule)
  },
  {
    path: 'modificar-viaje',
    loadChildren: () => import('./conductor/modificar-viaje/modificar-viaje.module').then( m => m.ModificarViajePageModule)
  },
  {
    path: 'home-p',
    loadChildren: () => import('./pasajero/home-p/home-p.module').then( m => m.HomePPageModule)
  },
  {
    path: 'help',
    loadChildren: () => import('./help/help.module').then( m => m.HelpPageModule)
  },
  {
    path: 'modificar-viaje2',
    loadChildren: () => import('./conductor/modificar-viaje2/modificar-viaje2.module').then( m => m.ModificarViaje2PageModule)
  },
  {
    path: 'pasajes',
    loadChildren: () => import('./pasajero/pasajes/pasajes.module').then( m => m.PasajesPageModule)
  },
  {
    path: 'completados',
    loadChildren: () => import('./conductor/completados/completados.module').then( m => m.CompletadosPageModule)
  },
  {
    path: 'viaje',
    loadChildren: () => import('./pasajero/viaje/viaje.module').then( m => m.ViajePageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainPageRoutingModule {}
