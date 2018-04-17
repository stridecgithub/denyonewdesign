import { Component } from '@angular/core';
import { NavController, ToastController, NavParams, Platform, App } from 'ionic-angular';
import 'rxjs/add/operator/map';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

import { Http, Headers, RequestOptions } from '@angular/http';
//import { AddunitgroupPage } from '../addunitgroup/addunitgroup';
import { ReporttemplatePage } from '../reporttemplate/reporttemplate';
import { NotificationPage } from '../notification/notification';
import { Config } from '../../config/config';
///import { LoadingController } from 'ionic-angular';

/**
 * Generated class for the AddreporttemplatePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Io//nic pages and navigation.
 */
@Component({
  selector: 'page-addreporttemplate',
  templateUrl: 'addreporttemplate.html',
})
export class AddreporttemplatePage {
  public footerBar = [];
  public items = [];
  public template_data = [];
  public getCheckboxData = [];
  public loginas: any;
  public userId: any;
  public templatename: any;
  public templatedata: any;
  public form: FormGroup;
  public selectoption: any;
  public availableheading = [];
  public availableheadingitem = [];
  pageTitle: string;
  companyId;
  public recordID: any = null;
  public isEdited: boolean = false;
  private apiServiceURL: string = "";
  constructor(private app: App, private conf: Config, public nav: NavController,
    public http: Http,
    public NP: NavParams,
    public fb: FormBuilder,
    public toastCtrl: ToastController, public platform: Platform) {
    this.companyId = localStorage.getItem("userInfoCompanyId");
    this.apiServiceURL = this.conf.apiBaseURL();
    this.platform.ready().then(() => {
      this.platform.registerBackButtonAction(() => {
        const overlayView = this.app._appRoot._overlayPortal._views[0];
        if (overlayView && overlayView.dismiss) {
          overlayView.dismiss();
        }
        this.nav.setRoot(ReporttemplatePage);
      });
    });


    this.loginas = localStorage.getItem("userInfoName");
    // Create form builder validation rules
    this.form = fb.group({
      "templatename": ["", Validators.required]

    });

    this.userId = localStorage.getItem("userInfoId");


  }


  ionViewDidLoad() {

    if (this.NP.get("record")) {
      this.pageTitle = "Edit Report Template";

      this.isEdited = true;
      this.selectEntry(this.NP.get("record"));
    }
    else {
      this.pageTitle = "New Report Template";
      this.isEdited = false;

    }

    let type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + "/getavailableheading";
    let res;

    this.http.get(url, options)
      .subscribe((data) => {
        res = data.json();
        let checkvalue = false;
        if (res.templatedata.length > 0) {

          for (let tempdata in res.templatedata) {

            if (this.NP.get("record")) {
              if (this.in_array(res.templatedata[tempdata].availabledata, this.NP.get("record").availableheading) != -1) {
                //is in array
                checkvalue = true;

                this.getCheckboxData.push({
                  availabledata: res.templatedata[tempdata].availabledata
                });
              } else {
                checkvalue = false;
              }
            }
            this.availableheadingitem.push({
              id: res.templatedata[tempdata].id,
              availabledata: res.templatedata[tempdata].availabledata,
              check: checkvalue
            });
          }
        }
      });
  }

  in_array(needle, haystack) {
    var found = 0;
    for (var i = 0, len = haystack.length; i < len; i++) {
      if (haystack[i] == needle) return i;
      found++;
    }
    return -1;
  }



  getCheckBoxValue(id, item, value) {

  }
  insertUserToArray(id, item, value) {





    if (item._value == true) {
      this.getCheckboxData.push({ "availabledata": value });
    } else {
      for (var i = 0; i < this.getCheckboxData.length; i++) {
        if (this.getCheckboxData[i].availabledata == value) {
          this.getCheckboxData.splice(i, 1);
          break;
        }
      }
    }

  }


  saveEntry() {
    if (this.isEdited) {

      this.updateEntry();
    }
    else {
      this.createEntry();
    }


  }
  updateEntry() {
    if (this.getCheckboxData.length == 0) {
      this.sendNotification('Checkbox ateast one should be selected');
    } else {
      let templatename: string = this.form.controls["templatename"].value
      let body: string = "is_mobile=1&templatename=" + templatename + "&data=" + JSON.stringify(this.getCheckboxData) + "&id=" + this.recordID + "&ses_login_id=" + this.userId,
        type: string = "application/x-www-form-urlencoded; charset=UTF-8",
        headers: any = new Headers({ 'Content-Type': type }),
        options: any = new RequestOptions({ headers: headers }),
        url: any = this.apiServiceURL + "/reporttemplate/update";


      this.http.post(url, body, options)
        .subscribe((data) => {
          let res = data.json();

          // If the request was successful notify the user
          if (data.status === 200) {

            if (res.msg[0].result > 0) {
              this.sendNotification(res.msg[0].result);
              this.nav.setRoot(ReporttemplatePage);
            } else {
              this.sendNotification(res.msg[0].result);
              this.nav.setRoot(ReporttemplatePage);
            }
          }
          // Otherwise let 'em know anyway
          else {
            this.sendNotification('Something went wrong!');
          }
        });
    }
  }
  selectEntry(item) {

    this.templatename = item.templatename;

    this.recordID = item.id;


  }
  createEntry() {
    if (this.getCheckboxData.length == 0) {
      this.sendNotification('Checkbox ateast one should be selected');
    } else {

      let templatename: string = this.form.controls["templatename"].value
      let body: string = "is_mobile=1&templatename=" + templatename + "&companygroupid=" + this.companyId + "&data=" + JSON.stringify(this.getCheckboxData) + "&ses_login_id=" + this.userId,
        type: string = "application/x-www-form-urlencoded; charset=UTF-8",
        headers: any = new Headers({ 'Content-Type': type }),
        options: any = new RequestOptions({ headers: headers }),
        url: any = this.apiServiceURL + "/reporttemplate/store";

      console.log(url + "?" + body);
      this.http.post(url, body, options)
        .subscribe((data) => {
          let res = data.json();

          // If the request was successful notify the user
          if (data.status === 200) {

            if (res.msg[0].result > 0) {
              this.sendNotification(res.msg[0].result);
              this.nav.setRoot(ReporttemplatePage);
            } else {
              this.sendNotification(res.msg[0].result);
              this.nav.setRoot(ReporttemplatePage);
            }
          }
          // Otherwise let 'em know anyway
          else {
            this.sendNotification('Something went wrong!');
          }
        });
    }
  }
  sendNotification(message): void {
    let notification = this.toastCtrl.create({
      message: message,
      duration: 3000
    });
    notification.present();
  }
  previous() {
    this.nav.setRoot(ReporttemplatePage);
  }
  notification() {
    this.nav.setRoot(NotificationPage);
  }

}
