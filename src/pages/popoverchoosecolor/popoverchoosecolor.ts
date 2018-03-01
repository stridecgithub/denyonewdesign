import { Component } from '@angular/core';
import {  NavController, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the PopoverchoosecolorPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-popoverchoosecolor',
  templateUrl: 'popoverchoosecolor.html',
})
export class PopoverchoosecolorPage{
constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {}
close() {
    this.viewCtrl.dismiss();
  }
}