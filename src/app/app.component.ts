import {Component, AfterViewInit} from '@angular/core';
import {WxService} from './modules/wx';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  title = 'app';

  constructor(private wx: WxService) {
  }

  ngAfterViewInit() {
    this.wx.config({}).then(() => {
      // 其它操作，可以确保注册成功以后才有效
      // this.status = '注册成功';
    }).catch((err: string) => {
      console.log(err);
      // this.status = `注册失败，原因：${err}`;
    });
  }
}
