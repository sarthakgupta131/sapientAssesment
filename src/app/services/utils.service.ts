import { Params } from '@models/params.model';

export class Utils {
  static getQueryString = (params) => Object.keys(params)
    .map(key => key + '=' + params[key])
    .join('&')
}
