import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DesarrolladorasPage } from './desarrolladoras.page';

const routes: Routes = [
  {
    path: '',
    component: DesarrolladorasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DesarrolladorasPageRoutingModule {}
