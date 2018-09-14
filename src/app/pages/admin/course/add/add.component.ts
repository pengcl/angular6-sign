import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {LocationStrategy} from '@angular/common';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {DialogService, PickerService} from 'ngx-weui';
import {CityService} from '../../../../services/city.service';
import {CourseService} from '../../../../services/course.service';

@Component({
  selector: 'app-admin-course-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AdminCourseAddComponent implements OnInit {

  cities: any[] = [];
  coursesForm: FormGroup;
  isLoading = false;

  constructor(private router: Router,
              private location: LocationStrategy,
              private dialogSvc: DialogService,
              private pickerSvc: PickerService,
              private citySvc: CityService,
              private courseSvc: CourseService) {
  }

  ngOnInit() {
    this.coursesForm = new FormGroup({
      label: new FormControl('', [Validators.required]),
      cities: new FormControl('', [Validators.required]),
      start: new FormControl('', [Validators.required]),
      end: new FormControl('', [Validators.required])
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

    if (this.isLoading) {
      return false;
    }

    if (this.coursesForm.invalid) {
      return false;
    }

    this.isLoading = true;

    this.courseSvc.add(this.coursesForm.value).then(res => {
      this.isLoading = false;
      if (res.success) {
        this.location.back();
      } else {
        this.dialogSvc.show({content: res.msg, confirm: '我知道了', cancel: ''}).subscribe();
      }
    });
  }
}
