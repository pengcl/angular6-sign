import {Component, OnInit, OnDestroy} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {Config} from '../../config';

import {UserService} from '../../services/user.service';
import {CountriesService} from '../../services/countries.service';
import {VoteService} from '../../services/vote.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit, OnDestroy {

  ticket;
  user;
  vote;
  voteForm: FormGroup;

  group;

  constructor(private route: ActivatedRoute,
              private userSvc: UserService,
              private countriesSvc: CountriesService,
              private voteSvc: VoteService) {
  }

  ngOnInit() {
    console.log('index');

    this.voteForm = new FormGroup({
      owner: new FormControl('', [Validators.required]),
      nickName: new FormControl('', [Validators.required]),
      avatar: new FormControl('', [Validators.required]),
      vote: new FormGroup({
        A: new FormControl('', [Validators.required]),
        B: new FormControl('', [Validators.required]),
        C: new FormControl('', [Validators.required]),
        D: new FormControl('', [Validators.required]),
        E: new FormControl('', [Validators.required]),
        F: new FormControl('', [Validators.required]),
        G: new FormControl('', [Validators.required]),
        H: new FormControl('', [Validators.required]),
      })
    });

    if (!this.route.snapshot.queryParams['Ticket']) {
      window.location.href = this.userSvc.getTicket(window.location.href);
    } else {
      this.ticket = this.route.snapshot.queryParams['Ticket'];
      this.userSvc.getUserToken(this.ticket).then(res => {
        console.log(res);
        if (res.body.Code === 1) {
          this.user = res.body.Data.OpenUserId;
          this.voteForm.get('owner').setValue(this.user);
          this.voteForm.get('nickName').setValue(res.body.Data.NickName);
          this.voteForm.get('avatar').setValue(res.body.Data.Avatar);

          this.voteSvc.find(this.user).then(vote => {
            console.log(vote);
            if (vote) {
              this.vote = vote;
            }
          });

          /*this.audioSvc.find(this.user).then(res => {
            if (res) {
              this.audioReady = true;
              this.uploaded = true;
              this.onShow(2);
              const that = this;
              this.serverId = res.serverId;
            }
          });*/

        } else {
          console.log('ticket过期');
          window.location.href = this.userSvc.getTicket(Config.webHost + '/index');
        }
      });
    }

    this.countriesSvc.find().then(res => {
      const group = {};
      const arr = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
      res.slice(0, 8).forEach((item, i) => {
        // mock vote start

        this.voteForm.get('vote').get(arr[i]).setValue(item._id + ':' + item.country);

        // mock vote end
      });
      res.forEach(item => {
        if (group[item.group]) {
          group[item.group].push(item);
        } else {
          group[item.group] = [];
          group[item.group].push(item);
        }
      });

      this.voteSvc.vote(this.voteForm.value).then(result => {
        console.log(result);
      });

      this.group = group;
    });
  }

  setCountry(country) {
    console.log(country);
  }

  ngOnDestroy() {
  }

}
