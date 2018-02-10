import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { EventsandcommentsPage } from '../eventsandcomments/eventsandcomments';

/**
 * Generated class for the CommentviewPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-commentview',
  templateUrl: 'commentview.html',
})
export class CommentviewPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CommentviewPage');
  }
  
  previous() {
    this.navCtrl.setRoot(EventsandcommentsPage);
  }

}
