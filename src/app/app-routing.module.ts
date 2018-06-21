import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';

import {StartComponent} from './pages/start/start.component';
import {IndexComponent} from './pages/index/index.component';
import {LotteryComponent} from './pages/lottery/lottery.component';
import {VotesComponent} from './pages/votes/votes.component';

export const routes: Routes = [

  {path: '', redirectTo: '/start', pathMatch: 'full'},
  {path: 'start', component: StartComponent},
  {path: 'index', component: IndexComponent},
  {path: 'lottery', component: LotteryComponent},
  {path: 'votes', component: VotesComponent}
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
