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
import {StartComponent} from './pages/start/start.component';
import {IndexComponent} from './pages/index/index.component';
import {LotteryComponent} from './pages/lottery/lottery.component';
import {VotesComponent} from './pages/votes/votes.component';
import {AppErrorComponent} from './class/error.class';

@NgModule({
  declarations: [
    AppComponent,
    AppErrorComponent,
    StartComponent,
    IndexComponent,
    LotteryComponent,
    VotesComponent,
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
