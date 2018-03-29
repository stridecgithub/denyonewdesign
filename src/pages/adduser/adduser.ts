import { Component, NgZone } from '@angular/core';
import { NavController, NavParams, ToastController, LoadingController, ActionSheetController, Platform,App } from 'ionic-angular';
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
  private apiServiceURL: string = "";
  public addedImgLists;
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
  constructor(private app:App,private conf: Config, public nav: NavController,
    public http: Http,
    public NP: NavParams,
    public fb: FormBuilder,
    public toastCtrl: ToastController, public loadingCtrl: LoadingController, private camera: Camera

    , private transfer: FileTransfer,
    private ngZone: NgZone, public actionSheetCtrl: ActionSheetController, public platform: Platform) {
    this.apiServiceURL = this.conf.apiBaseURL();
    this.addedImgLists = this.apiServiceURL + "/images/default.png";
    this.platform.ready().then(() => {
      this.platform.registerBackButtonAction(() => {
        const overlayView = this.app._appRoot._overlayPortal._views[0];
        if (overlayView && overlayView.dismiss) {
          overlayView.dismiss();
        }
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



  }

  matchingPasswords(passwordKey: string, passwordConfirmationKey: string) {
    
    return (group: FormGroup) => {
     
      let passwordInput = group.controls[passwordKey];
      let passwordConfirmationInput = group.controls[passwordConfirmationKey];
      if (passwordInput.value !== passwordConfirmationInput.value) {
       
        return passwordConfirmationInput.setErrors({ notEquivalent: true })
      }
    }
  }
  ionViewDidLoad() {
   
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
   

    this.http.get(url, options)
      .subscribe((data) => {
       
        this.msgcount = data.json().msgcount;
        this.notcount = data.json().notifycount;
      });
    this.resetFields();

   
    if (this.NP.get("record")) {
     
      this.isEdited = true;
      this.selectEntry(this.NP.get("record"));
      this.pageTitle = 'Edit User';
      this.readOnly = false;
      this.hideActionButton = true;
      if (this.NP.get("record").photo) {
        if (this.NP.get("record").photo != 'undefined') {
          this.addedImgLists = this.apiServiceURL + "/staffphotos/" + this.NP.get("record").photo;
         
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
     
      for (var key in info) {
      
        let keyindex;
        if (this.NP.get("record")) {
          keyindex = 0;
        } else {
          keyindex = 1;
        }
       
        if (key == keyindex) {
        
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

         
        } else {
         
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


         
        }
       
      }

      if (this.NP.get("uservalue")[0].photo) {
        if (this.NP.get("uservalue")[0].photo != 'undefined') {
          this.addedImgLists = this.apiServiceURL + "/staffphotos/" + this.NP.get("uservalue")[0].photo;
          
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
    
    let char = ev.target.value.toString();
    if (char.length > 5) {
    
      this.borderbottomredvalidation = 'border-bottom-validtion';
    } else {
     
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
   


    this.photo = item.photo;
    localStorage.setItem("photofromgallery", this.photo);
    this.recordID = item.staff_id;
   

    this.username = item.username;
    this.password = item.password;
    this.re_password = item.password;
    this.hashtag = item.personalhashtag;
    this.role = item.role_id;
    this.job_position = item.job_position;
    this.company_group = item.company_id;
   
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
       
        if (data.status === 200) {
         
          if (data.json().msg[0].Error > 0) {
            this.sendNotification(data.json().msg[0].result);
            return false;
          } else {
            this.sendNotification(data.json().message);
           
            let uploadfromgallery = localStorage.getItem("photofromgallery");

            if (uploadfromgallery != undefined) {
             
              this.photo = uploadfromgallery;
            }
            if (this.photo == undefined) {
              
              this.photo = '';
            }
            if (this.photo == 'undefined') {
              
              this.photo = '';
            }
            if (this.photo == '') {
              
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
           

            this.http.post(url, body, options)
              .subscribe((data) => {
               
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
     
      this.photo = uploadfromgallery;
    }
    if (this.photo == undefined) {
     
      this.photo = '';
    }
    if (this.photo == 'undefined') {
     
      this.photo = '';
    }
    if (this.photo == '') {
     
      this.photo = '';
    }


    let body1: string = "username=" + username + "&id=" + this.recordID,
      type1: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers1: any = new Headers({ 'Content-Type': type1 }),
      options1: any = new RequestOptions({ headers: headers1 }),
      url1: any = this.apiServiceURL + "/checkusername";
    this.http.post(url1, body1, options1)
      .subscribe((data) => {
        
        // If the request was successful notify the user
        if (data.status === 200) {
          
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
          
            this.http.post(url, body, options)
              .subscribe(data => {
               
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
      
      this.http.get(url, options)
        .subscribe(data => {
          res = data.json();
         
          // this.responseResultReportTo="N/A";
          if (this.report_to == 0) {
            this.len = 0;
          }
          else {
            this.len = res.TotalCount;
          }
          
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
     
      this.http.get(url, options)
        .subscribe(data => {
          res = data.json();
          // this.responseResultReportTo="N/A";
          this.len = res.TotalCount;
         
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
         

            const options: CameraOptions = {
              quality: 100,
              destinationType: this.camera.DestinationType.FILE_URI,
              encodingType: this.camera.EncodingType.JPEG,
              mediaType: this.camera.MediaType.PICTURE,
              correctOrientation: true
            }

            this.camera.getPicture(options).then((uri) => {
              localStorage.setItem("userPhotoFile", uri);
             
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
   
    this.photo = fileName;
   
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

    fileTransfer.onProgress(this.onProgress);
    fileTransfer.upload(path, this.apiServiceURL + '/upload.php', options)
      .then((data) => {
        
        localStorage.setItem("userPhotoFile", "");
       

     


        let successData = JSON.parse(data.response);
        this.userInfo.push({
          photo: successData
        });
       
        localStorage.setItem("photofromgallery", this.userInfo[0].photo.name);

        this.addedImgLists = this.apiServiceURL + "/staffphotos/" + this.userInfo[0].photo.name;

        //this.conf.sendNotification("User photo uploaded successfully");
        this.progress += 5;
        this.isProgress = false;

        this.isUploadedProcessing = false;
        //  return false;


        

      }, (err) => {
        //loading.dismiss();
       
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
