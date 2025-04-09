import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditarJuegoPage } from './editar-juego.page';

const routes: Routes = [
  {
    path: '',
    component: EditarJuegoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditarJuegoPageRoutingModule {}
