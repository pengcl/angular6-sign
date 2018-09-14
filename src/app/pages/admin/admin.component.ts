import {Component, OnInit} from '@angular/core';

import {UserService} from '../../services/user.service';
import {CityService} from '../../services/city.service';
import {CourseService} from '../../services/course.service';
import {SignService} from '../../services/sign.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  cities: any[] = [];

  courses: any[] = [];

  signs: any[] = [];

  constructor(private userSvc: UserService,
              private citySvc: CityService,
              private courseSvc: CourseService,
              private signSvc: SignService) {
  }

  ngOnInit() {
    this.citySvc.get().then(res => {
      this.cities = res.result;
    });
    this.courseSvc.get().then(res => {
      this.courses = res.result;
    });
    this.signSvc.get().then(res => {
      this.signs = res.result;
      console.log(this.signs);
    });
  }
}

// todo 供应商开放平台WIKI：http://wiki.klub11.com/index.php?s=/2&page_id=12， 密码：pf1q78rc
