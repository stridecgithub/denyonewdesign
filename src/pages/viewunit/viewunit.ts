import { Component } from '@angular/core';
import { ViewController, NavController, NavParams } from 'ionic-angular';
import { UnitdetailsPage } from '../unitdetails/unitdetails';
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
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {

  }

  ionViewDidLoad() {
    this.unitAllLists = this.navParams.get('item');  
  }
  previous() {
    this.viewCtrl.dismiss();
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
        record: item
      });
      return false;
    
  }
}
