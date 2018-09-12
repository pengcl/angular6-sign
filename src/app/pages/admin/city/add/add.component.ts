import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {LocationStrategy} from '@angular/common';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {DialogService} from 'ngx-weui';
import {CityService} from '../../../../services/city.service';

@Component({
  selector: 'app-admin-city-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AdminCityAddComponent implements OnInit {

  citiesForm: FormGroup;
  isLoading = false;

  constructor(private router: Router,
              private location: LocationStrategy,
              private dialogSvc: DialogService,
              private citySvc: CityService) {
  }

  ngOnInit() {
    this.citiesForm = new FormGroup({
      label: new FormControl('', [Validators.required]),
      value: new FormControl('', [Validators.required]),
      origin: new FormControl('', [Validators.required])
    });
  }

  submit() {
    if (this.isLoading) {
      return false;
    }

    if (this.citiesForm.invalid) {
      return false;
    }

    this.isLoading = true;

    this.citySvc.add(this.citiesForm.value).then(res => {
      this.isLoading = false;
      if (res.success) {
        this.location.back();
      } else {
        this.dialogSvc.show({content: res.msg, confirm: '我知道了', cancel: ''}).subscribe();
      }
    });
  }
}
