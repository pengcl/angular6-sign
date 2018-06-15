import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {Config} from '../config';

// Lottery;
@Injectable({providedIn: 'root'})
export class LotteryService {

  constructor(private http: HttpClient) {
  }


  /*接口地址： https://openapi10.mallcoo.cn/User/Score/v1/Plus/ByOpenUserID/
    // 请求类型： POST
  数据格式： application/json; charset=utf-8
  参数类型： DTO对象（json）
  接口参数：

  名称	数据类型	必填	说明
  UserToken	string	否	用户Token
  OpenUserId	string	是	用户在当前【开发者账号+项目（集团）】下的唯一标识(相当于用户ID)
  Score	double	是	需要增加的积分
  ScoreEvent	enum	是	积分事件（详情看枚举字典）
  Reason	string	否	积分变动原因
  TransID	string	是	事务ID（当前应用下不得重复，保证提交的唯一性）*/

  plus(body): Promise<any> {
    return this.http.post(Config.prefix.api + '/activities/plus', body)
      .toPromise()
      .then(response => response)
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}
