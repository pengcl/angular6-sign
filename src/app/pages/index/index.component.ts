import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Config} from '../../config';
import {DialogService, PickerService} from 'ngx-weui';

import {UserService} from '../../services/user.service';

const CITIES = [
  {
    label: '上海 K11 ATELIER',
    value: 24
  },
  {
    label: '广州 K11 ATELIER',
    value: 28
  }
];

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {
  cities: any[] = CITIES;

  courses: any[];
  course;

  signForm: FormGroup;

  constructor(private pickerSvc: PickerService,
              private userSvc: UserService) {
  }

  ngOnInit() {
    this.signForm = new FormGroup({
      shop: new FormControl('artstore', [Validators.required]),
      is_on_sale: new FormControl(1, [Validators.required]),
      sid: new FormControl('', [Validators.required]),
      page: new FormControl(1, [Validators.required]),
      size: new FormControl(1000, [Validators.required])
    });

    this.userSvc.auth('http://cup.heyazl.net/result').then(res => {
      console.log(res);
    });

    this.userSvc.getConfig(window.location.href).then(res => {
      console.log(res);
    });
  }

  showCities() {
    this.pickerSvc.show([this.cities], '', [0], {cancel: '取消', confirm: '确定'}).subscribe(res => {
      this.signForm.get('sid').setValue(res.value);
      this.userSvc.getCourses(this.signForm.value).then(_res => {
        console.log(_res);
      });
    });
  }

  showPicker() {
  }
}

// todo 供应商开放平台WIKI：http://wiki.klub11.com/index.php?s=/2&page_id=12， 密码：pf1q78rc
