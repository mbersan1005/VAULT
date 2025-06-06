import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { autentificadorGuard } from './guards/autentificador.guard';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./vistas/home/home.module').then(m => m.HomePageModule)
  },
  {
    path: 'info-juego/:id',
    loadChildren: () => import('./vistas/info-juego/info-juego.module').then(m => m.InfoJuegoPageModule)
  },
  {
    path: 'admin-login',
    loadChildren: () => import('./vistas/admin-login/admin-login.module').then(m => m.AdminLoginPageModule)  
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'generos',
    loadChildren: () => import('./vistas/generos/generos.module').then(m => m.GenerosPageModule)
  },
  {
    path: 'generos/:nombre',
    loadChildren: () => import('./vistas/juegos-lista-filtro/juegos-lista-filtro.module').then(m => m.JuegosListaFiltroPageModule)
  },
  {
    path: 'plataformas',
    loadChildren: () => import('./vistas/plataformas/plataformas.module').then(m => m.PlataformasPageModule)
  },
  {
    path: 'plataformas/:nombre',
    loadChildren: () => import('./vistas/juegos-lista-filtro/juegos-lista-filtro.module').then(m => m.JuegosListaFiltroPageModule)
  },
  {
    path: 'tiendas',
    loadChildren: () => import('./vistas/tiendas/tiendas.module').then(m => m.TiendasPageModule)
  },
  {
    path: 'tiendas/:nombre',
    loadChildren: () => import('./vistas/juegos-lista-filtro/juegos-lista-filtro.module').then(m => m.JuegosListaFiltroPageModule)
  },
  {
    path: 'desarrolladoras',
    loadChildren: () => import('./vistas/desarrolladoras/desarrolladoras.module').then(m => m.DesarrolladorasPageModule)
  },
  {
    path: 'desarrolladoras/:nombre',
    loadChildren: () => import('./vistas/juegos-lista-filtro/juegos-lista-filtro.module').then(m => m.JuegosListaFiltroPageModule)
  },
  {
    path: 'publishers',
    loadChildren: () => import('./vistas/publishers/publishers.module').then(m => m.PublishersPageModule)
  },
  {
    path: 'publishers/:nombre',
    loadChildren: () => import('./vistas/juegos-lista-filtro/juegos-lista-filtro.module').then(m => m.JuegosListaFiltroPageModule)
  },
  {
    path: 'juegos-lista-filtro/:categoria/:nombre',
    loadChildren: () => import('./vistas/juegos-lista-filtro/juegos-lista-filtro.module').then(m => m.JuegosListaFiltroPageModule)
  },
  {
    path: 'agregar-juego',
    loadChildren: () => import('./vistas/agregar-juego/agregar-juego.module').then( m => m.AgregarJuegoPageModule),
    canActivate: [autentificadorGuard]
  },
  {
    path: 'editar-juego/:id',
    loadChildren: () => import('./vistas/editar-juego/editar-juego.module').then( m => m.EditarJuegoPageModule),
    canActivate: [autentificadorGuard]
  },
  {
    path: '**',
    redirectTo: 'home',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' }) 
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
