import {Component, OnInit, ViewChild} from '@angular/core';

import {MaskComponent} from 'ngx-weui';
import {WxService} from '../../modules/wx';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.scss']
})
export class StartComponent implements OnInit {

  @ViewChild('mask') mask: MaskComponent;

  constructor(private wxSvc: WxService) {
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
  }

  showRule() {
    this.mask.show();
  }

  close() {
    this.mask.hide();
  }

}
