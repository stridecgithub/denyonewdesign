import { Component } from '@angular/core';
import {  NavController, NavParams } from 'ionic-angular';
//import {AlarmLogPage} from "../alarm-log/alarm-log";

/**
 * Generated class for the UnitDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-unit-details',
  templateUrl: 'unit-details.html',
})
export class UnitDetailsPage {

  public tabs: string = 'overviewView';

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UnitDetailsPage');
  }


  // Goto Alarm Log page
  gotoAlrmLog() {
    //this.navCtrl.setRoot(AlarmLogPage);
  }

}
