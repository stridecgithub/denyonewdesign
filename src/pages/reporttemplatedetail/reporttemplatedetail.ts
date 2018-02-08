import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ReporttemplatePage } from '../reporttemplate/reporttemplate';

/**
 * Generated class for the ReporttemplatedetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-reporttemplatedetail',
  templateUrl: 'reporttemplatedetail.html',
})
export class ReporttemplatedetailPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ReporttemplatedetailPage');
  }
	previous() {
     this.navCtrl.setRoot(ReporttemplatePage);
  }

}
