import { Component } from '@angular/core';
import { ViewController, NavController, NavParams } from 'ionic-angular';
import { UnitdetailsPage } from '../unitdetails/unitdetails';
import { DashboardPage } from '../dashboard/dashboard';
import { UnitsPage } from '../units/units';
import { MockProvider } from '../../providers/pagination/pagination';
import { Config } from '../../config/config';

/**
 * Generated class for the ViewunitPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-viewunit',
  templateUrl: 'viewunit.html',
})
export class ViewunitPage {
  public unitAllLists = [];
  items: any;
  isInfiniteHide: boolean;
  pageperrecord;
  totalCount;
  constructor(private mockProvider: MockProvider, private conf: Config, public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
    this.pageperrecord = this.conf.pagePerRecord();
    this.isInfiniteHide = true;
  }

  ionViewDidLoad() {
    this.unitAllLists = this.navParams.get('item');
    this.totalCount = this.unitAllLists.length;
    this.items = this.mockProvider.getData(this.unitAllLists, 0, this.pageperrecord);
  }
  previous() {
    let from = this.navParams.get('from');
    if (from == 'unit') {
      this.navCtrl.setRoot(UnitsPage, {
      });
    }
    if (from == 'dashboard') {
      this.navCtrl.setRoot(DashboardPage, {
      });
    }
    //this.viewCtrl.dismiss();
  }

  doAction(item, act, unitId) {


    localStorage.setItem("unitId", unitId);
    localStorage.setItem("iframeunitId", unitId);
    localStorage.setItem("unitunitname", item.unitname);
    localStorage.setItem("unitlocation", item.location);
    localStorage.setItem("unitprojectname", item.projectname);
    localStorage.setItem("unitcolorcode", item.colorcodeindications);
    if (item.lat == undefined) {
      item.lat = '';
    }
    if (item.lat == 'undefined') {
      item.lat = '';
    }

    if (item.lng == undefined) {
      item.lng = '';
    }
    if (item.lng == 'undefined') {
      item.lng = '';
    }



    if (item.runninghr == undefined) {
      item.runninghr = '';
    }
    if (item.runninghr == 'undefined') {
      item.runninghr = '';
    }

    if (item.nextservicedate == undefined) {
      item.nextservicedate = '';
    }
    if (item.nextservicedate == 'undefined') {
      item.nextservicedate = '';
    }


    localStorage.setItem("unitlat", item.lat);
    localStorage.setItem("unitlng", item.lng);
    localStorage.setItem("runninghr", item.runninghr);
    localStorage.setItem("nsd", item.nextservicedate);

    localStorage.setItem("microtime", "");
    this.navCtrl.setRoot(UnitdetailsPage, {
      from: this.navParams.get('from'),
      page: 'viewunit',
      record: this.unitAllLists
    });
    return false;

  }

  doInfinite(infiniteScroll) {
    this.mockProvider.getAsyncData(this.unitAllLists, this.items.length, this.pageperrecord).then((newData) => {
      for (var i = 0; i < newData.length; i++) {
        this.items.push(newData[i]);
      }
      console.log("this.totalCount:" + this.totalCount);
      console.log("this.items.length:" + this.items.length);
      console.log('A')
      if (this.items.length >= this.totalCount) {
        console.log('B');
        this.isInfiniteHide = false
      }
      infiniteScroll.complete();

    });
  }

}
