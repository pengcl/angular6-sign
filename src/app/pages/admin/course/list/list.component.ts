import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {DialogService} from 'ngx-weui';
import {CourseService} from '../../../../services/course.service';

@Component({
  selector: 'app-admin-course-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class AdminCourseListComponent implements OnInit {

  courses: any[] = [];

  constructor(private router: Router,
              private dialogSvc: DialogService,
              private courseSvc: CourseService) {
  }

  ngOnInit() {
    this.courseSvc.get().then(res => {
      if (res.success) {
        this.courses = res.result;
      }
    });
  }

  submit() {
  }
}
