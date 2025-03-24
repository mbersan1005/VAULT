import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InfoJuegoPage } from './info-juego.page';

const routes: Routes = [
  {
    path: '',
    component: InfoJuegoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InfoJuegoPageRoutingModule {}
