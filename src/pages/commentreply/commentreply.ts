import { Component } from '@angular/core';
import {  NavController, NavParams } from 'ionic-angular';
import { CommentviewPage } from '../commentview/commentview';

/**
 * Generated class for the CommentreplyPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-commentreply',
  templateUrl: 'commentreply.html',
})
export class CommentreplyPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CommentreplyPage');
  }
  
  previous() {
    this.navCtrl.setRoot(CommentviewPage);
  }

}
