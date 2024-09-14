import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CrearMensajePageRoutingModule } from './crear-mensaje-routing.module';
import { CrearMensajePage } from './crear-mensaje.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CrearMensajePageRoutingModule
  ],
  declarations: [CrearMensajePage]
})
export class CrearMensajePageModule { }
