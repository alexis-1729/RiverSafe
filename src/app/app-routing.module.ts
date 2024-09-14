import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'rios',
    loadChildren: () => import('./rios/rios.module').then( m => m.RiosPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'datos-sensores',
    loadChildren: () => import('./rios/datos-sensores/datos-sensores.module').then( m => m.DatosSensoresPageModule)

  },
  {
  path: 'register',
    loadChildren: () => import('./register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'foro',
    loadChildren: () => import('./foro/foro.module').then( m => m.ForoPageModule)
  },
  {
    path: 'crear-mensaje',
    loadChildren: () => import('./crear-mensaje/crear-mensaje.module').then( m => m.CrearMensajePageModule)
  }


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
