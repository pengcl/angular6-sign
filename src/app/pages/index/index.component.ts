import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {Config} from '../../config';

import {UserService} from '../../services/user.service';
import {CountriesService} from '../../services/countries.service';
import {VoteService} from '../../services/vote.service';
import {LotteryService} from '../../services/lottery.service';
import {StorageService} from '../../services/storage.service';
import {DialogService} from 'ngx-weui';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {

  ticket;
  user;
  vote;
  group;
  voteForm: FormGroup;
  loading = false;

  tops;
  voteCount;

  lotteryForm: FormGroup;

  constructor(private route: ActivatedRoute,
              private storageSvc: StorageService,
              private dialogSvc: DialogService,
              private userSvc: UserService,
              private countriesSvc: CountriesService,
              private voteSvc: VoteService,
              private lotterySvc: LotteryService) {
  }

  ngOnInit() {

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
        H: new FormControl('', [Validators.required])
      })
    });

    this.lotteryForm = new FormGroup({
      OpenUserId: new FormControl('', [Validators.required, Validators.min(10000000000), Validators.max(19999999999)]),
      Score: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(16)]),
      ScoreEvent: new FormControl('', [Validators.required, Validators.pattern(/^[0-9]{4}$/)]),
      Reason: new FormControl('', []),
      TransID: new FormControl('', [Validators.required])
    });

    this.lotteryForm.get('Score').setValue(2000);
    this.lotteryForm.get('ScoreEvent').setValue(6);
    this.lotteryForm.get('Reason').setValue('世界杯8强竞猜奖励');
    this.lotteryForm.get('TransID').setValue(Date.parse(new Date().toString()));

    if (!this.route.snapshot.queryParams['Ticket']) {
      const url = this.userSvc.getTicket(window.location.href);
      window.location.href = url;
    } else {
      this.ticket = this.route.snapshot.queryParams['Ticket'];
      this.userSvc.getUserToken(this.ticket).then(res => {
        if (res.body.Code === 1) {
          this.user = res.body.Data.OpenUserId;
          this.storageSvc.set('user', this.user);
          this.voteForm.get('owner').setValue(this.user);
          this.lotteryForm.get('OpenUserId').setValue(this.user);
          this.voteForm.get('nickName').setValue(res.body.Data.NickName);
          this.voteForm.get('avatar').setValue(res.body.Data.Avatar);

          this.voteSvc.find(this.user).then(vote => {
            if (vote) {
              this.vote = vote;
              this.voteForm.get('vote').setValue(vote.vote);
              console.log(this.voteForm.value);
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
      const countries = res;

      res.forEach(item => {
        if (group[item.group]) {
          group[item.group].push(item);
        } else {
          group[item.group] = [];
          group[item.group].push(item);
        }
      });

      this.group = group;
    });

    this.voteSvc.top().then(res => {
      const tops = [];
      res.countries.forEach(country => {
        country.ratio = country.votes / res.voteCount;
        tops.push(country);
      });
      this.tops = tops;
      console.log(this.tops);
    });
  }

  getCount() {
    let count = 0;
    const vote = this.voteForm.get('vote').value;
    for (const item in vote) {
      if (vote[item]) {
        count = count + vote[item].split(',').length;
      }
    }
    return count;
  }

  setCountry(country) {
    const voteGroup = this.voteForm.get('vote').get(country.group);
    if (!voteGroup.value) {
      voteGroup.setValue(country._id);
    } else {
      const values = voteGroup.value.split(',');
      const index = values.indexOf(country._id);
      if (index !== -1) {
        values.splice(index, 1);
      } else {
        if (values.length < 2) {
          values.push(country._id);
        } else {
          values.unshift(country._id);
          values.pop();
        }
      }

      let value = '';
      values.forEach(item => {
        if (value) {
          value = value + ',' + item;
        } else {
          value = item;
        }
      });

      voteGroup.setValue(value);
    }

    const count = this.getCount();

    if (count >= 8) {
      this.dialogSvc.show({content: '您已经选择了8只队伍了!', cancel: '继续', confirm: '我选好了'}).subscribe(res => {
        if (!res.value) {
          console.log('重新选择');
        }
      });
    }
  }

  submit() {

    if (this.vote) {
      return false;
    }

    if (this.loading) {
      return false;
    }

    const count = this.getCount();
    if (count < 8) {
      this.dialogSvc.show({content: '您还没有选够8只队伍!', cancel: '', confirm: '继续选择'}).subscribe();
      return false;
    }

    this.loading = true;
    this.voteSvc.vote(this.voteForm.value).then(res => {
      this.lotterySvc.plus(this.lotteryForm.value).then(_res => {
        console.log(_res);
      });
    });
  }

}

// todo https://m.mallcoo.cn/a/user/10164/center
