import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {Config} from '../../config';
import {ToastService, DialogService, PickerService} from 'ngx-weui';

import {UserService} from '../../services/user.service';

const CITIES = [
  {
    label: '上海 K11 ATELIER',
    value: 24,
    origin: 376
  },
  {
    label: '广州 K11 ATELIER',
    value: 28,
    origin: 375
  }
];

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {

  openid;
  unionid;
  userInfo;

  cities: any[] = CITIES;

  courses: any[];

  signForm: FormGroup;
  coursesForm: FormGroup;

  constructor(private route: ActivatedRoute,
              private toastSvc: ToastService,
              private dialogSvc: DialogService,
              private pickerSvc: PickerService,
              private userSvc: UserService) {
  }

  ngOnInit() {

    this.openid = this.route.snapshot.queryParams['openid'];
    this.unionid = this.route.snapshot.queryParams['unionid'];

    this.coursesForm = new FormGroup({
      shop: new FormControl('kaa', [Validators.required]),
      is_on_sale: new FormControl(1, [Validators.required]),
      sid: new FormControl('', [Validators.required]),
      page: new FormControl(1, [Validators.required]),
      size: new FormControl(1000, [Validators.required])
    });

    this.signForm = new FormGroup({
      openid: new FormControl(this.openid, [Validators.required]),
      union_id: new FormControl(this.unionid, [Validators.required]),
      sid: new FormControl('', [Validators.required]),
      s_name: new FormControl('', [Validators.required]),
      origin: new FormControl('', [Validators.required]),
      goods_id: new FormControl('', [Validators.required]),
      goods_name: new FormControl('', [Validators.required]),
      _redirecturl: new FormControl(window.location.href, [Validators.required])
    });

    if (!this.openid) {
      window.location.href = Config.prefix.api + '/klub/auth?redirect_uri=' + window.location.href;
    }
  }

  showCities() {
    this.pickerSvc.show([this.cities], '', [0], {cancel: '取消', confirm: '确定'}).subscribe(res => {
      this.coursesForm.get('sid').setValue(res.value);
      this.signForm.get('sid').setValue(res.value);
      this.signForm.get('s_name').setValue(res.items[0].label);
      this.signForm.get('origin').setValue(res.items[0].origin);
      this.toastSvc.loading('课程加载中', 0);
      this.userSvc.getCourses(this.coursesForm.value).then(_res => {
        this.toastSvc.hide();
        if (_res.code === 0) {
          const courses = [];
          _res.data.iDisplayRecords.forEach(item => {
            const course = {
              label: item.goods_name,
              value: item.goods_id
            };
            courses.push(course);
          });
          this.courses = courses;
        }
      });
    });
  }

  showCourses() {
    this.pickerSvc.show([this.courses], '', [0], {cancel: '取消', confirm: '确定'}).subscribe(res => {
      this.signForm.get('goods_id').setValue(res.value);
      this.signForm.get('goods_name').setValue(res.items[0].label);
    });
  }

  sign() {
    if (this.signForm.invalid) {
      this.dialogSvc.show({content: '请选择地区或课程', cancel: '', confirm: '我知道了'}).subscribe();
      return false;
    }
    this.toastSvc.loading('签到中...', 0);
    this.userSvc.sign(this.signForm.value).then(res => {
      this.toastSvc.hide();
      if (res.code === 0) {
        this.dialogSvc.show({content: res.msg, cancel: '', confirm: '我知道了'}).subscribe();
      } else if (res.code === 9999) {
        this.dialogSvc.show({content: res.msg, cancel: '取消', confirm: '立即注册'}).subscribe(data => {
          if (data.value) {
            window.location.href = res.data;
          }
        });
      } else {
        this.dialogSvc.show({content: res.msg, cancel: '', confirm: '我知道了'}).subscribe();
      }
    });
  }
}

// todo 供应商开放平台WIKI：http://wiki.klub11.com/index.php?s=/2&page_id=12， 密码：pf1q78rc
