import { Component } from '@angular/core';
import {  NavController, NavParams } from 'ionic-angular';
import { EventsandcommentsPage } from '../eventsandcomments/eventsandcomments';
import { EventeditPage } from '../eventedit/eventedit';
/**
 * Generated class for the EventviewPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-eventview',
  templateUrl: 'eventview.html',
})
export class EventviewPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EventviewPage');
  }
  
  previous() {
    this.navCtrl.setRoot(EventsandcommentsPage);
  }

  eventedit() {
    this.navCtrl.setRoot(EventeditPage);
  }
}
