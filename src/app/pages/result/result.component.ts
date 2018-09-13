import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

import {CourseService} from '../../services/course.service';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss']
})
export class ResultComponent implements OnInit {
  course;

  constructor(private route: ActivatedRoute,
              private courseSvc: CourseService) {
  }

  ngOnInit() {
    this.courseSvc.get(this.route.snapshot.queryParams['course']).then(res => {
      this.course = res.result;
      console.log(this.course);
    });
  }
}
