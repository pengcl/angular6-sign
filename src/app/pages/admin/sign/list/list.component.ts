import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {DialogService} from 'ngx-weui';

import {SignService} from '../../../../services/sign.service';

@Component({
  selector: 'app-admin-sign-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class AdminSignListComponent implements OnInit {

  signs: any[] = [];

  constructor(private router: Router,
              private dialogSvc: DialogService,
              private signSvc: SignService) {
  }

  ngOnInit() {
    this.signSvc.get().then(res => {
      if (res.success) {
        this.signs = res.result;
      }
    });
  }
}
