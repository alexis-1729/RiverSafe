import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CrearMensajePage } from './crear-mensaje.page';

const routes: Routes = [
  {
    path: '',
    component: CrearMensajePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CrearMensajePageRoutingModule {}
