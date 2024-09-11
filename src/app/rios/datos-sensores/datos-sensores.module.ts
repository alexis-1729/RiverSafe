import { NgChartsModule } from 'ng2-charts'
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DatosSensoresPageRoutingModule } from './datos-sensores-routing.module';

import { DatosSensoresPage } from './datos-sensores.page';

@NgModule({
  imports: [
    NgChartsModule,
    CommonModule,
    FormsModule,
    IonicModule,
    DatosSensoresPageRoutingModule
  ],
  declarations: [DatosSensoresPage]
})
export class DatosSensoresPageModule {}
