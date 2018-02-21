import { Component, Pipe } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
//import { TabsPage } from "../tabs/tabs";
import { DomSanitizer } from '@angular/platform-browser';
import { DashboardPage } from '../dashboard/dashboard';
/**
 * Generated class for the MenuPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html',
})
@Pipe({ name: 'safe' })
export class MenuPage {
 
  url: any;
  url1: any;
  constructor(private sanitizer: DomSanitizer, public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController) {
   
  }
  transform(url) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad MenuPage');
    //this.showConfirm();

    //this.navCtrl.setRoot(CommentsinfoPage);
    // this.navCtrl.setRoot(TabsPage);
   // this.url = 'http://denyoappv2.stridecdev.com/20/1/unitdetails1';
    this.url = this.sanitizer.bypassSecurityTrustResourceUrl('http://denyoappv2.stridecdev.com/20/1/unitdetails1');
    this.url1 = this.sanitizer.bypassSecurityTrustResourceUrl('http://denyoappv2.stridecdev.com/20/1/unitdetails2');
  }
  showConfirm() {
    let confirm = this.alertCtrl.create({
      title: 'Attention',
      message: 'This function is disabled and not available for demo',
      buttons: [

        {
          text: 'Back',
          handler: () => {
            this.navCtrl.setRoot(DashboardPage);
          }
        }
      ]
    });
    confirm.present();
  }
  previous() {
    this.navCtrl.setRoot(DashboardPage);
  }
}
