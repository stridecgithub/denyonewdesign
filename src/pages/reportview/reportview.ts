import { Component } from '@angular/core';
import {  NavController, NavParams } from 'ionic-angular';
import { ReportsPage } from "../reports/reports";

/**
 * Generated class for the ReportviewPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-reportview',
  templateUrl: 'reportview.html',
})
export class ReportviewPage {

	public buttonClicked: boolean = false; //Whatever you want to initialise it as

    public onButtonClick() {

        this.buttonClicked = !this.buttonClicked;
    }

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ReportviewPage');
  }
  previous() {
    this.navCtrl.setRoot(ReportsPage);
  }
}
