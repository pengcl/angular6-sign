import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';

import {StartComponent} from './pages/start/start.component';
import {IndexComponent} from './pages/index/index.component';
import {RuleComponent} from './pages/rule/rule.component';
import {LotteryComponent} from './pages/lottery/lottery.component';

export const routes: Routes = [

  {path: '', redirectTo: '/start', pathMatch: 'full'},
  {path: 'start', component: StartComponent},
  {path: 'index', component: IndexComponent},
  {path: 'rule', component: RuleComponent},
  {path: 'lottery', component: LotteryComponent}
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
