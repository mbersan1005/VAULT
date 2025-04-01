import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PlataformasPage } from './plataformas.page';

const routes: Routes = [
  {
    path: '',
    component: PlataformasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlataformasPageRoutingModule {}
