import { Component } from '@angular/core';
import { Platform, NavController, NavParams, AlertController } from 'ionic-angular';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { UnitsPage } from '../units/units';
import { UnitdetailsPage } from '../unitdetails/unitdetails';
import { AddUnitPage } from '../add-unit/add-unit';
import { Config } from '../../config/config';
import { Http, Headers, RequestOptions } from '@angular/http';
import { DashboardPage } from '../dashboard/dashboard';
//import { TabsPage } from '../tabs/tabs';
//declare var jQuery: any;
//declare var tagEditor: any;
/**
 * Generated class for the NotificationSettingsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
declare var jQuery: any;
declare var mention:any;

@Component({
  selector: 'page-notification-settings',
  templateUrl: 'notification-settings.html',
  providers: [Config]
})
export class NotificationSettingsPage {
  public form: FormGroup;
  public alarmhashtags: any;
  public contact_name_1: any;
  public contact_number_1: any;
  public contact_name_2: any;
  public contact_number_2: any;
  public contact_name_3: any;
  public contact_number_3: any;
  public contact_name_4: any;
  public contact_number_4: any;
  public contact_name_5: any;
  public contact_number_5: any;
  public gethashtag: any;
  public userId: any;
  public unitname: any;
  public createdby: any;
  public location: any;
  public latitude: any;
  public msgcount: any;
  public notcount: any;
  public longitude: any;
  public projectname: any;
  public controllerid: any;
  public neaplateno: any;
  public models_id: any;
  public isEdited: any;
  public readOnly: boolean = false;
  public addmorebtn: any = 1;
  public cont2: boolean = false;
  public cont3: boolean = false;
  public cont4: boolean = false;
  public cont5: boolean = false;
  public isSubmitted: boolean = false;
  /*public primary: any;
  public primary_2: any;
  public primary_3: any;
  public primary_4: any;
  public primary_5: any;*/
  public contactnameArray = [];
  public contactnumberArray = [];
  public atmentioneddata = [];
  item;
  public borderbottomredvalidation: any = 'border-bottom-valid';
  public borderbottomredvalidation2: any = 'border-bottom-valid';
  public borderbottomredvalidation3: any = 'border-bottom-valid';
  public borderbottomredvalidation4: any = 'border-bottom-valid';
  public borderbottomredvalidation5: any = 'border-bottom-valid';
  public recordID: any = null;
  private apiServiceURL: string = "";
  public hideForm: boolean = false;
  public hideActionButton = true;
  public timezone;
  public companys_id: any;
  public contactInfo = [];
  public previousFormData = [];
  public unitgroups_id: any;
  //tabBarElement: any;
  serial_number: any;
  contactpersonal;
  contactnumber;
  companyId;
  constructor(
    public platform: Platform, public http: Http, public alertCtrl: AlertController, public fb: FormBuilder, private conf: Config, public navCtrl: NavController, public navParams: NavParams) {
    this.isSubmitted = false;
    this.form = fb.group({
      "alarmhashtags": [""],
      "contact_name_1": ["", Validators.required],
      'contact_number_1': ["", Validators.required],
      "contact_name_2": [""],
      'contact_number_2': [""],
      "contact_name_3": [""],
      'contact_number_3': [""],
      "contact_name_4": [""],
      'contact_number_4': [""],
      "contact_name_5": [""],
      'contact_number_5': [""],
      /* "primary": [""],
       "primary_2": [""],
       "primary_3": [""],
       "primary_4": [""],
       "primary_5": [""],*/

    });

    this.apiServiceURL = conf.apiBaseURL();
    if (this.navParams.get("accountInfo")) {
      this.previousFormData = this.navParams.get("accountInfo");
      this.unitname = this.previousFormData[0]['unitname'];
      console.log("Unit Name:" + this.unitname);
      this.projectname = this.previousFormData[0]['projectname'];
      console.log("Project Nam:" + this.projectname);
      this.controllerid = this.previousFormData[0]['controllerid'];
      this.neaplateno = this.previousFormData[0]['neaplateno'];
      this.models_id = this.previousFormData[0]['models_id'];
      this.location = this.previousFormData[0]['location'];
      this.companys_id = this.previousFormData[0]['companys_id'];
      this.unitgroups_id = this.previousFormData[0]['unitgroups_id'];
      this.latitude = this.previousFormData[0]['lat'];
      this.longitude = this.previousFormData[0]['lang'];
      this.serial_number = this.previousFormData[0]['serial_number'];
      this.contactpersonal = this.previousFormData[0]['contactpersonal'];
      this.contactnumber = this.previousFormData[0]['contactnumber'];
      let previousData = localStorage.getItem("addUnitFormOneValue");
      console.log(previousData);
      this.platform.registerBackButtonAction(() => {
        this.previous();
      });
    }
    this.userId = localStorage.getItem("userInfoId");
    this.companyId = localStorage.getItem("userInfoCompanyId");
    console.log("Record param" + this.navParams.get("record"))

    console.log("Is Edited?" + this.navParams.get("isEdited"));

    console.log(this.isEdited);
    // this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
  }
  geninfo(item, editdata) {
    console.log("Get Info:" + JSON.stringify(item));

    this.contactpersonal = editdata[0]['contactpersonal'];
    this.contactnumber = editdata[0]['contactnumber'];
    this.item = item;
    let editItem = this.navParams.get("record");
    this.alarmhashtags = editItem.alarmnotificationto;
    let contactArr = editItem.contacts;
    if (contactArr != undefined && contactArr != 'undefined' && contactArr != '') {
      let hashhypenhash = contactArr.split("#");
      for (let i = 0; i < hashhypenhash.length; i++) {

        let contDataArr = hashhypenhash[i].split("|");
        let contactName;
        let contactNumber;
        contactName = contDataArr[0];
        contactNumber = contDataArr[1];

        console.log("incr:" + i);
        console.log("contactName:" + contactName);
        console.log("contactNumber:" + contactNumber);
        if (i == 0) {
          this.contact_name_1 = contactName;
          this.contact_number_1 = contactNumber;

          if (this.contact_number_1 != undefined) {
            //let contactSplitSpace = this.contact_number_1.split(" ");
            //this.primary = contactSplitSpace[0];
            //this.contact_number_1 = contactSplitSpace[1];
            this.contact_number_1 = this.contact_number_1;
          }
        }
        if (i == 1 && contactName != '') {
          this.cont2 = true;
          this.contact_name_2 = contactName;
          this.contact_number_2 = contactNumber;

          if (this.contact_number_2 != undefined) {
            //let contactSplitSpace = this.contact_number_2.split(" ");
            //this.primary_2 = contactSplitSpace[0];
            //this.contact_number_2 = contactSplitSpace[1];
            //console.log("primary_2:" + this.primary_2);
            this.contact_number_2 = this.contact_number_2;
            console.log("contact_number_2:" + this.contact_number_2);
          }


        }
        if (i == 2 && contactName != '') {
          this.cont3 = true;
          this.contact_name_3 = contactName;
          this.contact_number_3 = contactNumber;

          if (this.contact_number_3 != undefined) {
            let contactSplitSpace = this.contact_number_3.split(" ");
            // this.primary_3 = contactSplitSpace[0];
            // this.contact_number_3 = contactSplitSpace[1];
            this.contact_number_3 = this.contact_number_3;
          }
        }
        if (i == 3 && contactName != '') {
          this.cont4 = true;
          this.contact_name_4 = contactName;
          this.contact_number_4 = contactNumber;
          if (this.contact_number_4 != undefined) {
            // let contactSplitSpace = this.contact_number_4.split(" ");
            // this.primary_4 = contactSplitSpace[0];
            //this.contact_number_4 = contactSplitSpace[1];
            this.contact_number_4 = this.contact_number_4;
          }
        }
        if (i == 4 && contactName != '') {
          this.cont5 = true;
          this.contact_name_5 = contactName;
          this.contact_number_5 = contactNumber;

          if (this.contact_number_5 != undefined) {
            let contactSplitSpace = this.contact_number_5.split(" ");
            // this.primary_5 = contactSplitSpace[0];
            // this.contact_number_5 = contactSplitSpace[1];
            this.contact_number_5 = this.contact_number_5;
          }

        }
      }


    }
  }
  ionViewWillLeave() {
    //this.tabBarElement.style.display = 'flex';
  }
  ionViewDidLoad() {

    if (this.navParams.get("isEdited") == true) {
      this.geninfo(this.navParams.get("record"), this.navParams.get("accountInfo"));
      this.isEdited = this.navParams.get("record").unit_id;
    } else {
      this.isEdited = 0;
    }
    this.addmorebtn = 1;
    //this.tabBarElement.style.display = 'none';

    console.log('ionViewDidLoad NotificationSettingsPage');
    // Atmentioned API Calls
    // let
    //   //body: string = "key=delete&recordID=" + recordID,
    //   type: string = "application/x-www-form-urlencoded; charset=UTF-8",
    //   headers: any = new Headers({ 'Content-Type': type }),
    //   options: any = new RequestOptions({ headers: headers }),
    //   url: any = this.apiServiceURL + "/api/atmentionednew.php?method=atmention&act=unit&companyId=" + this.companyId + "&userId=" + this.userId;
    // console.log(url);
    // this.http.get(url, options)
    //   .subscribe(data => {
    //     // If the request was successful notify the user
    //     if (data.status === 200) {
    //       this.atmentioneddata = data.json();
    //       console.log(this.atmentioneddata);
         
    //     }


    //     // Otherwise let 'em know anyway
    //     else {
    //       this.conf.sendNotification('Something went wrong!');
    //     }
    //   }, error => {

    //   })

    let body: string = '',
    //body: string = "key=delete&recordID=" + recordID,
    type: string = "application/x-www-form-urlencoded; charset=UTF-8",
    headers: any = new Headers({ 'Content-Type': type }),
    options: any = new RequestOptions({ headers: headers }),
    url: any = this.apiServiceURL + "/alarmhashtags?companyid=" + this.companyId + "&login=" + this.userId;
  console.log(url);
  this.http.get(url, options)

  // let body: string = param,

  //   type: string = "application/x-www-form-urlencoded; charset=UTF-8",
  //   headers: any = new Headers({ 'Content-Type': type }),
  //   options: any = new RequestOptions({ headers: headers }),
  //   url: any = urlstring;
  console.log("Message sending API" + url + "?" + body);

  this.http.post(url, body, options)

    .subscribe(data => {
      let res;
      // If the request was successful notify the user
      if (data.status === 200) {
       // this.atmentioneddata = data.json();
        res = data.json();
        console.log(data.json().staffs);

        if (res.staffs.length > 0) {
          for (let staff in res.staffs) {
            this.atmentioneddata.push({
              username: res.staffs[staff].username,
              name: res.staffs[staff].name,
            });
          }
        }
        // Otherwise let 'em know anyway
      } else {
        this.conf.sendNotification('Something went wrong!');
      }
    }, error => {

    })
  console.log(JSON.stringify("Array Result:" + this.atmentioneddata));
  jQuery(".alarmhashtags").mention({
    users: this.atmentioneddata
  });
  
    // Atmentioned API Calls
  }
  getPrimaryContact(ev) {
    console.log(ev.target.value);
    let char = ev.target.value.toString();
    if (char.length > 5) {
      console.log('Reached five characters above');
      this.borderbottomredvalidation = 'border-bottom-invalid';
    } else {
      console.log('Reached five characters below');
      this.borderbottomredvalidation = 'border-bottom-valid';
    }
  }

  getPrimaryContact2(contact_name, secondary) {
    console.log("contact_name for 2" + contact_name);
    console.log("secondary" + secondary)
    let nme;
    if (contact_name == undefined) {
      console.log('A');
      nme = '';
    }
    if (contact_name == '') {
      console.log('B');
      nme = '';
    }
    let num;
    if (secondary == undefined) {
      num = '';
      console.log('C');
    }
    if (secondary == '') {
      console.log('D');
      num = '';
    }
    console.log(this.cont5);
    if (nme != '' && num != '') {
      console.log('E');
      this.isSubmitted = false;
    } else {
      console.log('F');
      this.isSubmitted = true;
    }
  }

  getPrimaryContact3(contact_name, secondary) {
    console.log("contact_name for 3" + contact_name);
    console.log("secondary" + secondary)
    let nme;
    if (contact_name == undefined) {
      console.log('A');
      nme = '';
    }
    if (contact_name == '') {
      console.log('B');
      nme = '';
    }
    let num;
    if (secondary == undefined) {
      num = '';
      console.log('C');
    }
    if (secondary == '') {
      console.log('D');
      num = '';
    }
    console.log(this.cont5);
    if (nme != '' && num != '') {
      console.log('E');
      this.isSubmitted = false;
    } else {
      console.log('F');
      this.isSubmitted = true;
    }
  }

  getPrimaryContact4(contact_name, secondary) {
    console.log("contact_name for 4" + contact_name);
    console.log("secondary" + secondary)
    let nme;
    if (contact_name == undefined) {
      console.log('A');
      nme = '';
    }
    if (contact_name == '') {
      console.log('B');
      nme = '';
    }
    let num;
    if (secondary == undefined) {
      num = '';
      console.log('C');
    }
    if (secondary == '') {
      console.log('D');
      num = '';
    }
    console.log(this.cont5);
    if (nme != '' && num != '') {
      console.log('E');
      this.isSubmitted = false;
    } else {
      console.log('F');
      this.isSubmitted = true;
    }
  }


  getPrimaryContact5(contact_name, secondary) {
    console.log("contact_name for 5" + contact_name);
    console.log("secondary" + secondary)
    let nme;
    if (contact_name == undefined) {
      console.log('A');
      nme = '';
    }
    if (contact_name == '') {
      console.log('B');
      nme = '';
    }
    let num;
    if (secondary == undefined) {
      num = '';
      console.log('C');
    }
    if (secondary == '') {
      console.log('D');
      num = '';
    }
    console.log(this.cont5);
    if (nme != '' && num != '') {
      console.log('E');
      this.isSubmitted = false;
    } else {
      console.log('F');
      this.isSubmitted = true;
    }
  }
  doRemoveContact(val, contactArr) {
    console.log(contactArr.contacts);//Name1|+90 1#Name2|+91 2#Name3|+92 3#Name4|+93 4#Name5|+94 5




    let confirm = this.alertCtrl.create({
      message: 'Are you sure you want to delete this contact ' + val + '?',
      buttons: [{
        text: 'Yes',
        handler: () => {
          console.log("Remove 5 calling");
          if (val == 2) {
            this.cont2 = false;
            this.contact_name_2 = '';
            this.contact_number_2 = '';
            //this.primary_2 = '';
          }
          if (val == 3) {
            this.cont3 = false;
            this.contact_name_3 = '';
            this.contact_number_3 = '';
            // this.primary_3 = '';
          }
          if (val == 4) {
            this.cont4 = false;
            this.contact_name_4 = '';
            this.contact_number_4 = '';
            // this.primary_4 = '';
          }
          if (val == 5) {
            this.cont5 = false;
            this.contact_name_5 = '';
            this.contact_number_5 = '';
            // this.primary_5 = '';
          }
        }
      },
      {
        text: 'No',
        handler: () => { }
      }]
    });
    confirm.present();
  }
  saveEntry() {
    // this.alarmhashtags = jQuery('#alarmhashtags').tagEditor('getTags')[0].tags;
    // console.log(this.alarmhashtags);
    // if (this.alarmhashtags.length == 0) {
    //   this.conf.sendNotification(`Notification list detail required`);
    //   return false;
    // }
    this.timezone = '2017-12-14 12:28:AM';
    let
      // primary: string = this.form.controls["primary"].value,
      secondary: string = this.form.controls["contact_number_1"].value;

    // if (this.form.controls["primary"].value == undefined) {
    //  // primary = '';
    // }
    // if (this.form.controls["primary"].value == 'undefined') {
    //   //primary = '';
    // }
    // if (this.form.controls["primary"].value == 'null') {
    //   ///primary = '';
    // }
    // if (this.form.controls["primary"].value == null) {
    //   //primary = '';
    // }

    if (this.form.controls["contact_number_1"].value == undefined) {
      secondary = ''
    }
    if (this.form.controls["contact_number_1"].value == 'undefined') {
      secondary = '';
    }
    if (this.form.controls["contact_number_1"].value == 'null') {
      secondary = '';
    }
    if (this.form.controls["contact_number_1"].value == null) {
      secondary = '';
    }

    // let contact = primary + " " + secondary;
    let contact = secondary;
    console.log(contact);
    contact = contact.replace("+", "%2B");
    if (this.form.controls["contact_name_1"].value != '') {
      this.contactInfo.push({
        contact_name: this.form.controls["contact_name_1"].value,
        contact_number: contact
      });
    }

    if (this.cont2 = true) {
      let cont2value;
      if (this.form.controls["contact_name_2"].value == undefined) {
        cont2value = '';
      }
      if (this.form.controls["contact_name_2"].value == 'undefined') {
        cont2value = '';
      }
      if (this.form.controls["contact_name_2"].value == 'null') {
        cont2value = '';
      }
      if (this.form.controls["contact_name_2"].value == null) {
        cont2value = '';
      }
      if (cont2value != '') {
        let contact;
        //  contact = this.form.controls["primary_2"].value + " " + this.form.controls["contact_number_2"].value;
        contact = this.form.controls["contact_number_2"].value;

        if (contact != undefined) {
          console.log(contact);
          contact = contact.replace("+", "%2B");
        }

        if (this.form.controls["contact_name_2"].value != '') {
          this.contactInfo.push({
            contact_name: this.form.controls["contact_name_2"].value,
            contact_number: contact
          });
        }
      }
    }
    if (this.cont3 = true) {
      let cont3value;
      if (this.form.controls["contact_name_3"].value == undefined) {
        cont3value = '';
      }
      if (this.form.controls["contact_name_3"].value == 'undefined') {
        cont3value = '';
      }
      if (this.form.controls["contact_name_3"].value == 'null') {
        cont3value = '';
      }
      if (this.form.controls["contact_name_3"].value == null) {
        cont3value = '';
      }
      if (cont3value != '') {
        let contact;
        // contact = this.form.controls["primary_3"].value + " " + this.form.controls["contact_number_3"].value;
        contact = this.form.controls["contact_number_3"].value;
        if (contact != undefined) {
          console.log(contact);
          contact = contact.replace("+", "%2B");
        }
        if (this.form.controls["contact_name_3"].value != '') {
          this.contactInfo.push({
            contact_name: this.form.controls["contact_name_3"].value,
            contact_number: contact
          });
        }
      }
    }
    if (this.cont4 = true) {
      let cont4value;
      if (this.form.controls["contact_name_4"].value == undefined) {
        cont4value = '';
      }
      if (this.form.controls["contact_name_4"].value == 'undefined') {
        cont4value = '';
      }
      if (this.form.controls["contact_name_4"].value == 'null') {
        cont4value = '';
      }
      if (this.form.controls["contact_name_4"].value == null) {
        cont4value = '';
      }
      if (cont4value != '') {
        let contact;
        // contact = this.form.controls["primary_4"].value + " " + this.form.controls["contact_number_4"].value;
        contact = this.form.controls["contact_number_4"].value;
        if (contact != undefined) {
          console.log(contact);
          contact = contact.replace("+", "%2B");
        }
        if (this.form.controls["contact_name_4"].value != '') {
          this.contactInfo.push({
            contact_name: this.form.controls["contact_name_4"].value,
            contact_number: contact
          });
        }
      }
    }
    if (this.cont5 = true) {
      let cont5value;
      if (this.form.controls["contact_name_5"].value == undefined) {
        cont5value = '';
      }
      if (this.form.controls["contact_name_5"].value == 'undefined') {
        cont5value = '';
      }
      if (this.form.controls["contact_name_5"].value == 'null') {
        cont5value = '';
      }
      if (this.form.controls["contact_name_5"].value == null) {
        cont5value = '';
      }
      if (cont5value != '') {
        let contact;
        //contact = this.form.controls["primary_5"].value + " " + this.form.controls["contact_number_5"].value;
        contact = this.form.controls["contact_number_5"].value;
        if (contact != undefined) {
          console.log(contact);
          contact = contact.replace("+", "%2B");
        }
        if (this.form.controls["contact_name_5"].value != '') {
          this.contactInfo.push({
            contact_name: this.form.controls["contact_name_5"].value,
            contact_number: contact
          });
        }
      }
    }
    if (this.latitude == 'undefined' && this.longitude == 'undefined') {
      this.latitude = '';
      this.longitude = '';
    }
    if (this.latitude == undefined && this.longitude == undefined) {
      this.latitude = '';
      this.longitude = '';
    }
    // if (localStorage.getItem("atMentionResult") != '') {
    //   this.alarmhashtags = localStorage.getItem("atMentionResult");
    // }

    this.alarmhashtags = jQuery(".alarmhashtags").val();
    console.log("#to value" + jQuery("#to").val());
    console.log(this.isEdited);
    if (this.isEdited > 0) {
      let body: string = "is_mobile=1&unit_id=" + this.isEdited +
        "&unitname=" + this.unitname +
        "&projectname=" + this.projectname +
        "&controllerid=" + this.controllerid +
        "&neaplateno=" + this.neaplateno +
        "&serial_number=" + this.serial_number +
        "&models_id=" + this.models_id +
        "&location=" + this.location +
        "&createdby=" + this.userId +
        "&updatedby=" + this.userId +
        "&longitude=" + this.longitude +
        "&latitude=" + this.latitude +
        "&contactInfo=" + JSON.stringify(this.contactInfo) +
        "&alarmnotificationto=" + this.alarmhashtags +
        "&timezone=" + this.timezone +
        "&companys_id=" + this.companys_id +
        "&unitgroups_id=" + this.unitgroups_id,

        type: string = "application/x-www-form-urlencoded; charset=UTF-8",
        headers: any = new Headers({ 'Content-Type': type }),
        options: any = new RequestOptions({ headers: headers }),
        url: any = this.apiServiceURL + "/units/update";
      console.log("URL:" + url + "?" + body);
      this.http.post(url, body, options)
        .subscribe((data) => {
          //console.log("Response Success:" + JSON.stringify(data.json()));
          // If the request was successful notify the user
          if (data.status === 200) {
            this.hideForm = true;
            localStorage.setItem("addUnitFormOneValue", "");
            this.conf.sendNotificationTimer(`Units was successfully updated`);
            if (this.navParams.get("from") == 'unitdetail') {
              this.navCtrl.setRoot(UnitdetailsPage, {
                record: this.navParams.get("record"),
                tabs: 'gensetView'
              });
            } else if (this.navParams.get("from") == 'dashboard') {

              this.navCtrl.setRoot(DashboardPage, { tabIndex: 0, tabs: 'listView' });
              // this.navCtrl.setRoot(DashboardPage, {
              //   record: this.navParams.get("record"),
              //   tabs: 'listView'
              // });
            } else {
              this.navCtrl.setRoot(UnitsPage);
            }

          }
          // Otherwise let 'em know anyway
          else {
            this.conf.sendNotification('Something went wrong!');
          }
        }, error => {
        });
    } else {
      let body: string = "is_mobile=1&unitname=" + this.unitname +
        "&projectname=" + this.projectname +
        "&controllerid=" + this.controllerid +
        "&neaplateno=" + this.neaplateno +
        "&serial_number=" + this.serial_number +
        "&models_id=" + this.models_id +
        "&location=" + this.location +
        "&createdby=" + this.userId +
        "&longitude=" + this.longitude +
        "&latitude=" + this.latitude +
        "&updatedby=" + this.userId +
        "&contactInfo=" + JSON.stringify(this.contactInfo) +
        "&alarmnotificationto=" + this.alarmhashtags +
        "&timezone=" + this.timezone +
        "&companys_id=" + this.companys_id +
        "&unitgroups_id=" + this.unitgroups_id,
        type: string = "application/x-www-form-urlencoded; charset=UTF-8",
        headers: any = new Headers({ 'Content-Type': type }),
        options: any = new RequestOptions({ headers: headers }),
        url: any = this.apiServiceURL + "/units/store";

      console.log("URL:" + url + "?" + body);
      this.http.post(url, body, options)
        .subscribe((data) => {
          //console.log("Response Success:" + JSON.stringify(data.json()));
          // If the request was successful notify the user
          if (data.status === 200) {
            this.hideForm = true;
            localStorage.setItem("addUnitFormOneValue", "");
            //this.conf.sendNotificationTimer(`Units created was successfully added`);
            this.conf.sendNotification(data.json().msg[0]['result']);
            this.navCtrl.setRoot(UnitsPage);
          }
          // Otherwise let 'em know anyway
          else {
            this.conf.sendNotification('Something went wrong!');
          }
        }, error => {
        });
    }


  }




  address1get(hashtag) {
    console.log(hashtag);
    this.gethashtag = hashtag;
  }

  addmore() {
    if (this.isEdited == 0) {
      //this.isSubmitted = true;
    }
    let len = this.contactnameArray.length;
    let incr;
    console.log("1" + len);
    if (len == 0) {
      len = 1;
    } else {
      console.log("2" + len);
      len = len + 1;
      //len = parseInt(incr) + parseInt(len);
    }
    if (len > 4) {
      console.log("3" + len);
      console.log('Contact details only five item')
      this.addmorebtn = 0;
    } else {
      console.log("4" + len);
      console.log("5" + len);
      incr = len + 1;
      console.log("6incr" + incr);
      this.contactnameArray.push({
        name: 'contact_name_' + incr,
        placeholder: "Name"
      });

      this.contactnumberArray.push({
        name: 'contact_number_' + incr,
        placeholder: "Number"
      });
    }
    console.log("7" + len);

    if (len == 1) {
      this.cont2 = true;
    }
    if (len == 2) {
      this.cont3 = true;
    }
    if (len == 3) {
      this.cont4 = true;
    }
    if (len == 4) {
      this.cont5 = true;
    }

    // if (this.cont2 == true) {
    //   this.needcontact2valid = true;
    // } else {
    //   this.needcontact2valid = false;
    // }



  }


  previous() {
    if (this.isEdited > 0) {
      this.navCtrl.setRoot(AddUnitPage, {
        accountInfo: this.navParams.get("accountInfo"),
        record: this.navParams.get("record"),
        from: this.navParams.get("from"),
        isEdited: this.isEdited,
        unitId: this.navParams.get("record").unit_id
      });
      this.isEdited = true;
    } else {
      this.navCtrl.setRoot(AddUnitPage, {
        accountInfo: this.navParams.get("accountInfo"),
        record: this.navParams.get("record"),
        from: this.navParams.get("from"),
        isEdited: this.isEdited
      });
      this.isEdited = false;
    }

  }
}
