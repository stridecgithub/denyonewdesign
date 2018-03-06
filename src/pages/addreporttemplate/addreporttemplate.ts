import { Component } from '@angular/core';
import { NavController, ToastController, NavParams } from 'ionic-angular';
import 'rxjs/add/operator/map';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

import { Http, Headers, RequestOptions } from '@angular/http';
//import { AddunitgroupPage } from '../addunitgroup/addunitgroup';
import { ReporttemplatePage } from '../reporttemplate/reporttemplate';
import { NotificationPage } from '../notification/notification';
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
  public footerBar= [];
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
  public recordID: any = null;
  public isEdited: boolean = false;
  private apiServiceURL: string = "http://denyoappv2.stridecdev.com";
  constructor(public nav: NavController,
    public http: Http,
    public NP: NavParams,
    public fb: FormBuilder,
    public toastCtrl: ToastController) {
    this.loginas = localStorage.getItem("userInfoName");
    // Create form builder validation rules
    this.form = fb.group({
      "templatename": ["", Validators.required]

    });

    this.userId = localStorage.getItem("userInfoId");
// Footer Menu Access - Start
let footeraccessstorage = localStorage.getItem("footermenu");
let footeraccessparams = this.NP.get('footermenu');
let footermenuacc;
if (footeraccessparams != undefined) {
  footermenuacc = footeraccessparams;
} else {
  footermenuacc = footeraccessstorage;
}


// this.footerBar="0,"+footermenuacc;

let footermenusplitcomma = footermenuacc.split(",");
let dashboardAccess = footermenusplitcomma[0];
let unitAccess = footermenusplitcomma[1];
let calendarAccess = footermenusplitcomma[2];
let messageAccess = footermenusplitcomma[3];
let orgchartAccess = footermenusplitcomma[4];






let dashboarddisplay;
if (dashboardAccess == 1) {
  dashboarddisplay = '';
} else {
  dashboarddisplay = 'none';
}
this.footerBar.push({
  title: 'Dashboard',
  active: true,
  colorcode: "#488aff",
  footerdisplay: dashboarddisplay,
  pageComponent: 'DashboardPage'
});
let unitdisplay;
if (unitAccess == 1) {
  unitdisplay = '';
} else {
  unitdisplay = 'none';
}
this.footerBar.push({
  title: 'Units',
  active: false,
  colorcode: "rgba(60, 60, 60, 0.7)",
  footerdisplay: unitdisplay,
  pageComponent: 'UnitsPage'
});
let calendardisplay;
if (calendarAccess == 1) {
  calendardisplay = '';
} else {
  calendardisplay = 'none';
}

this.footerBar.push({
  title: 'Calendar',
  active: false,
  colorcode: "rgba(60, 60, 60, 0.7)",
  footerdisplay: calendardisplay,
  pageComponent: 'CalendarPage'
});
let messagedisplay;
if (messageAccess == 1) {
  messagedisplay = '';
} else {
  messagedisplay = 'none';
}
this.footerBar.push({
  title: 'Message',
  active: false,
  colorcode: "rgba(60, 60, 60, 0.7)",
  footerdisplay: messagedisplay,
  pageComponent: 'MessagePage'
});
let orgchartdisplay;
if (orgchartAccess == 1) {
  orgchartdisplay = '';
} else {
  orgchartdisplay = 'none';
}
this.footerBar.push({
  title: 'Org Chart',
  active: false,
  footerdisplay: orgchartdisplay,
  colorcode: "rgba(60, 60, 60, 0.7)",
  pageComponent: 'OrgchartPage'
});


//this.footerBar = "0";
//let footerBar=this.footerBar.split(",");


// Footer Menu Access - End

  }
  /*
insertUserToArray(id,item){
//check item.user and do stuff

console.log("Current Available Loop Data"+JSON.stringify(this.availableheadingitem));
console.log("Id"+id+"<==>"+item._value);

console.log("Selected DAta:"+JSON.stringify(this.getCheckboxData));
}*/
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad AddreporttemplatePage');
    if (this.NP.get("record")) {
      this.pageTitle = "Edit Report Template";
      console.log(this.NP.get("record"));
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
    console.log(url);
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


  /*getCheckBoxValue(name) {
    console.log("Available data" + name);


    this.getCheckboxData.push({
      availabledata: name
    })
    console.log(JSON.stringify(this.getCheckboxData));
  }*/

  getCheckBoxValue(id, item, value) {

  }
  insertUserToArray(id, item, value) {

    /* console.log("Available data" + name);
 
 
     this.getCheckboxData.push({
       availabledata: name
     })
     console.log(JSON.stringify(this.getCheckboxData));
     */


    //check item.user and do stuff

    console.log("Current Available Loop Data" + JSON.stringify(this.availableheadingitem));
    console.log("Id:" + id + "<==>Checkbox Boolean:" + item._value + "<==>Checkbox value:" + value);

    //console.log("Selected DAta:"+JSON.stringify(this.getCheckboxData));
    //this.getCheckboxData.splice(1,1);
    //console.log("Filter DAta:"+JSON.stringify(this.getCheckboxData));

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
    console.log("Edited Data" + JSON.stringify(this.getCheckboxData));
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
      //let getCheckbox = this.remove_duplicates(this.getCheckboxData);
      //console.log("Check" + getCheckbox);
      let templatename: string = this.form.controls["templatename"].value
      let body: string = "is_mobile=1&templatename=" + templatename + "&data=" + JSON.stringify(this.getCheckboxData) + "&id=" + this.recordID + "&ses_login_id=" + this.userId,
        type: string = "application/x-www-form-urlencoded; charset=UTF-8",
        headers: any = new Headers({ 'Content-Type': type }),
        options: any = new RequestOptions({ headers: headers }),
        url: any = this.apiServiceURL + "/reporttemplate/update";
      console.log(url + "?" + body);

      this.http.post(url, body, options)
        .subscribe((data) => {
          let res = data.json();
          console.log(JSON.stringify(data.json()));
          // If the request was successful notify the user
          if (data.status === 200) {
            console.log("Msg Results:-" + res.msg[0].result);
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
    console.log("Id:" + item.id);
    this.recordID = item.id;
    console.log("Available Heading:" + JSON.stringify(item.availableheading));
    console.log(item.availableheading);
    for (let ava = 0; ava < item.availableheading; ava++) {
      console.log(item.availableheading[ava]);
    }

  }
  createEntry() {
    if (this.getCheckboxData.length == 0) {
      this.sendNotification('Checkbox ateast one should be selected');
    } else {
      console.log(JSON.stringify(this.getCheckboxData));
      let templatename: string = this.form.controls["templatename"].value
      let body: string = "is_mobile=1&templatename=" + templatename + "&data=" + JSON.stringify(this.getCheckboxData) + "&ses_login_id=" + this.userId,
        type: string = "application/x-www-form-urlencoded; charset=UTF-8",
        headers: any = new Headers({ 'Content-Type': type }),
        options: any = new RequestOptions({ headers: headers }),
        url: any = this.apiServiceURL + "/reporttemplate/store";
      console.log(url + "?" + body);

      this.http.post(url, body, options)
        .subscribe((data) => {
          let res = data.json();
          console.log(JSON.stringify(data.json()));
          // If the request was successful notify the user
          if (data.status === 200) {
            console.log("Msg Results:-" + res.msg[0].result);
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
