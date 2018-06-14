import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';

import {IndexComponent} from './pages/index/index.component';

export const routes: Routes = [

  {path: '', redirectTo: '/index', pathMatch: 'full'},
  {path: 'index', component: IndexComponent}
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    CommonModule
  ],
  exports: [RouterModule],
  declarations: []
})
export class AppRoutingModule {
}
