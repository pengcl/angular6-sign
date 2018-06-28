import {Component, OnInit} from '@angular/core';
import {timer as observableTimer, interval as observableInterval, Observable} from 'rxjs';

import {InfiniteLoaderComponent} from 'ngx-weui';

import {CountriesService} from '../../services/countries.service';
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

  countries;
  promotions = [];

  constructor(private countriesSvc: CountriesService,
              private voteSvc: VoteService) {
  }

  ngOnInit() {

    this.countriesSvc.find().then(res => res.filter(item => item.ranking === 16)).then(promotions => {
      const prom = [];
      promotions.forEach(item => {
        prom.push(item._id);
      });
      this.voteSvc.find().then(res => {
        this.votes = res;
        this.currItems = this.votes.slice(0, this.currPage * this.pageSize);
        this.votes.forEach((vote, index) => {
          let votes = [];
          for (const key in vote.vote) {
            if (vote.vote[key]) {
              vote.vote[key].split(',');
              if (votes.length === 0) {
                votes = vote.vote[key].split(',');
              } else {
                votes = votes.concat(vote.vote[key].split(','));
              }
            }
          }
          let count = 0;
          votes.forEach(item => {
            if (prom.indexOf(item) !== -1) {
              count = count + 1;
            }
          });
          if (count >= 4) {
            this.promotions.push(this.votes[index]);
          }
        });
      });
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
