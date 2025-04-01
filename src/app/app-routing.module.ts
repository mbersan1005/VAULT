import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
  },
  {
    path: 'info-juego/:id',
    loadChildren: () => import('./info-juego/info-juego.module').then(m => m.InfoJuegoPageModule)
  },
  {
    path: 'admin-login',
    loadChildren: () => import('./admin-login/admin-login.module').then(m => m.AdminLoginPageModule)  
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'generos',
    loadChildren: () => import('./generos/generos.module').then( m => m.GenerosPageModule)
  },
  {
    path: 'plataformas',
    loadChildren: () => import('./plataformas/plataformas.module').then( m => m.PlataformasPageModule)
  },
  {
    path: 'tiendas',
    loadChildren: () => import('./tiendas/tiendas.module').then( m => m.TiendasPageModule)
  },
  {
    path: 'desarrolladoras',
    loadChildren: () => import('./desarrolladoras/desarrolladoras.module').then( m => m.DesarrolladorasPageModule)
  },
  {
    path: 'publishers',
    loadChildren: () => import('./publishers/publishers.module').then( m => m.PublishersPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
