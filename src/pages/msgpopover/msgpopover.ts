import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, Platform } from 'ionic-angular';
import { ComposePage } from "../compose/compose";
import { Config } from '../../config/config';
/**
 * Generated class for the PopoverPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-msgpopover',
  templateUrl: 'msgpopover.html',
  providers: [Config]

})
export class MsgPopoverPage {
  from;
  constructor(private conf: Config, public platform: Platform, public viewCtrl: ViewController, public NP: NavParams, public navCtrl: NavController) {

    this.from = this.NP.get('from');
    console.log("frm"+this.from);
  }

  ionViewDidLoad() {

  }
  close(itemData) {
    console.log("Close" + itemData);
    this.viewCtrl.dismiss(itemData);
  }




}
