import { Component } from '@angular/core';
import {  NavController, NavParams } from 'ionic-angular';
import { CommentviewPage } from '../commentview/commentview';

/**
 * Generated class for the CommentaddPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-commentadd',
  templateUrl: 'commentadd.html',
})
export class CommentaddPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CommentaddPage');
  }
  
  previous() {
    this.navCtrl.setRoot(CommentviewPage);
  }

}
