import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RiosPageRoutingModule } from './rios-routing.module';

import { RiosPage } from './rios.page';

import { IonicStorageModule } from '@ionic/storage-angular';

import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RiosPageRoutingModule,
    IonicStorageModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  declarations: [RiosPage]
})
export class RiosPageModule {}
