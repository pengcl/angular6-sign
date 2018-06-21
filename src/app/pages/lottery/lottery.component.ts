import {Component, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Config} from '../../config';

import {DialogService, MaskComponent} from 'ngx-weui';
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

  user;
  lotteryForm: FormGroup;

  tops;

  constructor(private dialogSvc: DialogService,
              private userSvc: UserService,
              private activitySvc: ActivityService,
              private voteSvc: VoteService,
              private lotterySvc: LotteryService) {
  }

  ngOnInit() {

    this.user = this.userSvc.getUser();

    this.lotteryForm = new FormGroup({
      OpenUserId: new FormControl('', [Validators.required, Validators.min(10000000000), Validators.max(19999999999)]),
      Score: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(16)]),
      ScoreEvent: new FormControl('', [Validators.required, Validators.pattern(/^[0-9]{4}$/)]),
      Reason: new FormControl('', []),
      TransID: new FormControl('', [Validators.required])
    });

    this.lotteryForm.get('OpenUserId').setValue(this.user);
    this.lotteryForm.get('Score').setValue(2000);
    this.lotteryForm.get('ScoreEvent').setValue(6);
    this.lotteryForm.get('Reason').setValue('世界杯8强竞猜奖励');
    this.lotteryForm.get('TransID').setValue(Date.parse(new Date().toString()));

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

  lottery() {
    this.lotterySvc.plus(this.lotteryForm.value).then(res => {
      if (res.Code === 1) {
        console.log('成功');
        this.dialogSvc.show({content: '', cancel: '', confirm: ''}).subscribe(data => {
          if (data.value) {

          } else {

          }
        });
      } else {
        console.log('失败');
        this.dialogSvc.show({content: '', cancel: '', confirm: ''}).subscribe(data => {
          if (data.value) {

          } else {

          }
        });
      }
      console.log(res);
    });
  }


}
