import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AlertaDispositivoPageRoutingModule } from './alerta-dispositivo-routing.module';

import { AlertaDispositivoPage } from './alerta-dispositivo.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AlertaDispositivoPageRoutingModule
  ],
  declarations: [AlertaDispositivoPage]
})
export class AlertaDispositivoPageModule {}
