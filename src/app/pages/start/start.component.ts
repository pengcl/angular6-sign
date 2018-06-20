import {Component, OnInit, ViewChild} from '@angular/core';

import {MaskComponent} from 'ngx-weui';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.scss']
})
export class StartComponent implements OnInit {

  @ViewChild('mask') mask: MaskComponent;

  constructor() {
  }

  ngOnInit() {
  }

  showRule() {
    this.mask.show();
  }

  close() {
    this.mask.hide();
  }

}
