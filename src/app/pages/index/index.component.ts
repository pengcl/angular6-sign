import {Component, OnInit, OnDestroy} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {Config} from '../../config';

import {UserService} from '../../services/user.service';
import {CountriesService} from '../../services/countries.service';
import {VoteService} from '../../services/vote.service';
import {StorageService} from '../../services/storage.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {

  ticket;
  user;
  vote;
  voteForm: FormGroup;

  group;
  _vote = {
    A: ['', ''],
    B: ['', ''],
    C: ['', ''],
    D: ['', ''],
    E: ['', ''],
    F: ['', ''],
    G: ['', ''],
    H: ['', '']
  };

  constructor(private route: ActivatedRoute,
              private storageSvc: StorageService,
              private userSvc: UserService,
              private countriesSvc: CountriesService,
              private voteSvc: VoteService) {
  }

  ngOnInit() {

    this.voteForm = new FormGroup({
      owner: new FormControl('', [Validators.required]),
      nickName: new FormControl('', [Validators.required]),
      avatar: new FormControl('', [Validators.required]),
      vote: new FormGroup({
        A: new FormControl('', [Validators.required, Validators.maxLength(2)]),
        B: new FormControl('', [Validators.required, Validators.maxLength(2)]),
        C: new FormControl('', [Validators.required, Validators.maxLength(2)]),
        D: new FormControl('', [Validators.required, Validators.maxLength(2)]),
        E: new FormControl('', [Validators.required, Validators.maxLength(2)]),
        F: new FormControl('', [Validators.required, Validators.maxLength(2)]),
        G: new FormControl('', [Validators.required, Validators.maxLength(2)]),
        H: new FormControl('', [Validators.required, Validators.maxLength(2)]),
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
          this.storageSvc.set('user', this.user);
          this.voteForm.get('owner').setValue(this.user);
          this.voteForm.get('nickName').setValue(res.body.Data.NickName);
          this.voteForm.get('avatar').setValue(res.body.Data.Avatar);

          this.voteSvc.find(this.user).then(vote => {
            if (vote) {
              this.vote = vote;
            }
          });

        } else {
          console.log('ticket过期');
          window.location.href = this.userSvc.getTicket(Config.webHost + '/index');
        }
      });
    }

    this.countriesSvc.find().then(res => {
      const group = {};

      res.forEach(item => {
        if (group[item.group]) {
          group[item.group].push(item);
        } else {
          group[item.group] = [];
          group[item.group].push(item);
        }
      });

      /*this.voteSvc.vote(this.voteForm.value).then(result => {
        console.log(result);
      });*/

      this.group = group;
    });
  }

  setCountry(country) {
    const group = this.voteForm.get('vote').get(country.group).value.split(',');
    if (group.length < 2) {
      group.push(country._id);
    } else {
      group.unshift(country._id);
      group.pop();
    }

    let value = '';
    group.forEach(item => {
      if (value) {
        value = value + ',' + item;
      } else {
        value = item;
      }
    });

    this.voteForm.get('vote').get(country.group).setValue(value);

    const values = this.voteForm.get('vote').value;
    let _length = 0;
    for (const item in values) {
      if (item) {
        _length = _length + values[item].split(',').length;
      }
    }
    console.log(_length);
  }

}
