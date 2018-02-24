import { Component } from '@angular/core';
import {  NavController, NavParams, Platform } from 'ionic-angular';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Config } from '../../config/config';
import { ServicinginfoPage } from "../servicinginfo/servicinginfo";
import { PreviewanddownloadPage } from '../previewanddownload/previewanddownload';
/**
 * Generated class for the ServicingDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-servicing-details',
  templateUrl: 'servicing-details.html',
  providers: [Config]
})
export class ServicingDetailsPage {
  service_id;
  service_unitid;
  serviced_datetime;
  //serviced_datetime_display;
  serviced_datetime_display: String = new Date().toISOString();
  service_subject;
  service_remark;
  service_description;
  is_denyo_support;
  is_request;
  service_priority;
  current_datetime;
  user_photo;
  service_resources;
  serviced_created_name;
  serviced_created_name_hastag;
  serviced_schduled_date;
  service_scheduled_time_format;
  serviced_datetime_display_format;
  next_service_date_selected;
  next_service_date;
  next_service_date_mobileview;
  private apiServiceURL: string = "";
  public addedImgListsDetails = [];
  //tabBarElement: any;
  service_time;
  hoursadd24hourformat;
  constructor(public navCtrl: NavController, public platform: Platform, private conf: Config, public navParams: NavParams, public http: Http) {
    this.apiServiceURL = conf.apiBaseURL();
    this.platform.registerBackButtonAction(() => {
      this.previous();
    });
    //this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
  }
  ionViewWillLeave() {
    //this.tabBarElement.style.display = 'flex';
  }
  ionViewDidLoad() {
    //this.tabBarElement.style.display = 'none';
    console.log('ionViewDidLoad ServicingDetailsPage');
    console.log("Record" + JSON.stringify(this.navParams.get("record")));
    console.log("From" + this.navParams.get("from"));
    //this.service_id = this.navParams.get("record").service_id;
    this.service_unitid = this.navParams.get("record").service_unitid;
    this.serviced_datetime = this.navParams.get("record").serviced_datetime;
    this.next_service_date_selected = this.navParams.get("record").next_service_date_selected;
    this.next_service_date = this.navParams.get("record").next_service_date.substr(0,10);
    this.next_service_date_mobileview = this.navParams.get("record").next_service_date_mobileview;
    if (this.next_service_date == '0000-00-00') {
      this.next_service_date_selected = 0;
    }
    if (this.next_service_date == '') {
      this.next_service_date_selected = 0;
    }
    this.serviced_schduled_date = this.navParams.get("record").serviced_schduled_date;
    this.service_scheduled_time_format = this.navParams.get("record").service_scheduled_time_format;

  

    //if (this.navParams.get("from") == 'upcoming') {
      this.serviced_datetime_display_format = this.navParams.get("record").serviced_scheduled_display;
      this.serviced_created_name = this.navParams.get("record").serviced_created_name;
      this.serviced_created_name_hastag = "(" + this.navParams.get("record").serviced_created_name_hastag + ")";

    // } else {
    //   this.serviced_datetime_display_format = this.navParams.get("record").serviced_scheduled_display;
    //   this.serviced_created_name = this.navParams.get("record").service_created_name;
    //   this.serviced_created_name_hastag = this.navParams.get("record").service_created_name_hastag;

    // }
//let tme=this.navParams.get("record").service_scheduled_time_format.replace(" ",":00");
    this.serviced_datetime_display = this.navParams.get("record").serviced_datetime_edit;


    // this.serviced_datetime_display = this.navParams.get("record").service_scheduled_time_format.substr(0, 5);
    // let getampmpvalue = this.navParams.get("record").service_scheduled_time_format.substr(6, 8)
    // console.log("AMPM:" + getampmpvalue);
    // if (getampmpvalue == 'PM') {
    //   let timesplit = this.serviced_datetime_display.split(":");
    //   let hoursadd24hourformat = parseInt(timesplit[0]) + 12;
    //   console.log("hoursadd24hourformat" + hoursadd24hourformat);
    //   this.serviced_datetime_display = hoursadd24hourformat + ":" + timesplit[1];
    //   this.serviced_datetime_display =this.navParams.get("record").serviced_schduled_date + "T" + this.serviced_datetime_display+":"+this.serviced_datetime_display;
    // }


    // this.service_time = this.navParams.get("record").service_scheduled_time_format.substr(0, 5);
    // console.log(" this.service_time" + this.service_time);
    // let getampmpvalue = this.navParams.get("record").service_scheduled_time_format.substr(6, 8)
    // console.log("AMPM:" + getampmpvalue);
    // if (getampmpvalue == 'PM') {
    //   let timesplit = this.service_time.split(":");
    //   this.hoursadd24hourformat = parseInt(timesplit[0]) + 12;
    //   console.log("hoursadd24hourformat PM" + this.hoursadd24hourformat);
    //   this.service_time = this.hoursadd24hourformat + ":" + timesplit[1];
    // } else {
    //   let timesplit = this.service_time.split(":");
    //   this.hoursadd24hourformat = parseInt(timesplit[0]);
    //   if (this.hoursadd24hourformat == 12) {
    //     this.hoursadd24hourformat = '00';
    //   }
    //   console.log("hoursadd24hourformat aM" + this.hoursadd24hourformat);
    //   this.service_time = this.hoursadd24hourformat + ":" + timesplit[1];
    // }


    // //this.serviced_datetime_display = '2018-02-06T00:00';
    // //this.serviced_datetime_display = this.navParams.get("record").serviced_schduled_date + "T" + this.service_time;

    // console.log("serviceing-details.ts" + this.serviced_datetime_display);




    this.service_subject = this.navParams.get("record").service_subject;
    this.service_remark = this.navParams.get("record").service_remark;
    this.service_description = this.navParams.get("record").service_description;
    if (this.service_description == null) {
      this.service_description = '';
    }
    if (this.service_description == 'null') {
      this.service_description = '';
    }
    this.is_denyo_support = this.navParams.get("record").is_denyo_support;
    this.is_request = this.navParams.get("record").is_request;
    this.service_priority = this.navParams.get("record").service_priority;
    this.current_datetime = this.navParams.get("record").current_datetime;
    this.user_photo = this.navParams.get("record").user_photo;

    this.service_resources = this.navParams.get("record").service_resources;
    if (this.service_resources != undefined && this.service_resources != 'undefined' && this.service_resources != '') {
      console.log('service reource calling....')
      let hashhypenhash = this.service_resources.split("#-#");
      console.log("#-#" + hashhypenhash);
      for (let i = 0; i < hashhypenhash.length; i++) {
        let imgDataArr = hashhypenhash[i].split("|");
        console.log("imgDataArr" + imgDataArr[i])
        let imgSrc;
        imgSrc = this.apiServiceURL + "/serviceimages" + '/' + imgDataArr[1];
        this.addedImgListsDetails.push({
          imgSrc: imgSrc,
          imgDateTime: new Date(),
          fileName: imgDataArr[1],
          resouce_id: imgDataArr[0]
        });
      }

    }
    console.log("Image Lists:-" + JSON.stringify(this.addedImgListsDetails));
  }

  previous() {
    this.navCtrl.setRoot(ServicinginfoPage, {
      record: this.navParams.get("record")
    });
  }

  preview(imagedata, from) {
    this.navCtrl.setRoot(PreviewanddownloadPage, {
      imagedata: imagedata,
      record: this.navParams.get("record"),
      frompage: from
    });
  }

}


