import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {Config} from '../../config';
import {ToastService, DialogService, PickerService} from 'ngx-weui';

import {canSign} from '../../utils/utils';

import {UserService} from '../../services/user.service';
import {CityService} from '../../services/city.service';
import {CourseService} from '../../services/course.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {

  openid;
  unionid;

  cities: any[] = [];

  _courses: any[] = [];
  courses: any[] = [];

  signForm: FormGroup;

  constructor(private route: ActivatedRoute,
              private toastSvc: ToastService,
              private dialogSvc: DialogService,
              private pickerSvc: PickerService,
              private userSvc: UserService,
              private citySvc: CityService,
              private courseSvc: CourseService) {
  }

  ngOnInit() {
    this.openid = this.route.snapshot.queryParams['openid'];
    this.unionid = this.route.snapshot.queryParams['unionid'];

    this.signForm = new FormGroup({
      openid: new FormControl(this.openid, [Validators.required]),
      union_id: new FormControl(this.unionid, [Validators.required]),
      city: new FormControl('', [Validators.required]),
      course: new FormControl('', [Validators.required]),
    });

    if (!this.openid) {
      window.location.href = Config.prefix.api + '/klub/auth?redirect_uri=' + window.location.href;
    } else {
      this.userSvc.get(this.unionid).then(res => {
        if (res.code !== 0) {
          window.location.href = 'https://onecard.klub11.com/pass/mobile/entry?target_url=' + encodeURIComponent(window.location.href);
        } else {
          this.signForm.get('openid').setValue(this.openid);
          this.signForm.get('union_id').setValue(this.unionid);
        }
      });

      this.citySvc.get().then(res => {
        const cities = [];
        res.result.forEach(item => {
          item.value = item._id;
          cities.push(item);
        });
        this.cities = cities;
      });

      this.courseSvc.get().then(res => {
        const courses = [];
        res.result.forEach(item => {
          item.value = item._id;
          courses.push(item);
        });
        this._courses = courses;
        this.courses = courses;
      });
    }
  }

  showCities() {
    this.pickerSvc.show([this.cities], '', [0], {cancel: '取消', confirm: '确定'}).subscribe(res => {
      this.signForm.get('city').setValue(res.value);
      const courses = [];
      this._courses.forEach(item => {
        if (item.cities.indexOf(res.value) !== -1 && canSign(item.start, item.end)) {
          courses.push(item);
        }
        this.courses = courses;
      });
      this.signForm.get('course').setValue('');
    });
  }

  showCourses() {
    if (this.courses.length === 0) {
      this.dialogSvc.show({content: '暂无可签到课程', cancel: '', confirm: '我知道了'}).subscribe();
      return false;
    }
    this.pickerSvc.show([this.courses], '', [0], {cancel: '取消', confirm: '确定'}).subscribe(res => {
      this.signForm.get('course').setValue(res.value);
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
