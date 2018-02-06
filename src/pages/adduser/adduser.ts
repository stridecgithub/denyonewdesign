import { Component, NgZone } from '@angular/core';
import { NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { FileChooser } from '@ionic-native/file-chooser';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import 'rxjs/add/operator/map';
import { UserPage } from '../user/user';
import { UnitgroupPage } from '../unitgroup/unitgroup';
import { RolePage } from '../role/role';
import { OrgchartPage} from '../orgchart/orgchart';
import { MyaccountPage } from '../myaccount/myaccount';
import { UnitsPage } from '../units/units';
import { NotificationPage } from '../notification/notification';
import { ReportsPage } from '../reports/reports';
import { CalendarPage } from '../calendar/calendar';
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
  public primary: any;
  public userId: any;
  public responseResultCountry: any;
  progress: number;
  public isProgress = false;
  public isUploaded: boolean = true;
  // Flag to be used for checking whether we are adding/editing an entry
  public isEdited: boolean = false;
  public readOnly: boolean = false;
  public addedImgLists: any;
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
  constructor(public nav: NavController,
    public http: Http,
    public NP: NavParams,
    public fb: FormBuilder,
    public toastCtrl: ToastController, public loadingCtrl: LoadingController, private camera: Camera

    , private transfer: FileTransfer,
    private ngZone: NgZone) {
    this.loginas = localStorage.getItem("userInfoName");
    // Create form builder validation rules
    this.form = fb.group({
      //"first_name": ["", Validators.required],
      //"last_name": ["", Validators.required],
      "first_name": ["", Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
      "last_name": ["", Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
      "country": ["", Validators.required],
      "contact": ["", Validators.required],
      "primary": ["", Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(5)])],
      /// "email": ["", Validators.required]
      'email': ['', Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(50), Validators.pattern(/^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i)])],
    });
    this.userId = localStorage.getItem("userInfoId");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddcompanygroupPage');
    this.pageLoad();

  }

  // Determine whether we adding or editing a record
  // based on any supplied navigation parameters
  ionViewWillEnter() {
    this.pageLoad();
  
  }
  pageLoad()
  {
      let //body: string = "loginid=" + this.userId,
      type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + "/msgnotifycount?loginid=" + this.userId;
    console.log(url);
    // console.log(body);

    this.http.get(url, options)
      .subscribe((data) => {
        console.log("Count Response Success:" + JSON.stringify(data.json()));
        this.msgcount = data.json().msgcount;
        this.notcount = data.json().notifycount;
      });
    this.resetFields();
    this.getJsonCountryListData();
    console.log(JSON.stringify(this.NP.get("record")));
    if (this.NP.get("record")) {
      console.log("Add User:" + JSON.stringify(this.NP.get("record")));
      this.isEdited = true;
      this.selectEntry(this.NP.get("record"));
      this.pageTitle = 'Edit User';
      this.readOnly = false;
      this.hideActionButton = true;
      if (this.NP.get("record").photo) {
        if (this.NP.get("record").photo != 'undefined') {
          this.addedImgLists = this.apiServiceURL + "/staffphotos/" + this.NP.get("record").photo;
          console.log(this.addedImgLists);
        }
      }
      let editItem = this.NP.get("record");
      this.first_name = editItem.firstname;
      this.last_name = editItem.lastname;
      this.email = editItem.email;
      this.country = editItem.country_id;
      this.contact = editItem.contact_number;
      if (this.contact != undefined) {
        let contactSplitSpace = this.contact.split(" ");
        this.primary = contactSplitSpace[0];
        this.contact = contactSplitSpace[1];
      }

    }
    else {
      this.isEdited = false;
      this.pageTitle = 'New User';
    }
    if (this.NP.get("uservalue")) {
      let info = this.NP.get("uservalue");
      this.pageTitle = 'Edit User';
      //var objects = JSON.parse(info);
      console.log("JSON.stringify:" + JSON.stringify(info));
      console.log("Length:" + info.length);
      console.log('A');
      for (var key in info) {
        console.log('B');
        let keyindex;
        if (this.NP.get("record")) {
          keyindex = 0;
        } else {
          keyindex = 1;
        }
        console.log("Key:" + key);
        console.log("Key Index:" + keyindex);
        if (key == keyindex) {
          console.log('Key' + key);
          this.first_name = info[key].first_name;
          this.last_name = info[key].last_name;
          this.email = info[key].email;
          this.country = info[key].country;
          this.contact = info[key].contact;
          this.photo = info[key].photo;
          if (this.contact != '') {
            let contactSplitSpace = this.contact.split(" ");
            this.primary = contactSplitSpace[0];
            this.contact = contactSplitSpace[1];
          }

          console.log("First Name for User Account:" + this.first_name);
          //console.log(JSON.stringify(this));
        } else {
          console.log('Key' + key);
          this.first_name = info[0].first_name;
          this.last_name = info[0].last_name;
          this.email = info[0].email;
          this.country = info[0].country;
          this.contact = info[0].contact;
          this.photo = info[0].photo;

          if (this.contact != '') {
            let contactSplitSpace = this.contact.split(" ");
            this.primary = contactSplitSpace[0];
            this.contact = contactSplitSpace[1];
          }


          console.log("First Name for User Account:" + this.first_name);
        }
        /* this.userInfo.push({
           info
         });
         console.log("User Information:" + JSON.stringify(this.userInfo));
         */
      }
     
      if (this.NP.get("uservalue")[0].photo) {
        if (this.NP.get("uservalue")[0].photo != 'undefined') {
          this.addedImgLists = this.apiServiceURL + "/staffphotos/" + this.NP.get("uservalue")[0].photo;
          console.log(this.addedImgLists);
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
    console.log(ev.target.value);
    let char = ev.target.value.toString();
    if (char.length > 5) {
      console.log('Reached five characters above');
      this.borderbottomredvalidation = 'border-bottom-validtion';
    } else {
      console.log('Reached five characters below');
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
    console.log("Contact Number" + item.contact_number);
    if (this.contact != '') {
      let contactSplitSpace = this.contact.split(" ");
      this.primary = contactSplitSpace[0];
      this.contact = contactSplitSpace[1];
    }


    this.photo = item.photo;
    this.recordID = item.userid;
  }



  // Save a new record that has been added to the page's HTML form
  // Use angular's http post method to submit the record data
  // to our remote PHP script (note the body variable we have created which
  // supplies a variable of key with a value of create followed by the key/value pairs
  // for the record data
  createEntry(first_name, last_name, email, country, contact, createdby) {
    this.userInfo.push({
      photo: this.photo,
      first_name: first_name,
      last_name: last_name,
      email: email,
      country: country,
      contact: contact,
      createdby: createdby,

    });
    // this.nav.setRoot(UseraccountPage, {
    //   accountInfo: this.userInfo
    // });
    /*
        let body: string = "key=emailexist&email=" + email,
          type: string = "application/x-www-form-urlencoded; charset=UTF-8",
          headers: any = new Headers({ 'Content-Type': type }),
          options: any = new RequestOptions({ headers: headers }),
          url: any = this.apiServiceURL + "api/users.php";
    
        this.http.post(url, body, options)
          .subscribe((data) => {
            console.log(JSON.stringify(data.json()));
            // If the request was successful notify the user
            if (data.status === 200) {
              this.hideForm = true;
              console.log(data.json().Error);
              if (data.json().Error > 0) {
                this.userInfo = []; // need this one
                this.sendNotification(data.json().message);
              } else {
                //this.sendNotification(data.json().message);
                this.nav.setRoot(UseraccountPage, {
                  accountInfo: this.userInfo
                });
              }
            }
            // Otherwise let 'em know anyway
            else {
              this.sendNotification('Something went wrong!');
            }
          });
    */

  }



  // Update an existing record that has been edited in the page's HTML form
  // Use angular's http post method to submit the record data
  // to our remote PHP script (note the body variable we have created which
  // supplies a variable of key with a value of update followed by the key/value pairs
  // for the record data
  updateEntry(first_name, last_name, email, country, contact, createdby) {
    this.userInfo.push({
      photo: this.photo,
      first_name: first_name,
      last_name: last_name,
      email: email,
      country: country,
      contact: contact,
      createdby: createdby,

    });
    // this.nav.setRoot(UseraccountPage, {
    //   accountInfo: this.userInfo,
    //   record: this.NP.get("record")
    // });
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
          this.sendNotification(`Congratulations the company group: ${first_name} was successfully deleted`);
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
      primary: string = this.form.controls["primary"].value;

    contact = primary + " " + contact;
    console.log(contact);
    /*if (this.addedImgLists) {
      this.isUploadedProcessing = true;
    }*/
    if (this.isUploadedProcessing == false) {
      if (this.isEdited) {
        this.updateEntry(first_name, last_name, email, country, contact, this.userId);
      }
      else {
        this.createEntry(first_name, last_name, email, country, contact, this.userId);
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
  doUploadPhoto() {

    const options: CameraOptions = {
      quality: 75,
      destinationType: this.camera.DestinationType.FILE_URI,
      targetWidth: 200,
      targetHeight: 200,
      sourceType: 1
    }
    this.camera.getPicture(options).then((imageData) => {
      console.log(imageData);
      localStorage.setItem("userPhotoFile", imageData);
      //this.fileTrans(imageData);

      this.uploadResultBase64Data = imageData;
      this.addedImgLists = imageData;
      this.isUploadedProcessing = false;
      return false;
    }, (err) => {
      // Handle error
      this.sendNotification(err);
    });

  }

  fileTrans(path) {
    let fileName = path.substr(path.lastIndexOf('/') + 1);
    const fileTransfer: FileTransferObject = this.transfer.create();
    let currentName = path.replace(/^.*[\\\/]/, '');
    this.photo = currentName;
    console.log("File Name is:" + currentName);


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
    fileTransfer.onProgress(this.onProgress);
    fileTransfer.upload(path, this.apiServiceURL + '/upload.php', options)
      .then((data) => {
        console.log(JSON.stringify(data));
        console.log("UPLOAD SUCCESS:" + data.response);
        let successData = JSON.parse(data.response);
        this.userInfo.push({
          photo: successData
        });
        this.sendNotification("User photo uploaded successfully");
        this.progress += 5;
        this.isProgress = false;
        this.isUploadedProcessing = false;
        return false;



        // Save in Backend and MysQL
        //this.uploadToServer(data.response);
        // Save in Backend and MysQL
      }, (err) => {
        //loading.dismiss();
        console.log("Upload Error:");
        this.sendNotification("Upload Error:" + JSON.stringify(err));
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



  notification() {
    this.nav.setRoot(NotificationPage);
  }
  previous() {
    this.nav.setRoot(UserPage);
  }

  

}
