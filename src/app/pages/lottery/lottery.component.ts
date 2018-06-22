import {Component, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Config} from '../../config';

import {DialogService, MaskComponent} from 'ngx-weui';
import {WxService} from '../../modules/wx';
import {UserService} from '../../services/user.service';
import {ActivityService} from '../../services/activity.service';
import {VoteService} from '../../services/vote.service';
import {LotteryService} from '../../services/lottery.service';

@Component({
  selector: 'app-lottery',
  templateUrl: './lottery.component.html',
  styleUrls: ['./lottery.component.scss']
})
export class LotteryComponent implements OnInit {
  config = Config;

  @ViewChild('mask') mask: MaskComponent;
  @ViewChild('login') login: MaskComponent;

  user;
  lotteryForm: FormGroup;
  loading = false;

  tops;
  vote;

  constructor(private router: Router,
              private dialogSvc: DialogService,
              private wxSvc: WxService,
              private userSvc: UserService,
              private activitySvc: ActivityService,
              private voteSvc: VoteService,
              private lotterySvc: LotteryService) {
  }

  ngOnInit() {

    this.wxSvc.config({
      success: () => {
        console.log('分享成功');
      },
      cancel: () => {
        console.log('cancel');
      }
    }).then(() => {
      // 其它操作，可以确保注册成功以后才有效
      console.log('注册成功');
    }).catch((err: string) => {
      console.log(`注册失败，原因：${err}`);
    });

    this.user = this.userSvc.getUser();

    this.lotteryForm = new FormGroup({
      OpenUserId: new FormControl('', [Validators.required]),
      Score: new FormControl('', [Validators.required]),
      ScoreEvent: new FormControl('', [Validators.required]),
      Reason: new FormControl('', []),
      TransID: new FormControl('', [Validators.required])
    });

    this.lotteryForm.get('OpenUserId').setValue(this.user);
    this.lotteryForm.get('Score').setValue(2);
    this.lotteryForm.get('ScoreEvent').setValue(6);
    this.lotteryForm.get('Reason').setValue('世界杯8强竞猜奖励');
    this.lotteryForm.get('TransID').setValue(Date.parse(new Date().toString()));

    this.voteSvc.top().then(res => {
      const tops = [];
      res.countries.forEach(country => {
        country.ratio = (country.votes / res.voteCount).toFixed(4);
        tops.push(country);
      });
      this.tops = tops;
    });

    this.voteSvc.find(this.user).then(vote => {
      if (vote) {
        this.vote = vote;
        if (this.vote.score !== 0) {
          this.mask.show();
        }
      } else {
        this.router.navigate(['/start']);
      }
    });

  }

  lottery() {
    if (this.loading) {
      return false;
    }

    if (!this.vote) {
      this.login.show();
      return false;
    }

    if (this.vote.score !== 0) {
      this.mask.show();
    }

    this.loading = true;
    this.lotterySvc.plus(this.lotteryForm.value).then(res => {
      this.loading = false;
      if (res.Code === 1) {
        this.mask.show();
      } else {
        this.dialogSvc.show({content: res.Message, cancel: '', confirm: '我知道了'}).subscribe();
      }
    });
  }

  goHome() {
    window.location.href = 'https://m.mallcoo.cn/a/user/10164/center';
  }


}
