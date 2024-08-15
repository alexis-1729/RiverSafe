import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RiosPage } from './rios.page';

const routes: Routes = [
  {
    path: '',
    component: RiosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RiosPageRoutingModule {}
