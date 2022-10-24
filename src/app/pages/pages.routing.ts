import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { AuthGuard } from '../guards/auth.guard';

import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { Grafica1Component } from './grafica1/grafica1.component';
import { ProgressComponent } from './progress/progress.component';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { PromesasComponent } from './promesas/promesas.component';
import { RxjsComponent } from './rxjs/rxjs.component';
import { PerfilComponent } from './perfil/perfil.component';

const routes: Routes = [
  // rutas protegidas
  {
    path: 'dashboard',
    component: PagesComponent,
    canActivate: [AuthGuard],
    children: [
      // estas son las rutas hijas, que tienen plantilla similar
      {
        path: '',
        component: DashboardComponent,
        data: { titulo: 'Dashboard' },
      },
      {
        path: 'progress',
        component: ProgressComponent,
        data: { titulo: 'Progress Bar' },
      },
      {
        path: 'grafica1',
        component: Grafica1Component,
        data: { titulo: 'Graphics' },
      },
      {
        path: 'account-settings',
        component: AccountSettingsComponent,
        data: { titulo: 'Account Settings' },
      },
      {
        path: 'promesas',
        component: PromesasComponent,
        data: { titulo: 'Promises' },
      },
      {
        path: 'rxjs',
        component: RxjsComponent,
        data: { titulo: 'RxJs' },
      },
      {
        path: 'perfil',
        component: PerfilComponent,
        data: { titulo: 'Perfil de usuario' },
      },
    ],
  },

  //{ path: 'path/:routeParam', component: MyComponent },
  //{ path: 'staticPath', component: ... },
  //{ path: '**', component: ... },
  //{ path: 'oldPath', redirectTo: '/staticPath' },
  //{ path: ..., component: ..., data: { message: 'Custom' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {}
