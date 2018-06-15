import {BrowserModule} from '@angular/platform-browser';
import {NgModule, ErrorHandler} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';

import {AppRoutingModule} from './app-routing.module';

// pipes
import {PIPES_DECLARATIONS} from './pipes';

// directives
import {DIRECTIVES_DECLARATIONS} from './directives';

import {AppComponent} from './app.component';
import {IndexComponent} from './pages/index/index.component';
import {LotteryComponent} from './pages/lottery/lottery.component';
import {AppErrorComponent} from './class/error.class';

@NgModule({
  declarations: [
    AppComponent,
    IndexComponent,
    LotteryComponent,
    ...PIPES_DECLARATIONS,
    ...DIRECTIVES_DECLARATIONS
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
  ],
  providers: [
    ...PIPES_DECLARATIONS,
    {provide: ErrorHandler, useClass: AppErrorComponent}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
