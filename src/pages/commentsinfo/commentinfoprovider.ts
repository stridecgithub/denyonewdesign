import { Injectable } from '@angular/core';
@Injectable()
export class MockProvider {
  getData(cmtdata, incr): any[] {
    let st = 0;
    let ed = 20;
    if (incr == 20) {
      st = 20;
      ed = 40;
    } else if (incr >= 40) {
      st = incr;
      ed = incr + 20;
    }
    let data: any[] = [];
    for (var i = st; i < ed; i++) {

      if (i < cmtdata.length) {
        data.push(cmtdata[i]);
      }
    }
    return data;
  }
  getAsyncData(cmtdata, incr): Promise<any[]> {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(this.getData(cmtdata, incr));
      }, 1000);

    });
  }
}