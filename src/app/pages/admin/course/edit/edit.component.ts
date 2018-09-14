import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {LocationStrategy} from '@angular/common';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {DialogService, PickerService} from 'ngx-weui';
import {CityService} from '../../../../services/city.service';
import {CourseService} from '../../../../services/course.service';

@Component({
  selector: 'app-admin-course-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class AdminCourseEditComponent implements OnInit {
  course;
  cities: any[] = [];
  coursesForm: FormGroup;
  isLoading = false;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private location: LocationStrategy,
              private dialogSvc: DialogService,
              private pickerSvc: PickerService,
              private citySvc: CityService,
              private courseSvc: CourseService) {
  }

  ngOnInit() {
    this.coursesForm = new FormGroup({
      _id: new FormControl('', [Validators.required]),
      label: new FormControl('', [Validators.required]),
      cities: new FormControl('', [Validators.required]),
      start: new FormControl('', [Validators.required]),
      end: new FormControl('', [Validators.required])
    });

    this.coursesForm.get('_id').setValue(this.route.snapshot.params['id']);

    this.courseSvc.get(this.coursesForm.get('_id').value).then(res => {
      if (res.success) {
        this.course = res.result;
        for (const key in this.coursesForm.value) {
          if (this.course[key]) {
            if (key === 'cities') {
              let cities = '';
              this.course[key].forEach(item => {
                if (cities) {
                  cities = cities + ',' + item;
                } else {
                  cities = item;
                }
              });
              this.coursesForm.get(key).setValue(cities);
            } else {
              this.coursesForm.get(key).setValue(this.course[key]);
            }
          }
        }
      }

      console.log(this.coursesForm.value);
    });

    this.citySvc.get().then(res => {
      this.cities = res.result;
    });
  }

  showPicker(target) {
    this.pickerSvc.showDateTime('datetime').subscribe((res: any) => {
      this.coursesForm.get(target).setValue(Date.parse(res.formatValue.replace(/\-/g, '/')));
    });
  }

  setCities(city) {
    const cities = this.coursesForm.get('cities');
    if (!cities.value) {
      cities.setValue(city._id);
    } else {
      const values = cities.value.split(',');
      const index = values.indexOf(city._id);
      if (index !== -1) {
        values.splice(index, 1);
      } else {
        values.push(city._id);
      }

      let value = '';
      values.forEach(item => {
        if (value) {
          value = value + ',' + item;
        } else {
          value = item;
        }
      });

      cities.setValue(value);
    }
  }

  submit() {

    console.log(this.coursesForm.value);

    if (this.isLoading) {
      return false;
    }

    if (this.coursesForm.invalid) {
      return false;
    }

    this.isLoading = true;

    this.courseSvc.edit(this.coursesForm.value).then(res => {
      this.isLoading = false;
      if (res.success) {
        this.location.back();
      } else {
        this.dialogSvc.show({content: res.msg, confirm: '我知道了', cancel: ''}).subscribe();
      }
    });
  }
}
