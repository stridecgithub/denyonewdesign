import { Component, NgZone } from '@angular/core';
import { NavController, NavParams, ToastController, LoadingController, ActionSheetController, Platform,App } from 'ionic-angular';
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
declare var jQuery: any;
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
  templateUrl: 'addorgchartone.html'
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
  private apiServiceURL: string = "";
  public responseResultCompanyGroup: any;
  public responseResultReportTo = [];
  public len;
  job_position;
  company_group;
  report_to;
  company_id;
  public addedImgLists;
  constructor(private app:App,private conf: Config, public nav: NavController,
    public http: Http,
    public NP: NavParams,
    public fb: FormBuilder,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    private camera: Camera
    , private transfer: FileTransfer, private ngZone: NgZone, public actionSheetCtrl: ActionSheetController, public platform: Platform) {
    this.apiServiceURL = this.conf.apiBaseURL();
    this.addedImgLists = this.apiServiceURL + "/images/default.png";
    this.platform.ready().then(() => {
      this.platform.registerBackButtonAction(() => {
        const overlayView = this.app._appRoot._overlayPortal._views[0];
        if (overlayView && overlayView.dismiss) {
          overlayView.dismiss();
        }
        this.nav.setRoot(OrgchartPage);
      });
    });

    this.loginas = localStorage.getItem("userInfoName");
    // Create form builder validation rules
    this.form = fb.group({
      //"first_name": ["", Validators.required],
      //"last_name": ["", Validators.required],
      "first_name": ["", Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
      "last_name": ["", Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
      "country": ["", Validators.required],
      "contact": ["", Validators.compose([Validators.pattern(/^[- +()]*[0-9][- +()0-9]*$/), Validators.required])],
      //"contact": ['', Validators.compose([Validators.required,Validators.pattern(/^\+(?:[0-9] ?){6,14}[0-9]$/)])],
      // "primary": ["", Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(5)])],
      /// "email": ["", Validators.required]
      'email': ['', Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(50), Validators.pattern(/^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i)])],
      "job_position": ["", Validators.required],
      "company_group": ["", Validators.required],
      "report_to": [""]
    });
    this.userId = localStorage.getItem("userInfoId");
    this.company_id = localStorage.getItem("userInfoCompanyId");
    if (this.isEdited == false) {
     this.getUserListData(this.company_id);
    }


  }


  ionViewDidLoad() {
    this.pageLoad();
  }
  pageLoad() {
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
    this.getJsonCountryListData();
    this.getCompanyGroupListData();
    if (this.NP.get("record") != undefined) {
      this.isEdited = true;
      this.selectEntry(this.NP.get("record"));
      this.pageTitle = 'Edit Org Chart';
      this.readOnly = false;
      this.hideActionButton = true;
      if (this.NP.get("record").photo) {
        this.addedImgLists = this.apiServiceURL + "/staffphotos/" + this.NP.get("record").photo;
      }
      let editItem = this.NP.get("record");
      this.first_name = editItem.firstname;
      this.last_name = editItem.lastname;
      this.email = editItem.email;
      this.country = editItem.country_id;
      this.contact = editItem.contact_number;
      if (this.contact != undefined) {
        // let contactSplitSpace = this.contact.split(" ");
        // this.primary = contactSplitSpace[0];
        this.contact = this.contact;
      }
      this.getUserListData(editItem.company_id);
    }
    else {
      this.isEdited = false;
      this.pageTitle = 'Add Org Chart';
    }


  }
  getPrimaryContact(ev) {
    let char = ev.target.value.toString();
    if (char.length > 5) {
      this.borderbottomredvalidation = 'border-bottom-validtion';
    } else {
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
      "&createdby=" + this.userId +
      "&updatedby=" + this.userId +
      "&report_to=" + report_to +
      "&company_id=" + company_group +
      "&job_position=" + job_position,
      type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + "/orgchart/store";

    this.http.post(url, body, options)
      .subscribe((data) => {
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
    this.http.post(url, body, options)
      .subscribe(data => {
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
    contact = contact;
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

  popoverclose() {
    jQuery(".popover-content").hide();
  }
  cation() {
    this.nav.setRoot(NotificationPage);
  }

  getCompanyGroupListData() {
    let type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + "/getcompanies?loginid=" + this.userId + "&pagename=";
    let res;
    this.http.get(url, options)
      .subscribe(data => {
        res = data.json();
        this.responseResultCompanyGroup = res.companies;
      });

  }

  getUserListData(companyid) {
    console.log("A:"+companyid);
    console.log("this.isEdited:"+this.isEdited);
    if (this.isEdited == true) {
      console.log('C');
      this.userId = this.recordID;
      let type: string = "application/x-www-form-urlencoded; charset=UTF-8",
        headers: any = new Headers({ 'Content-Type': type }),
        options: any = new RequestOptions({ headers: headers }),
        url: any = this.apiServiceURL + "/getstaffs?loginid=" + this.userId + "&company_id=" + companyid;
      let res;
      console.log("Get Staffs True:-"+url);
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

          if (this.recordID != '') {
            if (res.staffslist.length > 0) {

              for (let staff in res.staffslist) {

                if (this.recordID != res.staffslist[staff].staff_id) {
                  this.responseResultReportTo.push({
                    staff_id: res.staffslist[staff].staff_id,
                    firstname: res.staffslist[staff].firstname,
                    lastname: res.staffslist[staff].lastname,
                    email: res.staffslist[staff].email,
                    contact_number: res.staffslist[staff].contact_number,
                    photo: res.staffslist[staff].photo,
                    personalhashtag: res.staffslist[staff].personalhashtag,
                    country_id: res.staffslist[staff].country_id,
                    role_id: res.staffslist[staff].role_id,
                    job_position: res.staffslist[staff].job_position,
                    report_to: res.staffslist[staff].report_to,
                    company_id: res.staffslist[staff].company_id,
                    non_user: res.staffslist[staff].non_user,
                    status: res.staffslist[staff].status,
                    createdby: res.staffslist[staff].createdby,
                    createdon: res.staffslist[staff].createdon,
                    updatedby: res.staffslist[staff].updatedby,
                    updatedon: res.staffslist[staff].updatedon
                  });
                }
              }
            }
          } else {
            this.responseResultReportTo = res.staffslist;
          }

        });
    }
    else {
      console.log('D');      
      let type: string = "application/x-www-form-urlencoded; charset=UTF-8",
        headers: any = new Headers({ 'Content-Type': type }),
        options: any = new RequestOptions({ headers: headers }),
        url: any = this.apiServiceURL + "/getstaffs?loginid=" + this.userId + "&company_id=" + companyid;
      let res;
      console.log("Get Staffs False:-"+url);
      this.http.get(url, options)
        .subscribe(data => {
          res = data.json();
          // this.responseResultReportTo="N/A";
          this.len = res.TotalCount;

          // this.naDisplay = 1;

          if (this.recordID != '') {
            if (res.staffslist.length > 0) {

              for (let staff in res.staffslist) {
                if (this.recordID != res.staffslist[staff].staff_id) {
                  this.responseResultReportTo.push({
                    staff_id: res.staffslist[staff].staff_id,
                    firstname: res.staffslist[staff].firstname,
                    lastname: res.staffslist[staff].lastname,
                    email: res.staffslist[staff].email,
                    contact_number: res.staffslist[staff].contact_number,
                    photo: res.staffslist[staff].photo,
                    personalhashtag: res.staffslist[staff].personalhashtag,
                    country_id: res.staffslist[staff].country_id,
                    role_id: res.staffslist[staff].role_id,
                    job_position: res.staffslist[staff].job_position,
                    report_to: res.staffslist[staff].report_to,
                    company_id: res.staffslist[staff].company_id,
                    non_user: res.staffslist[staff].non_user,
                    status: res.staffslist[staff].status,
                    createdby: res.staffslist[staff].createdby,
                    createdon: res.staffslist[staff].createdon,
                    updatedby: res.staffslist[staff].updatedby,
                    updatedon: res.staffslist[staff].updatedon
                  });
                }
              }
            } else {
              this.responseResultReportTo = res.staffslist;
            }
          }
        });
    }

  }

  onSegmentChanged(comapnyid) {

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
              destinationType: this.camera.DestinationType.NATIVE_URI,
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
      this.userInfo = [];
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
        

      }, (err) => {

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
