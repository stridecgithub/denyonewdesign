import { Component } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Config } from '../../config/config';
import { ServicinginfoPage } from "../servicinginfo/servicinginfo";
import { PreviewanddownloadPage } from '../previewanddownload/previewanddownload';
import { CommentsinfoPage } from "../commentsinfo/commentsinfo";
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



    if (this.navParams.get("event_id")) {

      //{"msg":{"result":"success"},"servicedetail":[{"service_id":"79","service_unitid":"66","serviced_by":"115","created_by":"115","service_dot_color":"#0066ff","service_dot_label":"service","service_formatted_date":"Tue, 06 Mar 2018 09:53 PM","service_subject":"Ad-hoc Service","service_remark":"this is a test remarks field @denyov2","is_denyo_support":"0","service_priority":"0","description":null,"service_scheduled_date":"2018-03-06","serviced_datetime":"2018-03-06T21:53:31","next_service_date":"","next_service_date_mobileview":"","next_service_date_selected":"","is_request":"0","time_ago":"47 minutes ago","current_datetime":"07 Mar 2018","serviced_created_name":"Bala","serviced_created_name_hastag":"(@bala)","user_photo":"http://denyoappv2.stridecdev.com/staffphotos/20180213160050_123_Tulips.jpg","serviced_by_name":"Bala","serviced_by_name_hastag":"(@bala)","serviced_by_name_hastag_withinclosedbracket":"(@bala)","service_resources":"","unitname":"Ind001","projectname":"India project","location":"Indian","latitude":"20.593684","longtitude":"78.96288","colorcode":"FF877C"}]}
      if (this.navParams.get("from") == 'Push') {
        let eventType = this.navParams.get("event_type");
        console.log("Event Type:" + eventType);


        let body: string = "serviceid=" + this.navParams.get("event_id"),
          type1: string = "application/x-www-form-urlencoded; charset=UTF-8",
          headers1: any = new Headers({ 'Content-Type': type1 }),
          options1: any = new RequestOptions({ headers: headers1 }),
          url1: any = this.apiServiceURL + "/servicebyid";
        console.log(url1 + "?" + body);
        this.http.post(url1, body, options1)
          .subscribe((data) => {
            console.log(JSON.stringify(data.json()))
            //this.item = data.json().servicedetail[0];
            this.serviced_datetime_display = data.json().servicedetail[0].serviced_datetime_edit;
            console.log("JSON for service detail" + JSON.stringify(data.json().servicedetail[0]));
            this.service_subject = data.json().servicedetail[0].service_subject;
            this.user_photo= data.json().servicedetail[0].user_photo;
            this.service_scheduled_time_format = data.json().servicedetail[0].service_formatted_date;
            this.service_remark = data.json().servicedetail[0].service_remark;
            this.serviced_created_name=data.json().servicedetail[0].serviced_created_name;
            this.serviced_created_name_hastag=data.json().servicedetail[0].serviced_created_name_hastag;
            this.service_description = data.json().servicedetail[0].description;
            this.next_service_date_mobileview = data.json().servicedetail[0].next_service_date_mobileview;
            this.service_scheduled_time_format = data.json().servicedetail[0].service_scheduled_time;
            // this.service_dot_color = data.json().servicedetail[0].service_dot_color;
            this.next_service_date_selected = data.json().servicedetail[0].next_service_date_selected;

            this.is_request = data.json().servicedetail[0].is_request;
            this.is_denyo_support = data.json().servicedetail[0].is_denyo_support;



            this.service_resources = data.json().servicedetail[0].service_resources;
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


          }, error => {

          });
      }
    } else {
      //this.tabBarElement.style.display = 'none';
      console.log('ionViewDidLoad ServicingDetailsPage');
      console.log("Record" + JSON.stringify(this.navParams.get("record")));
      console.log("From" + this.navParams.get("from"));
      //this.service_id = this.navParams.get("record").service_id;
      this.service_unitid = this.navParams.get("record").service_unitid;
      this.serviced_datetime = this.navParams.get("record").serviced_datetime;
      this.next_service_date_selected = this.navParams.get("record").next_service_date_selected;
      this.next_service_date = this.navParams.get("record").next_service_date.substr(0, 10);
      this.next_service_date_mobileview = this.navParams.get("record").next_service_date_mobileview;
      if (this.next_service_date == '0000-00-00') {
        this.next_service_date_selected = 0;
      }
      if (this.next_service_date == '') {
        this.next_service_date_selected = 0;
      }
      this.serviced_schduled_date = this.navParams.get("record").serviced_schduled_date;
      this.service_scheduled_time_format = this.navParams.get("record").service_scheduled_time_format;



      this.serviced_datetime_display_format = this.navParams.get("record").serviced_scheduled_display;
      this.serviced_created_name = this.navParams.get("record").serviced_created_name;
      this.serviced_created_name_hastag = this.navParams.get("record").serviced_created_name_hastag;


      this.serviced_datetime_display = this.navParams.get("record").serviced_datetime_edit;







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
    }
    console.log("Image Lists:-" + JSON.stringify(this.addedImgListsDetails));
  }

  previous() {

    if (this.navParams.get("from") == 'commentinfo') {
      this.navCtrl.setRoot(CommentsinfoPage, {
        record: this.navParams.get("record")
      });
    } else {
      this.navCtrl.setRoot(ServicinginfoPage, {
        record: this.navParams.get("record")
      });
    }
  }

  preview(imagedata, from) {
    this.navCtrl.setRoot(PreviewanddownloadPage, {
      imagedata: imagedata,
      record: this.navParams.get("record"),
      frompage: from
    });
  }

}


