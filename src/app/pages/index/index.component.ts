import {Component, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Router, ActivatedRoute} from '@angular/router';
import {Config} from '../../config';

import {WxService} from '../../modules/wx';
import {UserService} from '../../services/user.service';
import {CountriesService} from '../../services/countries.service';
import {VoteService} from '../../services/vote.service';
import {StorageService} from '../../services/storage.service';
import {DialogService, MaskComponent} from 'ngx-weui';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {

  ticket;
  user;
  vote;
  group;
  voteForm: FormGroup;
  loading = false;
  isSubmit = false;

  @ViewChild('login') login: MaskComponent;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private storageSvc: StorageService,
              private dialogSvc: DialogService,
              private wxSvc: WxService,
              private userSvc: UserService,
              private countriesSvc: CountriesService,
              private voteSvc: VoteService) {
  }

  ngOnInit() {

    this.wxSvc.config({
      success: () => {
        console.log('分享成功');
      },
      cancel: () => {
        console.log('cancel');
      }
    }).then(() => {
      // 其它操作，可以确保注册成功以后才有效
      console.log('注册成功');
    }).catch((err: string) => {
      console.log(`注册失败，原因：${err}`);
    });

    this.voteForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      mobile: new FormControl('', [Validators.required]),
      owner: new FormControl('', [Validators.required]),
      nickName: new FormControl('', [Validators.required]),
      avatar: new FormControl('', [Validators.required]),
      vote: new FormGroup({
        A: new FormControl('', []),
        B: new FormControl('', []),
        C: new FormControl('', []),
        D: new FormControl('', []),
        E: new FormControl('', []),
        F: new FormControl('', []),
        G: new FormControl('', []),
        H: new FormControl('', [])
      })
    });

    if (!this.route.snapshot.queryParams['Ticket']) {
      const url = this.userSvc.getTicket(window.location.href);
      window.location.href = url;
    } else {
      this.ticket = this.route.snapshot.queryParams['Ticket'];
      this.userSvc.getUserToken(this.ticket).then(res => {
        if (res.Code === 1) {
          this.user = res.Data.OpenUserId;
          this.storageSvc.set('user', this.user);
          this.voteForm.get('owner').setValue(this.user);
          this.voteForm.get('nickName').setValue(res.Data.NickName);
          this.voteForm.get('avatar').setValue(res.Data.Avatar);

          this.voteSvc.find(this.user).then(vote => {
            if (vote) {
              /*this.vote = vote;
              this.voteForm.get('vote').setValue(vote.vote);*/
              this.router.navigate(['/lottery']);
            }
          });

        } else {
          console.log('ticket过期');
          window.location.href = this.userSvc.getTicket(Config.webHost + '/index');
        }
      });
    }

    this.countriesSvc.find().then(res => {
      const group = {};
      const countries = res;

      res.forEach(item => {
        if (group[item.group]) {
          group[item.group].push(item);
        } else {
          group[item.group] = [];
          group[item.group].push(item);
        }
      });

      this.group = group;
    });
  }

  getCount() {
    let count = 0;
    const vote = this.voteForm.get('vote').value;
    for (const item in vote) {
      if (vote[item]) {
        count = count + vote[item].split(',').length;
      }
    }
    return count;
  }

  setCountry(country) {
    const voteGroup = this.voteForm.get('vote').get(country.group);
    if (!voteGroup.value) {
      voteGroup.setValue(country._id);
    } else {
      const values = voteGroup.value.split(',');
      const index = values.indexOf(country._id);
      if (index !== -1) {
        values.splice(index, 1);
      } else {
        if (values.length < 2) {
          values.push(country._id);
        } else {
          values.unshift(country._id);
          values.pop();
        }
      }

      let value = '';
      values.forEach(item => {
        if (value) {
          value = value + ',' + item;
        } else {
          value = item;
        }
      });

      voteGroup.setValue(value);
    }

    const count = this.getCount();

    if (count >= 8) {
      this.dialogSvc.show({content: '您已经选择了8只队伍了!', cancel: '继续', confirm: '我选好了'}).subscribe(res => {
        if (!res.value) {
          console.log('重新选择');
        }
      });
    }
  }

  showLogin() {
    const count = this.getCount();
    if (count < 8) {
      this.dialogSvc.show({content: '您还没有选够8只队伍!', cancel: '', confirm: '继续选择'}).subscribe();
      return false;
    }
    this.login.show();
  }

  submit() {
    console.log(this.voteForm.controls);
    this.isSubmit = true;

    if (this.vote) {
      return false;
    }

    if (this.loading) {
      return false;
    }

    if (this.voteForm.invalid) {
      return false;
    }

    this.loading = true;
    this.voteSvc.vote(this.voteForm.value).then(res => {
      if (res) {
        this.router.navigate(['/lottery']);
      }
    });
  }

}

// todo https://m.mallcoo.cn/a/user/10164/center
