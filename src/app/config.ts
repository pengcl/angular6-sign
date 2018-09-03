import {environment} from '../environments/environment';

export const Config = {
  'webHost': environment.webHost,
  'prefix': {
    'front': environment.webHost + '/front',
    'admin': environment.webHost + '/admin',
    'api': environment.webHost + '/api',
    'kpi': environment.webHost + '/kpi'
  },
  'klub': {
    apiKey: '971153595163642',
    apiSecret: 'cA762ESb',
    interfaceId: '1e63e6b86b751e51c35d',
    skey: '6bf9b7b2'
  }
};
