import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../../services/auth.service';
import {DialogService} from 'ngx-weui';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {

  signInForm: FormGroup;
  isLoading = false;

  constructor(private router: Router,
              private dialogSvc: DialogService,
              private authSvc: AuthService) {
  }


  ngOnInit() {
    console.log('init');
    this.signInForm = new FormGroup({
      username: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(12)]),
      password: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(16)])
    });
  }

  submit() {
    console.log('submit');
    if (this.isLoading) {
      return false;
    }
    this.isLoading = true;
    this.authSvc.signIn(this.signInForm.value).subscribe(res => {
      this.isLoading = false;
      if (res.success) {
        this.authSvc.updateLoginStatus(res.result);
        this.router.navigate(['/admin']);
      } else {
        this.dialogSvc.show({content: res.msg, confirm: '我知道了', cancel: ''}).subscribe();
      }
    });
  }
}
