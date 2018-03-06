import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { DomSanitizer } from '@angular/platform-browser';
import { Http, Headers, RequestOptions } from '@angular/http';
//import { Http, Headers, RequestOptions } from '@angular/http';
//import { HTTP } from '@ionic-native/http';
//import * as $ from 'jquery';
import { NotificationPage } from '../notification/notification';
import { EnginedetailPage } from '../enginedetail/enginedetail';
import { Config } from '../../config/config';

@Component({
  selector: 'page-engineview',
  templateUrl: 'engineview.html',
})
export class EngineviewPage {
  public pageTitle: string;
  footerBar: number = 1;
  public item = [];
  public msgcount: any;
  public notcount: any;
  public colorListArr = [];
  iframeContent: any;
  profilePhoto;
  //private _inputpdf: string = '<iframe src="http://denyoappv2.stridecdev.com/2/1/unitdetails" height="350" frameborder="0"></iframe>';
  private apiServiceURL: string = "";

  public serviceCount;
  public commentCount;




  public unitDetailData: any = {
    model_id: '',
    iframeURL: ''



  }
  constructor(public http: Http, private conf: Config, private sanitizer: DomSanitizer, public NP: NavParams, public navCtrl: NavController, public navParams: NavParams, public nav: NavController) {
    this.unitDetailData.loginas = localStorage.getItem("userInfoName");
    this.unitDetailData.userId = localStorage.getItem("userInfoId");
    this.apiServiceURL = this.conf.apiBaseURL();
    this.profilePhoto = localStorage.getItem("userInfoPhoto");
    if (this.profilePhoto == '' || this.profilePhoto == 'null') {
      this.profilePhoto = this.apiServiceURL + "/images/default.png";
    } else {
      this.profilePhoto = this.apiServiceURL + "/staffphotos/" + this.profilePhoto;
    }
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad EngineviewPage');
    let //body: string = "loginid=" + this.userId,
      type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + "/msgnotifycount?loginid=" + localStorage.getItem("userInfoId");
    console.log(url);
    // console.log(body);

    this.http.get(url, options)
      .subscribe((data) => {
        console.log("Count Response Success:" + JSON.stringify(data.json()));
        this.msgcount = data.json().msgcount;
        this.notcount = data.json().notifycount;
      });
    console.log(JSON.stringify(this.NP.get("record")));
    let editItem = this.NP.get("record");
    // this.iframeContent = "<iframe id='filecontainer' src=" + this.apiServiceURL + "/webview_enginedetails/"+editItem.model_id + " height=500px width=100% frameborder=0></iframe>";

    this.iframeContent = this.sanitizer.bypassSecurityTrustResourceUrl(this.apiServiceURL + "/webview_enginedetails/" + editItem.model_id);

  }
  notification() {
    this.navCtrl.setRoot(NotificationPage);
  }


  previous() {
    this.navCtrl.setRoot(EnginedetailPage);
  }
}
