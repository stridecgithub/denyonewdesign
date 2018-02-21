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
  public templatename;
  public availableheading = [];
  footerBar: number = 0;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }
  ionViewDidLoad() {
    this.templatename=this.navParams.get('templatename');
    this.availableheading=this.navParams.get('templatedata');
    console.log("Report template name"+this.templatename);
    console.log("Report availabe"+JSON.stringify(this.availableheading));
    // console.log('ionViewDidLoad ReporttemplatedetailPage');
    // let res = this.navParams.get('templatedata');
    // console.log(JSON.stringify(res));
    // if (res.length > 0) {
    //   console.log('A');
    //   for (let availabletemps in res) {
    //     console.log('B');
    //     this.reporttemplateAllLists.push({
    //       id: res[availabletemps].id,
    //       templatename: res[availabletemps].templatename,
    //      // availableheading: res[availabletemps].availableheading.split("#")
    //     });
    //   }
    //   console.log(JSON.stringify(this.reporttemplateAllLists));
    // } else {
    //   console.log('C');
    //   //this.totalCount = 0;
    // }
  }
  previous() {
    this.navCtrl.setRoot(ReporttemplatePage);
  }
}
