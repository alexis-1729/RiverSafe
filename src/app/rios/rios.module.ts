import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RiosPageRoutingModule } from './rios-routing.module';

import { RiosPage } from './rios.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RiosPageRoutingModule
  ],
  declarations: [RiosPage]
})
export class RiosPageModule {}
