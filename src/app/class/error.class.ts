import {Component, ErrorHandler} from '@angular/core';

/*import {UaService} from '../services/utils/ua.service';
import {LogService} from '../services/utils/log.service';*/

@Component({
  selector: 'app-error',
  template: '',
})
export class AppErrorComponent implements ErrorHandler {

  constructor() {
  }

  handleError(error: any): void {
    console.log(error);
    /*const _error = {
      platform: this.uaSvc.getPlatform(),
      isWx: this.uaSvc.isWx(),
      ua: this.uaSvc.getUa(),
      av: this.uaSvc.getAv(),
      url: window.location.href,
      error: error.toString()
    };
    this.logSvc.log('error', _error).then(res => {
    });*/
  }
}
