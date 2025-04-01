import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GenerosPage } from './generos.page';

const routes: Routes = [
  {
    path: '',
    component: GenerosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GenerosPageRoutingModule {}
