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
      if (res.success) {
        this.cities = res.result;
      }
    });
  }

  remove(city) {
    this.dialogSvc.show({content: '您确定要删除城市"' + city.label + '"吗？', cancel: '返回', confirm: '确定'}).subscribe(data => {
      if (data.value) {
        this.citySvc.remove(city._id).then(res => {
          if (res.success) {
            this.cities = res.result;
          }
        });
      }
    });
  }
}
