import { OpaqueToken } from '@angular/core';

export let APP_CONFIG = new OpaqueToken('app.config');

export interface IAppConfig {
  apiEndpoint: string;
}

let hostname = location.hostname;
// let apiEndpoint = (hostname === 'n.nanosl.com' || hostname === 'n-client.nanosl.com')
//   ? 'http://n.nanosl.com/'
//   : hostname === '192.168.1.171' ? 'http://' + hostname + ':8080/n/' : 'http://' + hostname + ':8080/';
let apiEndpoint = 'http://' + hostname + ':8080/n/';
export const AppConfig: IAppConfig = {
  apiEndpoint: apiEndpoint,
};
