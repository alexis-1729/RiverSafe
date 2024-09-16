import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AlertaDispositivoPage } from './alerta-dispositivo.page';

const routes: Routes = [
  {
    path: '',
    component: AlertaDispositivoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AlertaDispositivoPageRoutingModule {}
