import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Config} from '../../config';

import {UserService} from '../../services/user.service';
import {ActivityService} from '../../services/activity.service';
import {LotteryService} from '../../services/lottery.service';

@Component({
  selector: 'app-lottery',
  templateUrl: './lottery.component.html',
  styleUrls: ['./lottery.component.scss']
})
export class LotteryComponent implements OnInit {
  config = Config;

  user;
  lotteryForm: FormGroup;

  constructor(private userSvc: UserService,
              private activitySvc: ActivityService,
              private lotterySvc: LotteryService) {
  }

  ngOnInit() {

    this.user = this.userSvc.getUser();
    console.log(this.user);

    /*UserToken	string	否	用户Token
    OpenUserId	string	是	用户在当前【开发者账号+项目（集团）】下的唯一标识(相当于用户ID)
    Score	double	是	需要增加的积分
    ScoreEvent	enum	是	积分事件（详情看枚举字典）
    Reason	string	否	积分变动原因 尽量英文，如需中文，需要编码
    TransID	string	是	事务ID（当前应用下不得重复，保证提交的唯一性）*/
    this.lotteryForm = new FormGroup({
      OpenUserId: new FormControl('', [Validators.required, Validators.min(10000000000), Validators.max(19999999999)]),
      Score: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(16)]),
      ScoreEvent: new FormControl('', [Validators.required, Validators.pattern(/^[0-9]{4}$/)]),
      Reason: new FormControl('', []),
      TransID: new FormControl('', [Validators.required])
    });

    this.lotteryForm.get('OpenUserId').setValue(this.user);
    this.lotteryForm.get('Score').setValue(1);
    this.lotteryForm.get('ScoreEvent').setValue(6);
    this.lotteryForm.get('TransID').setValue(Date.parse(new Date().toString()));

    this.lotterySvc.plus(this.lotteryForm.value).then(res => {
      console.log(res);
    });

    this.activitySvc.get().then(res => {
      console.log(res);
    });

  }


}
