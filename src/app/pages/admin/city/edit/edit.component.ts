import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {LocationStrategy} from '@angular/common';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {DialogService} from 'ngx-weui';
import {CityService} from '../../../../services/city.service';

@Component({
  selector: 'app-admin-city-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class AdminCityEditComponent implements OnInit {

  city;
  citiesForm: FormGroup;
  isLoading = false;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private location: LocationStrategy,
              private dialogSvc: DialogService,
              private citySvc: CityService) {
  }

  ngOnInit() {
    console.log('edit');
    this.citiesForm = new FormGroup({
      _id: new FormControl('', [Validators.required]),
      label: new FormControl('', [Validators.required]),
      value: new FormControl('', [Validators.required]),
      origin: new FormControl('', [Validators.required])
    });

    this.citiesForm.get('_id').setValue(this.route.snapshot.params['id']);

    this.citySvc.get(this.citiesForm.get('_id').value).then(res => {
      console.log(res);
      if (res.success) {
        this.city = res.result;
        console.log(this.city);
        for (const key in this.citiesForm.value) {
          if (this.city[key]) {
            this.citiesForm.get(key).setValue(this.city[key]);
          }
        }
      }
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

    this.citySvc.edit(this.citiesForm.value).then(res => {
      this.isLoading = false;
      if (res.success) {
        this.location.back();
      } else {
        this.dialogSvc.show({content: res.msg, confirm: '我知道了', cancel: ''}).subscribe();
      }
    });
  }
}
