import { Component } from '@angular/core';
import { NavController, NavParams, ViewController,Platform } from 'ionic-angular';
//import { EmailPage } from '../email/email';

import { Config } from '../../config/config';
/**
 * Generated class for the PopoverPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-popovercolorcode',
  templateUrl: 'popovercolorcode.html',
  providers:[Config]
  
})
export class PopovercolorcodePage {
  apiServiceURLHTML:any;
  public networkType: string;
  public photo: any;
  public firstname: any;
  public lastname: any;
  public job_position: any;
  public itemData: any;
  public ht:any;
  public cn:any;
  public email:any;
  public itemDataDelete = [];
  
  public EDITACCESS: any;
  public DELETEACCESS: any;
  constructor( private conf: Config,public platform: Platform,public viewCtrl: ViewController, public NP: NavParams, public NavController: NavController) {
    this.itemData = this.NP.get("item");
    console.log(JSON.stringify(this.itemData));
    this.itemDataDelete.push({ staff_id: this.itemData.staff_id });
    this.photo = this.itemData.photo;
    this.firstname = this.itemData.firstname;
    this.lastname = this.itemData.lastname;
    this.job_position = this.itemData.job_position;
    this.ht=this.itemData.personalhashtag;
    this.email=this.itemData.email;
    this.cn=this.itemData.contact_number;
     this.EDITACCESS = localStorage.getItem("SETTINGS_ORGCHART_EDIT");
    console.log("Role Authority for Unit Listing Edit:" + this.EDITACCESS);
    this.DELETEACCESS = localStorage.getItem("SETTINGS_ORGCHART_DELETE");
    console.log("Role Authority for Unit Listing Delete:" + this.DELETEACCESS);
 this.networkType = '';
    this.apiServiceURLHTML = conf.apiBaseURL();
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PopoverPage');
     localStorage.setItem("fromModule", "PopoverPage");
  }
  close(itemData) {
    this.viewCtrl.dismiss(itemData);
  }
  mail()
  {
    /*console.log("HELLO"+this.email);
     this.navCtrl.setRoot(EmailPage, {
      recordemail:this.email
     
     
    });*/
  }

}
