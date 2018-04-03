import { Component } from '@angular/core';
import {  NavController, NavParams ,Platform,App} from 'ionic-angular';
import { ReporttemplatePage } from '../reporttemplate/reporttemplate';

/**
 * Generated class for the ReporttemplatedetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-reporttemplatedetail',
  templateUrl: 'reporttemplatedetail.html',
})
export class ReporttemplatedetailPage {
  public templatename;
  public availableheading = [];
  public footerBar=[];
  constructor(public app: App,public navCtrl: NavController, public navParams: NavParams,public platform:Platform) {

    this.platform.ready().then(() => {
      this.platform.registerBackButtonAction(() => {
        const overlayView = this.app._appRoot._overlayPortal._views[0];
        if (overlayView && overlayView.dismiss) {
          overlayView.dismiss();
        }
        this.navCtrl.setRoot(ReporttemplatePage);
      });
    });
    

  
   

  }
  ionViewDidLoad() {
    this.templatename=this.navParams.get('templatename');
    this.availableheading=this.navParams.get('templatedata');
   
  }
  previous() {
     this.navCtrl.setRoot(ReporttemplatePage);
  }
}
