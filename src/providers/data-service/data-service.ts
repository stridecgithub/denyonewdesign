import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { Http, Response } from "@angular/http";
/*
  Generated class for the DataServiceProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class DataServiceProvider {

  constructor(public http: Http) {
    console.log('Hello DataServiceProvider Provider');
  }

  getMenus() {
    return this.http.get('assets/data/menus.json')
      .map((response: Response) => response.json());
  }

}
