import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { JuegosListaFiltroPage } from './juegos-lista-filtro.page';

const routes: Routes = [
  {
    path: '',
    component: JuegosListaFiltroPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class JuegosListaFiltroPageRoutingModule {}
