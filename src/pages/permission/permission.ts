import { Component } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';
import { Config } from '../../config/config';
import { DashboardPage } from '../dashboard/dashboard';
/**
 * Generated class for the PermissionPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

//@IonicPage()
@Component({
  selector: 'page-permission',
  templateUrl: 'permission.html',
})
export class PermissionPage {
  rolePermissionMsg;
  footerBar: number = 0;
  constructor(private conf: Config, public navCtrl: NavController, public navParams: NavParams,public platform:Platform) {

    this.platform.ready().then(() => {
      this.platform.registerBackButtonAction(() => {
        this.navCtrl.setRoot(DashboardPage);
      });
    });

   
  }

  ionViewDidLoad() {
    this.rolePermissionMsg = this.conf.rolePermissionMsg();
    
  }
  previous() {
    this.navCtrl.setRoot(DashboardPage);
  }
}
