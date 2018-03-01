import { Component } from '@angular/core';
import {  NavController, NavParams } from 'ionic-angular';
import { EventviewPage } from '../eventview/eventview';

/**
 * Generated class for the EventaddPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-eventadd',
  templateUrl: 'eventadd.html',
})
export class EventaddPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EventaddPage');
  }
  
  previous() {
    this.navCtrl.setRoot(EventviewPage);
  }

}
