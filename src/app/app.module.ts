import {BrowserModule} from '@angular/platform-browser';
import {NgModule, ErrorHandler} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';

import {AppRoutingModule} from './app-routing.module';

// pipes
import {PIPES_DECLARATIONS} from './pipes';

// directives
import {DIRECTIVES_DECLARATIONS} from './directives';

import {WeUiModule} from 'ngx-weui';
import {WxModule} from './modules/wx';

import {AppComponent} from './app.component';
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

import {AppErrorComponent} from './class/error.class';

@NgModule({
  declarations: [
    AppComponent,
    AppErrorComponent,
    IndexComponent,
    ResultComponent,
    SignInComponent,
    AdminComponent,
    AdminCityListComponent,
    AdminCityAddComponent,
    AdminCityEditComponent,
    AdminCourseListComponent,
    AdminCourseAddComponent,
    AdminCourseEditComponent,
    ...PIPES_DECLARATIONS,
    ...DIRECTIVES_DECLARATIONS
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
    WeUiModule.forRoot(),
    WxModule.forRoot()
  ],
  providers: [
    ...PIPES_DECLARATIONS,
    {provide: ErrorHandler, useClass: AppErrorComponent}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
