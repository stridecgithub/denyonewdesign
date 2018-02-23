import { Component, Pipe } from '@angular/core';
import {  NavController, NavParams,Platform } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
//import { TabsPage } from "../tabs/tabs";
import { DomSanitizer } from '@angular/platform-browser';
/**
 * Generated class for the AttentionPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-attention',
  templateUrl: 'attention.html',
})
@Pipe({ name: 'safe' })
export class AttentionPage {
 
  url: any;
  url1: any;
  constructor(private platform:Platform,private sanitizer: DomSanitizer, public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController) {
    this.platform.registerBackButtonAction(() => {
      this.previous();
    });
  }
  transform(url) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad AttentionPage');
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
            //this.navCtrl.setRoot(TabsPage);
          }
        }
      ]
    });
    confirm.present();
  }
  previous() {
    //this.navCtrl.setRoot(TabsPage);
  }
}
