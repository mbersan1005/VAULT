import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AgregarJuegoPage } from './agregar-juego.page';

const routes: Routes = [
  {
    path: '',
    component: AgregarJuegoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AgregarJuegoPageRoutingModule {}
