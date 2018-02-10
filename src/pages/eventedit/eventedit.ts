import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { EventviewPage } from '../eventview/eventview';

/**
 * Generated class for the EventeditPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-eventedit',
  templateUrl: 'eventedit.html',
})

export class EventeditPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EventeditPage');
  }
  
  previous() {
    this.navCtrl.setRoot(EventviewPage);
  }

}
