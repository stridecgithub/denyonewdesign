import { Component, NgZone } from '@angular/core';
import { NavController, NavParams, ToastController, LoadingController, ActionSheetController } from 'ionic-angular';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Http, Headers, RequestOptions } from '@angular/http';

import { OrgchartPage } from '../orgchart/orgchart';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { FileChooser } from '@ionic-native/file-chooser';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
//import { MyaccountPage } from '../myaccount/myaccount';
//import { UnitsPage } from '../units/units';
import { NotificationPage } from '../notification/notification';
import 'rxjs/add/operator/map';
import { Config } from '../../config/config';
//import { DashboardPage } from '../dashboard/dashboard';
//import { TabsPage } from "../tabs/tabs";

/**
 * Generated class for the AddorgchartonePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-addorgchartone',
  templateUrl: 'addorgchartone.html',
  providers: [Camera, FileTransfer, Config, Camera, FileChooser]
})
export class AddorgchartonePage {
  public loginas: any;
  public form: FormGroup;
  public first_name: any;
  public last_name: any;
  public email: any;
  public photo: any;
  public country: any;
  public borderbottomredvalidation: any;
  public contact: any;
  //public primary: any;
  public userId: any;
  public responseResultCountry: any;
  progress: number;
  public isProgress = false;
  public isUploaded: boolean = true;
  // Flag to be used for checking whether we are adding/editing an entry
  public isEdited: boolean = false;
  public readOnly: boolean = false;
  public userInfo = [];
  public msgcount: any;
  public notcount: any;
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
  public responseResultCompanyGroup: any;
  public responseResultReportTo: any;
  public len;
  job_position;
  company_group;
  report_to;
  company_id;
  public addedImgLists = this.apiServiceURL + "/images/default.png";
  constructor(private conf: Config, public nav: NavController,
    public http: Http,
    public NP: NavParams,
    public fb: FormBuilder,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    private camera: Camera
    , private transfer: FileTransfer, private ngZone: NgZone, public actionSheetCtrl: ActionSheetController) {
    this.loginas = localStorage.getItem("userInfoName");
    // Create form builder validation rules
    this.form = fb.group({
      //"first_name": ["", Validators.required],
      //"last_name": ["", Validators.required],
      "first_name": ["", Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
      "last_name": ["", Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
      "country": ["", Validators.required],
      "contact": ["", Validators.required],
     // "primary": ["", Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(5)])],
      /// "email": ["", Validators.required]
      'email': ['', Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(50), Validators.pattern(/^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i)])],
      "job_position": ["", Validators.required],
      "company_group": ["", Validators.required],
      "report_to": [""]
    });
    this.userId = localStorage.getItem("userInfoId");
    this.company_id = localStorage.getItem("userInfoCompanyId");

    // this.getUserListData(this.company_id);


  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad AddorgchartonePage');
    this.pageLoad();
  }
  pageLoad() {
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
    this.getCompanyGroupListData();
    if (this.NP.get("record") != undefined) {
      this.isEdited = true;
      this.selectEntry(this.NP.get("record"));
      this.pageTitle = 'Edit Org Chart';
      this.readOnly = false;
      this.hideActionButton = true;
      if (this.NP.get("record").photo) {
        this.addedImgLists = this.apiServiceURL + "/staffphotos/" + this.NP.get("record").photo;
        console.log(this.addedImgLists);
      }
      let editItem = this.NP.get("record");
      this.first_name = editItem.firstname;
      this.last_name = editItem.lastname;
      this.email = editItem.email;
      this.country = editItem.country_id;
      this.contact = editItem.contact_number;
      console.log(this.contact);
      if (this.contact != undefined) {
       // let contactSplitSpace = this.contact.split(" ");
       // this.primary = contactSplitSpace[0];
        this.contact = this.contact ;
      }
      this.getUserListData(editItem.company_id);
    }
    else {
      this.isEdited = false;
      this.pageTitle = 'Add Org Chart';
    }


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
  selectEntry(item) {
    this.first_name = item.first_name;
    this.last_name = item.last_name;
    this.email = item.email;
    this.country = item.country;
    this.contact = item.contact;
    this.photo = item.photo;
    localStorage.setItem("photofromgallery", this.photo);
    this.recordID = item.staff_id;
    this.job_position = item.job_position;
    this.company_group = item.company_id;
    this.report_to = item.report_to;
  }
  resetFields(): void {
    this.first_name = "";
    this.last_name = "";
    this.email = "";
    this.country = "";
    this.contact = "";
  }
  createEntry(first_name, last_name, email, country, contact, createdby, job_position, company_group, report_to) {


    let uploadfromgallery = localStorage.getItem("photofromgallery");

    if (uploadfromgallery != undefined) {
      console.log('A');
      this.photo = uploadfromgallery;
    }
    if (this.photo == undefined) {
      console.log('B');
      this.photo = '';
    }
    if (this.photo == 'undefined') {
      console.log('C');
      this.photo = '';
    }
    if (this.photo == '') {
      console.log('D');
      this.photo = '';
    }
    contact = contact.replace("+", "%2B");
    let body: string = "is_mobile=1&firstname=" + this.first_name +
      "&lastname=" + this.last_name +
      "&photo=" + this.photo +
      "&email=" + this.email +
      "&country_id=" + this.country +
      "&contact_number=" + contact +
      "&createdby=" + this.userId +
      "&updatedby=" + this.userId +
      "&report_to=" + report_to +
      "&company_id=" + company_group +
      "&job_position=" + job_position,
      type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + "/orgchart/store";
    console.log(url);
    console.log(body);

    this.http.post(url, body, options)
      .subscribe((data) => {
        //console.log("Response Success:" + JSON.stringify(data.json()));
        // If the request was successful notify the user
        if (data.status === 200) {
          this.hideForm = true;
          this.sendNotification(data.json().msg[0].result);
          localStorage.setItem("userPhotoFile", "");
          localStorage.setItem("photofromgallery", "");
          this.nav.setRoot(OrgchartPage, { 'companyId': company_group });
        }
        // Otherwise let 'em know anyway
        else {
          this.sendNotification('Something went wrong!');
        }
      });
  }

  updateEntry(first_name, last_name, email, country, contact, createdby, job_position, company_group, report_to) {


    let uploadfromgallery = localStorage.getItem("photofromgallery");

    if (uploadfromgallery != undefined) {
      console.log('A');
      this.photo = uploadfromgallery;
    }
    if (this.photo == undefined) {
      console.log('B');
      this.photo = '';
    }
    if (this.photo == 'undefined') {
      console.log('C');
      this.photo = '';
    }
    if (this.photo == '') {
      console.log('D');
      this.photo = '';
    }
    contact = contact.replace("+", "%2B");
    let body: string = "is_mobile=1&staff_id=" + this.recordID +
      "&firstname=" + this.first_name +
      "&lastname=" + this.last_name +
      "&photo=" + this.photo +
      "&email=" + this.email +
      "&country_id=" + this.country +
      "&contact_number=" + contact +
      "&createdby=" + this.userId +
      "&updatedby=" + this.userId +
      "&report_to=" + report_to +
      "&company_id=" + company_group +
      "&job_position=" + job_position,

      type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + "/orgchart/update";
    console.log(url);
    console.log(body);
    this.http.post(url, body, options)
      .subscribe(data => {
        console.log(data);
        // If the request was successful notify the user
        if (data.status === 200) {
          this.hideForm = true;
          localStorage.setItem("userPhotoFile", "");
          localStorage.setItem("photofromgallery", "");
          this.sendNotification(data.json().msg[0].result);
          this.nav.setRoot(OrgchartPage, { 'companyId': company_group });
        }
        // Otherwise let 'em know anyway
        else {
          this.sendNotification('Something went wrong!');
        }
      });
  }
  getJsonCountryListData() {
    let type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + "/getCountries";
    console.log(url);
    let res;
    this.http.get(url, options)
      .subscribe(data => {
        res = data.json();
        this.responseResultCountry = res.countries;
      });

  }
  saveEntry() {
    let job_position: string = this.form.controls["job_position"].value,
      company_group: string = this.form.controls["company_group"].value,
      report_to: string = this.form.controls["report_to"].value,
      first_name: string = this.form.controls["first_name"].value,
      last_name: string = this.form.controls["last_name"].value,
      email: string = this.form.controls["email"].value,
      country: string = this.form.controls["country"].value,
      contact: string = this.form.controls["contact"].value;
     // primary: string = this.form.controls["primary"].value;
    //contact = primary + " " + contact;
    contact =  contact;
    console.log(contact);
    /*if (this.addedImgLists) {
      this.isUploadedProcessing = true;
    }*/
    if (this.isUploadedProcessing == false) {
      if (this.isEdited) {
        this.updateEntry(first_name, last_name, email, country, contact, this.userId, job_position, company_group, report_to);
      }
      else {
        this.createEntry(first_name, last_name, email, country, contact, this.userId, job_position, company_group, report_to);
      }
    }
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



  sendNotification(message): void {
    let notification = this.toastCtrl.create({
      message: message,
      duration: 3000
    });
    notification.present();
  }
  previous() {
    this.nav.setRoot(OrgchartPage);
  }
  notification() {
    this.nav.setRoot(NotificationPage);
  }

  getCompanyGroupListData() {
    let type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + "/getcompanies?loginid=" + this.userId+"&pagename=";
    let res;
    console.log("getcompanies API:" + url)
    this.http.get(url, options)
      .subscribe(data => {
        res = data.json();
        this.responseResultCompanyGroup = res.companies;
      });

  }

  getUserListData(companyid) {
    if (this.isEdited == true) {
      this.userId = this.recordID;
      let type: string = "application/x-www-form-urlencoded; charset=UTF-8",
        headers: any = new Headers({ 'Content-Type': type }),
        options: any = new RequestOptions({ headers: headers }),
        url: any = this.apiServiceURL + "/getstaffs?loginid=" + this.userId + "&company_id=" + companyid;
      let res;
      console.log("getstaffs API:" + url);
      this.http.get(url, options)
        .subscribe(data => {
          res = data.json();
          // this.responseResultReportTo="N/A";
          if (this.report_to == 0) {
            console.log("LENGTH" + this.report_to);
            this.len = 0;
          }
          else {
            this.len = res.TotalCount;
          }
          console.log("length" + res.TotalCount);
          // this.naDisplay = 1;
          this.responseResultReportTo = res.staffslist;
        });
    }
    else {
      let type: string = "application/x-www-form-urlencoded; charset=UTF-8",
        headers: any = new Headers({ 'Content-Type': type }),
        options: any = new RequestOptions({ headers: headers }),
        url: any = this.apiServiceURL + "/getstaffs?loginid=" + this.userId + "&company_id=" + companyid;
      let res;
      console.log("Report To API:" + url)
      this.http.get(url, options)
        .subscribe(data => {
          res = data.json();
          // this.responseResultReportTo="N/A";
          this.len = res.TotalCount;
          console.log("length" + res.TotalCount);
          // this.naDisplay = 1;
          this.responseResultReportTo = res.staffslist;
        });
    }

  }

  onSegmentChanged(comapnyid) {
    console.log("ID" + this.company_group);
    this.getUserListData(comapnyid);
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
              console.log(imageURI);
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
            console.log('Camera clicked');
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
              console.log(uri);
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
            console.log('Cancel clicked');
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
    console.log("currentName File Name is:" + currentName);
    console.log("fileName File Name is:" + fileName);
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
        console.log(JSON.stringify(data));
        localStorage.setItem("userPhotoFile", "");
        console.log("UPLOAD SUCCESS:" + data.response);

        console.log("File Name:" + JSON.parse(data.response).name);


        let successData = JSON.parse(data.response);
        this.userInfo.push({
          photo: successData
        });
        console.log("Upload Success Push" + JSON.stringify(this.userInfo));

        console.log("Upload Success File Name" + this.userInfo[0].photo.name);
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
        //this.nav.push(MyaccountPage);

      }, (err) => {
        //loading.dismiss();
        console.log("Upload Error:");
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
