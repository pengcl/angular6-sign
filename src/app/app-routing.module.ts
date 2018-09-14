import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';

import {IndexComponent} from './pages/index/index.component';
import {ResultComponent} from './pages/result/result.component';
import {SignInComponent} from './pages/auth/sign-in/sign-in.component';
import {AdminComponent} from './pages/admin/admin.component';
import {AdminCityAddComponent} from './pages/admin/city/add/add.component';
import {AdminCityEditComponent} from './pages/admin/city/edit/edit.component';
import {AdminCityListComponent} from './pages/admin/city/list/list.component';

import {AdminCourseListComponent} from './pages/admin/course/list/list.component';
import {AdminCourseAddComponent} from './pages/admin/course/add/add.component';
import {AdminCourseEditComponent} from './pages/admin/course/edit/edit.component';

import {AdminSignListComponent} from './pages/admin/sign/list/list.component';
import {AdminSignItemComponent} from './pages/admin/sign/item/item.component';

import {AuthGuard} from './_guards/auth';

export const routes: Routes = [
  {path: '', redirectTo: '/index', pathMatch: 'full'},
  {path: 'index', component: IndexComponent},
  {path: 'result', component: ResultComponent},
  {path: 'signIn', component: SignInComponent},
  {path: 'admin', component: AdminComponent, canActivate: [AuthGuard]},
  {path: 'admin/city/list', component: AdminCityListComponent, canActivate: [AuthGuard]},
  {path: 'admin/city/add', component: AdminCityAddComponent, canActivate: [AuthGuard]},
  {path: 'admin/city/edit/:id', component: AdminCityEditComponent, canActivate: [AuthGuard]},
  {path: 'admin/course/list', component: AdminCourseListComponent, canActivate: [AuthGuard]},
  {path: 'admin/course/add', component: AdminCourseAddComponent, canActivate: [AuthGuard]},
  {path: 'admin/course/edit/:id', component: AdminCourseEditComponent, canActivate: [AuthGuard]},
  {path: 'admin/sign/list', component: AdminSignListComponent, canActivate: [AuthGuard]},
  {path: 'admin/sign/item/:id', component: AdminSignItemComponent, canActivate: [AuthGuard]}
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    CommonModule
  ],
  exports: [RouterModule],
  providers: [
    AuthGuard
  ],
  declarations: []
})
export class AppRoutingModule {
}
