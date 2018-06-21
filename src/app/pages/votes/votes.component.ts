import {Component, OnInit} from '@angular/core';
import {timer as observableTimer, interval as observableInterval, Observable} from 'rxjs';

import {InfiniteLoaderComponent} from 'ngx-weui';

import {VoteService} from '../../services/vote.service';

@Component({
  selector: 'app-votes',
  templateUrl: './votes.component.html',
  styleUrls: ['./votes.component.scss']
})
export class VotesComponent implements OnInit {

  votes: any[];
  currPage = 1;
  pageSize = 25;

  currItems;

  constructor(private voteSvc: VoteService) {
  }

  ngOnInit() {

    this.voteSvc.find().then(res => {
      this.votes = res;
      this.currItems = this.votes.slice(0, this.currPage * this.pageSize);
      console.log(this.currItems);
    });

  }

  onLoadMore(comp: InfiniteLoaderComponent) {
    observableTimer(500).subscribe(() => {

      this.currPage = this.currPage + 1;
      this.currItems = this.currItems.concat(this.votes.slice((this.currPage - 1) * this.pageSize, this.currPage * this.pageSize));

      if (this.currItems.length >= this.votes.length) {
        comp.setFinished();
        return;
      }

      comp.resolveLoading();
    });
  }

}
