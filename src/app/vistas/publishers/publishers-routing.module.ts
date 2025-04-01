import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PublishersPage } from './publishers.page';

const routes: Routes = [
  {
    path: '',
    component: PublishersPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PublishersPageRoutingModule {}
