import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {LocationStrategy} from '@angular/common';
import {DialogService} from 'ngx-weui';

import {SignService} from '../../../../services/sign.service';

@Component({
  selector: 'app-admin-sign-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss']
})
export class AdminSignItemComponent implements OnInit {

  id;
  sign;

  constructor(private route: ActivatedRoute,
              private location: LocationStrategy,
              private dialogSvc: DialogService,
              private signSvc: SignService) {
  }

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
    this.signSvc.get(this.id).then(res => {
      if (res.success) {
        this.sign = res.result;
      }
    });
  }

  back() {
    this.location.back();
  }

  remove(sign) {
    this.dialogSvc.show({content: '您确定要删除会员"' + sign.user.nick_name + '"的签到吗？', cancel: '返回', confirm: '确定'}).subscribe(data => {
      if (data.value) {
        this.signSvc.remove(sign.sign._id).then(res => {
          if (res.success) {
            this.location.back();
          }
        });
      }
    });
  }
}
