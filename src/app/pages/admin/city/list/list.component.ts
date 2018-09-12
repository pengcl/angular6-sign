import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {DialogService} from 'ngx-weui';
import {CityService} from '../../../../services/city.service';

@Component({
  selector: 'app-admin-city-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class AdminCityListComponent implements OnInit {

  cities: any[] = [];

  constructor(private router: Router,
              private dialogSvc: DialogService,
              private citySvc: CityService) {
  }

  ngOnInit() {
    this.citySvc.get().then(res => {
      console.log(res);
      if (res.success) {
        this.cities = res.result;
        console.log(this.cities);
      }
    });
  }

  submit() {
  }
}
