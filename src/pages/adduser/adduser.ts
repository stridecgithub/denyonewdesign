import { Component, NgZone } from '@angular/core';
import { NavController, NavParams, ToastController, LoadingController, ActionSheetController, Platform } from 'ionic-angular';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { FileChooser } from '@ionic-native/file-chooser';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import 'rxjs/add/operator/map';
import { UserPage } from '../user/user';
//import { UnitgroupPage } from '../unitgroup/unitgroup';
//import { RolePage } from '../role/role';
//import { OrgchartPage } from '../orgchart/orgchart';
//import { MyaccountPage } from '../myaccount/myaccount';
//import { UnitsPage } from '../units/units';
import { NotificationPage } from '../notification/notification';
//import { ReportsPage } from '../reports/reports';
//import { CalendarPage } from '../calendar/calendar';
import { Config } from '../../config/config';
/**
 * Generated class for the AddcompanygroupPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-adduser',
  templateUrl: 'adduser.html',
  providers: [Camera, FileTransfer, File, Config, Camera, FileChooser]
})
export class AdduserPage {
  // Define FormBuilder /model properties
  public loginas: any;
 
  footerBar: number = 0;
  public form: FormGroup;
  public first_name: any;
  public last_name: any;
  public email: any;
  public photo: any;
  public country: any;
  public msgcount: any;
  public notcount: any;
  public borderbottomredvalidation: any;
  public contact: any;
  // public primary: any;
  public userId: any;
  public responseResultCountry: any;
  progress: number;
  public isProgress = false;
  public isUploaded: boolean = true;
  // Flag to be used for checking whether we are adding/editing an entry
  public isEdited: boolean = false;
  public readOnly: boolean = false;
  public useriddisabled: boolean = false;
  public userInfo = [];
  // Flag to hide the form upon successful completion of remote operation
  public hideForm: boolean = false;
  public hideActionButton = true;
  // Property to help ste the page title
  public pageTitle: string;
  // Property to store the recordID for when an existing entry is being edited
  public recordID: any = null;
  public isUploadedProcessing: boolean = false;
  public uploadResultBase64Data;
  private apiServiceURL: string = "http://denyoappv2.stridecdev.com";
  public addedImgLists = this.apiServiceURL + "/images/default.png";
  username;
  password;
  hashtag;
  role;
  job_position;
  company_group;
  report_to;
  re_password;
  len;
  naDisplay;
  roleId;
  public responseResultCompanyGroup: any;
  public responseResultReportTo: any;
  public responseResultRole = [];
  public responseResultRoleDropDown = [];
  companyId;
  constructor(private conf: Config, public nav: NavController,
    public http: Http,
    public NP: NavParams,
    public fb: FormBuilder,
    public toastCtrl: ToastController, public loadingCtrl: LoadingController, private camera: Camera

    , private transfer: FileTransfer,
    private ngZone: NgZone, public actionSheetCtrl: ActionSheetController,public platform:Platform) {

      this.platform.ready().then(() => {
        this.platform.registerBackButtonAction(() => {         
          this.nav.setRoot(UserPage);
        });
      });

    this.companyId = localStorage.getItem("userInfoCompanyId");
    this.loginas = localStorage.getItem("userInfoName");
    this.userId = localStorage.getItem("userInfoId");
    // Create form builder validation rules
    this.form = fb.group({
      //"first_name": ["", Validators.required],
      //"last_name": ["", Validators.required],
      "first_name": ["", Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
      "last_name": ["", Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
      "country": ["", Validators.required],
      "contact": ["", Validators.compose([Validators.pattern(/^[- +()]*[0-9][- +()0-9]*$/), Validators.required])],


      // ^[0-9\-\+\s\(\)]*$


      // "contact": ['', Validators.compose([Validators.required,Validators.pattern(/^\+(?:[0-9] ?){6,14}[0-9]$/)])],
      //"primary": ["", Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(5)])],
      /// "email": ["", Validators.required]
      'email': ['', Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(50), Validators.pattern(/^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i)])],

      "username": ["", Validators.compose([Validators.maxLength(30), Validators.required])],
      "password": ["", Validators.required],
      "re_password": ["", Validators.required],
      "hashtag": [""],
      "role": ["", Validators.required],
      "job_position": ["", Validators.required],
      "company_group": ["", Validators.required],
      "report_to": [""]
    }, { validator: this.matchingPasswords('password', 're_password') });
    this.userId = localStorage.getItem("userInfoId");
    this.roleId = localStorage.getItem("userInfoRoleId");
    this.getJsonCountryListData();
    this.getRole();
    this.getUserListData();
    this.getCompanyGroupListData();

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
    /*
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

*/
    // Footer Menu Access - End

  }

  matchingPasswords(passwordKey: string, passwordConfirmationKey: string) {
    this.conf.consolePrint('A');
    return (group: FormGroup) => {
      this.conf.consolePrint('B');
      let passwordInput = group.controls[passwordKey];
      let passwordConfirmationInput = group.controls[passwordConfirmationKey];
      if (passwordInput.value !== passwordConfirmationInput.value) {
        this.conf.consolePrint('C');
        return passwordConfirmationInput.setErrors({ notEquivalent: true })
      }
    }
  }
  ionViewDidLoad() {
    this.conf.consolePrint('ionViewDidLoad AddcompanygroupPage');
    this.pageLoad();

  }

  // Determine whether we adding or editing a record
  // based on any supplied navigation parameters
  ionViewWillEnter() {
    this.pageLoad();

  }
  getRole() {
    let type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + "/getroles?companyid=" + this.companyId;

    let res;
    this.http.get(url, options)
      .subscribe(data => {
        res = data.json();
        this.responseResultRole = res.roles;
        this.conf.consolePrint(JSON.stringify(this.responseResultRole));
        if (this.responseResultRole.length > 0) {
          for (let role in this.responseResultRole) {

            if (this.roleId == '1') {
              this.responseResultRoleDropDown.push({
                role_id: this.responseResultRole[role].role_id,
                role_name: this.responseResultRole[role].role_name
              });
            } else {
              if (this.responseResultRole[role].role_id != '1') {
                this.responseResultRoleDropDown.push({
                  role_id: this.responseResultRole[role].role_id,
                  role_name: this.responseResultRole[role].role_name
                });
              }

            }

          }
        }
      });
  }
  pageLoad() {
    //  let companyid = '';
    let //body: string = "loginid=" + this.userId,
      type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + "/msgnotifycount?loginid=" + this.userId;
    this.conf.consolePrint(url);
    // this.conf.consolePrint(body);

    this.http.get(url, options)
      .subscribe((data) => {
        this.conf.consolePrint("Count Response Success:" + JSON.stringify(data.json()));
        this.msgcount = data.json().msgcount;
        this.notcount = data.json().notifycount;
      });
    this.resetFields();

    this.conf.consolePrint(JSON.stringify(this.NP.get("record")));
    if (this.NP.get("record")) {
      this.conf.consolePrint("Add User:" + JSON.stringify(this.NP.get("record")));
      this.isEdited = true;
      this.selectEntry(this.NP.get("record"));
      this.pageTitle = 'Edit User';
      this.readOnly = false;
      this.hideActionButton = true;
      if (this.NP.get("record").photo) {
        if (this.NP.get("record").photo != 'undefined') {
          this.addedImgLists = this.apiServiceURL + "/staffphotos/" + this.NP.get("record").photo;
          this.conf.consolePrint(this.addedImgLists);
        }
      }
      let editItem = this.NP.get("record");
      this.first_name = editItem.firstname;
      this.last_name = editItem.lastname;
      this.email = editItem.email;
      this.country = editItem.country_id;
      this.contact = editItem.contact_number;
      this.username = editItem.username;
      if (this.contact != undefined) {
        //let contactSplitSpace = this.contact.split(" ");
        // this.primary = contactSplitSpace[0];
        // this.contact = contactSplitSpace[1];
        this.contact = this.contact;
      }
      this.useriddisabled = true;
    }
    else {
      this.useriddisabled = false;
      this.isEdited = false;
      this.pageTitle = 'New User';
    }
    if (this.NP.get("uservalue")) {
      let info = this.NP.get("uservalue");
      this.pageTitle = 'Edit User';
      //var objects = JSON.parse(info);
      this.conf.consolePrint("JSON.stringify:" + JSON.stringify(info));
      this.conf.consolePrint("Length:" + info.length);
      this.conf.consolePrint('A');
      for (var key in info) {
        this.conf.consolePrint('B');
        let keyindex;
        if (this.NP.get("record")) {
          keyindex = 0;
        } else {
          keyindex = 1;
        }
        this.conf.consolePrint("Key:" + key);
        this.conf.consolePrint("Key Index:" + keyindex);
        if (key == keyindex) {
          this.conf.consolePrint('Key' + key);
          this.first_name = info[key].first_name;
          this.last_name = info[key].last_name;
          this.email = info[key].email;
          this.country = info[key].country;
          this.contact = info[key].contact;
          this.photo = info[key].photo;
          if (this.contact != '') {
            // let contactSplitSpace = this.contact.split(" ");
            // this.primary = contactSplitSpace[0];
            //this.contact = contactSplitSpace[1];
            this.contact = this.contact;
          }

          this.conf.consolePrint("First Name for User Account:" + this.first_name);
          //this.conf.consolePrint(JSON.stringify(this));
        } else {
          this.conf.consolePrint('Key' + key);
          this.first_name = info[0].first_name;
          this.last_name = info[0].last_name;
          this.email = info[0].email;
          this.country = info[0].country;
          this.contact = info[0].contact;
          this.photo = info[0].photo;

          if (this.contact != '') {
            //let contactSplitSpace = this.contact.split(" ");
            //this.primary = contactSplitSpace[0];
            //this.contact = contactSplitSpace[1];
            this.contact = this.contact;
          }


          this.conf.consolePrint("First Name for User Account:" + this.first_name);
        }
        /* this.userInfo.push({
           info
         });
         this.conf.consolePrint("User Information:" + JSON.stringify(this.userInfo));
         */
      }

      if (this.NP.get("uservalue")[0].photo) {
        if (this.NP.get("uservalue")[0].photo != 'undefined') {
          this.addedImgLists = this.apiServiceURL + "/staffphotos/" + this.NP.get("uservalue")[0].photo;
          this.conf.consolePrint(this.addedImgLists);
        }
      }
    }
    /*this.first_name = "Kannan";
    this.last_name = "Nagarathinam";
    this.email = "kannanrathvalli@gmail.com";
    this.country = "238";
    this.contact = "9443976954";*/
  }

  getPrimaryContact(ev) {
    this.conf.consolePrint(ev.target.value);
    let char = ev.target.value.toString();
    if (char.length > 5) {
      this.conf.consolePrint('Reached five characters above');
      this.borderbottomredvalidation = 'border-bottom-validtion';
    } else {
      this.conf.consolePrint('Reached five characters below');
      this.borderbottomredvalidation = '';
    }
  }

  // Assign the navigation retrieved data to properties
  // used as models on the page's HTML form
  selectEntry(item) {
    this.first_name = item.first_name;
    this.last_name = item.last_name;
    this.email = item.email;
    this.country = item.country;
    this.contact = item.contact_number;
    this.conf.consolePrint("Contact Number" + item.contact_number);
    // if (this.contact != '') {
    //   let contactSplitSpace = this.contact.split(" ");
    //   this.primary = contactSplitSpace[0];
    //   this.contact = contactSplitSpace[1];
    // }


    this.photo = item.photo;
    localStorage.setItem("photofromgallery", this.photo);
    this.recordID = item.staff_id;
    this.conf.consolePrint(this.recordID);

    this.username = item.username;
    this.password = item.password;
    this.re_password = item.password;
    this.hashtag = item.personalhashtag;
    this.role = item.role_id;
    this.job_position = item.job_position;
    this.company_group = item.company_id;
    this.conf.consolePrint(this.company_group);
    this.conf.consolePrint(item.report_to);
    this.report_to = item.report_to;
    this.getUserListData();

  }



  // Save a new record that has been added to the page's HTML form
  // Use angular's http post method to submit the record data
  // to our remote PHP script (note the body variable we have created which
  // supplies a variable of key with a value of create followed by the key/value pairs
  // for the record data
  createEntry(first_name, last_name, email, country, contact, createdby, role, username, password, hashtag, report_to, company_group, job_position) {



    let body1: string = "username=" + username + "&id=0",
      type1: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers1: any = new Headers({ 'Content-Type': type1 }),
      options1: any = new RequestOptions({ headers: headers1 }),
      url1: any = this.apiServiceURL + "/checkusername";

    this.http.post(url1, body1, options1)
      .subscribe((data) => {
        this.conf.consolePrint(JSON.stringify(data.json()));
        // If the request was successful notify the user
        if (data.status === 200) {
          this.conf.consolePrint("create" + data.json().msg[0].Error);
          this.conf.consolePrint('1');
          if (data.json().msg[0].Error > 0) {
            this.sendNotification(data.json().msg[0].result);
            return false;
          } else {
            this.sendNotification(data.json().message);
            this.conf.consolePrint("create" + data.json().msg[0].Error);
            this.conf.consolePrint('2');
            let uploadfromgallery = localStorage.getItem("photofromgallery");

            if (uploadfromgallery != undefined) {
              this.conf.consolePrint('A');
              this.photo = uploadfromgallery;
            }
            if (this.photo == undefined) {
              this.conf.consolePrint('B');
              this.photo = '';
            }
            if (this.photo == 'undefined') {
              this.conf.consolePrint('C');
              this.photo = '';
            }
            if (this.photo == '') {
              this.conf.consolePrint('D');
              this.photo = '';
            }
            contact = contact.replace("+", "%2B");
            let body: string = "is_mobile=1&firstname=" + this.first_name +
              "&lastname=" + this.last_name +
              "&photo=" + this.photo +
              "&email=" + this.email +
              "&country_id=" + this.country +
              "&contact_number=" + contact +
              "&createdby=" + createdby +
              "&updatedby=" + createdby +
              "&username=" + username +
              "&password=" + password +
              "&role_id=" + role +
              "&personalhashtag=" + hashtag +
              "&report_to=" + report_to +
              "&company_id=" + company_group +
              "&job_position=" + job_position,
              type: string = "application/x-www-form-urlencoded; charset=UTF-8",
              headers: any = new Headers({ 'Content-Type': type }),
              options: any = new RequestOptions({ headers: headers }),
              url: any = this.apiServiceURL + "/staff/store";
            this.conf.consolePrint(url);
            this.conf.consolePrint(body);

            this.http.post(url, body, options)
              .subscribe((data) => {
                this.conf.consolePrint("Response Success:" + JSON.stringify(data.json()));
                // If the request was successful notify the user
                if (data.status === 200) {
                  this.hideForm = true;
                  // this.sendNotification(`User created was successfully added`);
                  this.sendNotification(data.json().msg[0].result);
                  localStorage.setItem("userPhotoFile", "");
                  localStorage.setItem("photofromgallery", "");
                  this.nav.setRoot(UserPage);
                }
                // Otherwise let 'em know anyway
                else {
                  this.sendNotification('Something went wrong!');
                }
              });
          }
        }
        // Otherwise let 'em know anyway
        else {
          this.sendNotification('Something went wrong!');
        }
      });




  }





  // Update an existing record that has been edited in the page's HTML form
  // Use angular's http post method to submit the record data
  // to our remote PHP script (note the body variable we have created which
  // supplies a variable of key with a value of update followed by the key/value pairs
  // for the record data
  updateEntry(first_name, last_name, email, country, contact, createdby, role, username, password, hashtag, report_to, company_group, job_position) {

    contact = contact.replace("+", "%2B");


    let uploadfromgallery = localStorage.getItem("photofromgallery");

    if (uploadfromgallery != undefined) {
      this.conf.consolePrint('A');
      this.photo = uploadfromgallery;
    }
    if (this.photo == undefined) {
      this.conf.consolePrint('B');
      this.photo = '';
    }
    if (this.photo == 'undefined') {
      this.conf.consolePrint('C');
      this.photo = '';
    }
    if (this.photo == '') {
      this.conf.consolePrint('D');
      this.photo = '';
    }


    let body1: string = "username=" + username + "&id=" + this.recordID,
      type1: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers1: any = new Headers({ 'Content-Type': type1 }),
      options1: any = new RequestOptions({ headers: headers1 }),
      url1: any = this.apiServiceURL + "/checkusername";
    this.http.post(url1, body1, options1)
      .subscribe((data) => {
        this.conf.consolePrint(JSON.stringify(data.json()));
        // If the request was successful notify the user
        if (data.status === 200) {
          this.conf.consolePrint("update" + data.json().msg[0].Error);
          if (data.json().msg[0].Error > 0) {
            //this.userInfo=[];
            this.sendNotification(data.json().msg[0].result);
            return false;
          } else {

            let body: string = "is_mobile=1&staff_id=" + this.recordID +
              "&firstname=" + this.first_name +
              "&lastname=" + this.last_name +
              "&photo=" + this.photo +
              "&email=" + this.email +
              "&country_id=" + this.country +
              "&contact_number=" + contact +
              "&createdby=" + createdby +
              "&updatedby=" + createdby +
              "&username=" + username +
              "&password=" + password +
              "&role_id=" + role +
              "&personalhashtag=" + hashtag +
              "&report_to=" + report_to +
              "&company_id=" + company_group +
              "&job_position=" + job_position,

              type: string = "application/x-www-form-urlencoded; charset=UTF-8",
              headers: any = new Headers({ 'Content-Type': type }),
              options: any = new RequestOptions({ headers: headers }),
              url: any = this.apiServiceURL + "/staff/update";
            this.conf.consolePrint(url);
            this.conf.consolePrint(body);
            this.http.post(url, body, options)
              .subscribe(data => {
                this.conf.consolePrint(data);
                // If the request was successful notify the user
                if (data.status === 200) {
                  this.hideForm = true;
                  localStorage.setItem("userPhotoFile", "");
                  localStorage.setItem("photofromgallery", "");
                  // this.sendNotification(`User updated was successfully updated`);
                  this.sendNotification(data.json().msg[0].result);
                  this.nav.setRoot(UserPage);
                }
                // Otherwise let 'em know anyway
                else {
                  this.sendNotification('Something went wrong!');
                }
              });
            this.sendNotification(data.json().message);

          }
        }

        // Otherwise let 'em know anyway
        else {
          this.sendNotification('Something went wrong!');
        }
      });


  }



  // Remove an existing record that has been selected in the page's HTML form
  // Use angular's http post method to submit the record data
  // to our remote PHP script (note the body variable we have created which
  // supplies a variable of key with a value of delete followed by the key/value pairs
  // for the record ID we want to remove from the remote database
  deleteEntry() {
    let first_name: string = this.form.controls["first_name"].value,
      body: string = "key=delete&recordID=" + this.recordID,
      type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + "api/companygroup.php";

    this.http.post(url, body, options)
      .subscribe(data => {
        // If the request was successful notify the user
        if (data.status === 200) {
          this.hideForm = true;
          this.sendNotification(`Company group: ${first_name} was successfully deleted`);
        }
        // Otherwise let 'em know anyway
        else {
          this.sendNotification('Something went wrong!');
        }
      });
  }



  // Handle data submitted from the page's HTML form
  // Determine whether we are adding a new record or amending an
  // existing record
  saveEntry() {
    let first_name: string = this.form.controls["first_name"].value,
      last_name: string = this.form.controls["last_name"].value,
      email: string = this.form.controls["email"].value,
      country: string = this.form.controls["country"].value,
      contact: string = this.form.controls["contact"].value,
      // primary: string = this.form.controls["primary"].value,
      role: string = this.form.controls["role"].value,
      username: string = this.form.controls["username"].value,
      password: string = this.form.controls["password"].value,
      hashtag: string = this.form.controls["hashtag"].value,
      report_to: string = this.form.controls["report_to"].value,
      company_group: string = this.form.controls["company_group"].value,
      job_position: string = this.form.controls["job_position"].value;

    //contact = primary + " " + contact;
    contact = contact;
    this.conf.consolePrint(contact);
    /*if (this.addedImgLists) {
      this.isUploadedProcessing = true;
    }*/
    if (this.isUploadedProcessing == false) {
      if (this.isEdited) {
        this.updateEntry(first_name, last_name, email, country, contact, this.userId, role, username, password, hashtag, report_to, company_group, job_position);
      }
      else {
        this.createEntry(first_name, last_name, email, country, contact, this.userId, role, username, password, hashtag, report_to, company_group, job_position);
      }
    }
  }



  // Clear values in the page's HTML form fields
  resetFields(): void {
    this.first_name = "";
    this.last_name = "";
    this.email = "";
    this.country = "";
    this.contact = "";
  }




  // Manage notifying the user of the outcome
  // of remote operations
  sendNotification(message): void {
    let notification = this.toastCtrl.create({
      message: message,
      duration: 3000
    });
    notification.present();
  }

  getJsonCountryListData() {
    let type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + "/getCountries";
    let res;
    this.http.get(url, options)
      .subscribe(data => {
        res = data.json();
        this.responseResultCountry = res.countries;
      });

  }
  presentLoading(parm) {
    let loader;
    loader = this.loadingCtrl.create({
      content: "Please wait...",
      duration: 3000
    });
    if (parm > 0) {
      loader.present();
    } else {
      loader.dismiss();
    }
  }






  notification() {
    this.nav.setRoot(NotificationPage);
  }
  previous() {
    this.nav.setRoot(UserPage);
  }


  getCompanyGroupListData() {
    let type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      // url: any = this.apiServiceURL + "/getcompanies?loginid=" + this.userId+"comapnyid="+this.companyId;
      url: any = this.apiServiceURL + "/getcompanies?loginid=" + this.userId + "&pagename=";
    let res;
    this.http.get(url, options)
      .subscribe(data => {
        res = data.json();
        this.responseResultCompanyGroup = res.companies;
      }, error => {

      });

  }

  getUserListData() {
    if (this.isEdited == true) {
      // this.userId = this.recordID;
      let type: string = "application/x-www-form-urlencoded; charset=UTF-8",
        headers: any = new Headers({ 'Content-Type': type }),
        options: any = new RequestOptions({ headers: headers }),
        url: any = this.apiServiceURL + "/getstaffs?loginid=" + this.userId + "&company_id=" + this.company_group;
      let res;
      this.conf.consolePrint("Report To API:" + url)
      this.http.get(url, options)
        .subscribe(data => {
          res = data.json();
          this.conf.consolePrint(JSON.stringify(res));
          // this.responseResultReportTo="N/A";
          if (this.report_to == 0) {
            this.len = 0;
          }
          else {
            this.len = res.TotalCount;
          }
          this.conf.consolePrint("length" + res.TotalCount);
          this.naDisplay = 1;
          this.responseResultReportTo = res.staffslist;
        }, error => {

        });
    }
    else {
      let type: string = "application/x-www-form-urlencoded; charset=UTF-8",
        headers: any = new Headers({ 'Content-Type': type }),
        options: any = new RequestOptions({ headers: headers }),
        url: any = this.apiServiceURL + "/getstaffs?loginid=" + this.userId + "&company_id=" + this.company_group;
      let res;
      this.conf.consolePrint("Report To API:" + url)
      this.http.get(url, options)
        .subscribe(data => {
          res = data.json();
          // this.responseResultReportTo="N/A";
          this.len = res.TotalCount;
          this.conf.consolePrint("length" + res.TotalCount);
          this.naDisplay = 1;
          this.responseResultReportTo = res.staffslist;
        }, error => {

        });
    }

  }

  addhashtag(val) {
    this.hashtag = "@" + val;
  }

  onSegmentChanged() {
    this.conf.consolePrint("ID" + this.company_group);
    this.getUserListData();
  }
  fileChooser() {

    let actionSheet = this.actionSheetCtrl.create({
      title: '',
      buttons: [
        {
          text: 'From Gallery',
          icon: 'md-image',
          role: 'fromgallery',
          handler: () => {
            // var options = {
            //   quality: 25,
            //   destinationType: this.camera.DestinationType.FILE_URI,
            //   sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
            //   allowEdit: true,
            //   encodingType: this.camera.EncodingType.JPEG,
            //   saveToPhotoAlbum: true
            // };

            const options: CameraOptions = {
              quality: 100,
              destinationType: this.camera.DestinationType.FILE_URI,
              sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
              encodingType: this.camera.EncodingType.JPEG,
              mediaType: this.camera.MediaType.PICTURE,
              correctOrientation: true
            }

            this.camera.getPicture(options).then((imageURI) => {
              localStorage.setItem("receiptAttachPath", imageURI);
              localStorage.setItem("userPhotoFile", imageURI);
              this.conf.consolePrint(imageURI);
              this.fileTrans(imageURI);
              // this.addedAttachList = imageURI;

              //this.photo = imageURI;
              this.isUploadedProcessing = true;
              return false;
            }, (err) => {

            });
          }
        }, {
          text: 'From Camera',
          icon: 'md-camera',
          handler: () => {
            this.conf.consolePrint('Camera clicked');
            // const options: CameraOptions = {
            //   quality: 25,
            //   destinationType: this.camera.DestinationType.FILE_URI,
            //   sourceType: 1,
            //   targetWidth: 200,
            //   targetHeight: 200,
            //   saveToPhotoAlbum: true

            // };

            const options: CameraOptions = {
              quality: 100,
              destinationType: this.camera.DestinationType.FILE_URI,
              encodingType: this.camera.EncodingType.JPEG,
              mediaType: this.camera.MediaType.PICTURE,
              correctOrientation: true
            }

            this.camera.getPicture(options).then((uri) => {
              localStorage.setItem("userPhotoFile", uri);
              this.conf.consolePrint(uri);
              this.fileTrans(uri);
              //this.addedAttachList = uri;
              //this.photo = uri;
              this.isUploadedProcessing = true;
              return false;
            }, (err) => {
              // Handle error
              this.conf.sendNotification(err);
            });
          }
        }, {
          text: 'Cancel',
          icon: 'md-close',
          role: 'cancel',
          handler: () => {
            this.conf.consolePrint('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
    return false;
  }

  fileTrans(path) {
    let fileName = path.substr(path.lastIndexOf('/') + 1);
    const fileTransfer: FileTransferObject = this.transfer.create();
    let currentName = path.replace(/^.*[\\\/]/, '');
    this.photo = fileName;
    this.conf.consolePrint("currentName File Name is:" + currentName);
    this.conf.consolePrint("fileName File Name is:" + fileName);
    this.photo = fileName;
    /*var d = new Date(),
        n = d.getTime(),
        newFileName = n + ".jpg";*/

    let options: FileUploadOptions = {
      fileKey: 'file',
      fileName: fileName,
      headers: {},
      chunkedMode: false,
      mimeType: "text/plain",
    }

    //  http://127.0.0.1/ionic/upload_attach.php
    //http://amahr.stridecdev.com/getgpsvalue.php?key=create&lat=34&long=45
    // this.conf.sendNotification(`profile photo uploaded few minutes redirect to my account page. please wait`);
    fileTransfer.onProgress(this.onProgress);
    fileTransfer.upload(path, this.apiServiceURL + '/upload.php', options)
      .then((data) => {
        this.conf.consolePrint(JSON.stringify(data));
        localStorage.setItem("userPhotoFile", "");
        this.conf.consolePrint("UPLOAD SUCCESS:" + data.response);

        this.conf.consolePrint("File Name:" + JSON.parse(data.response).name);


        let successData = JSON.parse(data.response);
        this.userInfo.push({
          photo: successData
        });
        this.conf.consolePrint("Upload Success Push" + JSON.stringify(this.userInfo));

        this.conf.consolePrint("Upload Success File Name" + this.userInfo[0].photo.name);
        localStorage.setItem("photofromgallery", this.userInfo[0].photo.name);

        this.addedImgLists = this.apiServiceURL + "/staffphotos/" + this.userInfo[0].photo.name;

        //this.conf.sendNotification("User photo uploaded successfully");
        this.progress += 5;
        this.isProgress = false;

        this.isUploadedProcessing = false;
        //  return false;


        // Save in Backend and MysQL
        //this.uploadToServer(data.response);
        // Save in Backend and MysQL
        //  this.conf.sendNotification(`User profile successfully updated`);
        // this.nav.setRoot(MyaccountPage);

      }, (err) => {
        //loading.dismiss();
        this.conf.consolePrint("Upload Error:");
        this.conf.sendNotification("Upload Error:" + JSON.stringify(err));
      })
  }
  onProgress = (progressEvent: ProgressEvent): void => {
    this.ngZone.run(() => {
      if (progressEvent.lengthComputable) {
        let progress = Math.round((progressEvent.loaded / progressEvent.total) * 95);
        this.isProgress = true;
        this.progress = progress;
      }
    });
  }
}
