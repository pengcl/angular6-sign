import {environment} from '../environments/environment';

export const Config = {
  'webHost': environment.webHost,
  'prefix': {
    'front': environment.webHost + '/front',
    'admin': environment.webHost + '/admin',
    'api': environment.webHost + '/api',
    'wApi': environment.webHost + '/wApi'
  },
  'mc': {
    AppID: '5ad5bc8d88ce7e53f4acee44',
    PublicKey: 'AmrTaT',
    PrivateKey: '9d7ebe7824f2cec1'
  }
};
