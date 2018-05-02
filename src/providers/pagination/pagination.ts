import { Injectable } from '@angular/core';
@Injectable()
export class MockProvider {
  getData(cmtdata, incr, per): any[] {

    let pr = per;
    let sec = pr + per;

    let st = 0;
    let ed = pr;
    if (incr == pr) {
      st = pr;
      ed = sec;
    } else if (incr >= sec) {
      st = incr;
      ed = incr + pr;
    }
    let data: any[] = [];
    for (var i = st; i < ed; i++) {

      if (i < cmtdata.length) {
        data.push(cmtdata[i]);
      }
    }
    return data;
  }
  getAsyncData(cmtdata, incr, per): Promise<any[]> {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(this.getData(cmtdata, incr, per));
      }, 1000);

    });
  }
}