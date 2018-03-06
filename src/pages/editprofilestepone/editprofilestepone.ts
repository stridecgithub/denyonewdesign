import { Component, NgZone } from '@angular/core';
import { NavController, NavParams, Platform, ActionSheetController } from 'ionic-angular';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { MyaccountPage } from '../myaccount/myaccount';
import 'rxjs/add/operator/map';
import { Config } from '../../config/config';
import { FileChooser } from '@ionic-native/file-chooser';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
/**
 * Generated class for the AddcompanygroupPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-editprofilestepone',
  templateUrl: 'editprofilestepone.html',
  providers: [Camera, FileTransfer, File, Config, FileChooser]
})
export class EditprofilesteponePage {
  // Define FormBuilder /model properties
  public loginas: any;
  public form: FormGroup;
  public first_name: any;
  public last_name: any;
  public email: any;
  public username: any;
  public borderbottomredvalidation: any;
  public password: any;
  public re_password: any;
  public photo: any;
  public country: any;
  public primary: any;
  public contact: any;
  public userId: any;
  public hashtag: any;
  report_to;
  naDisplay;
  public footerBar = [];
  public job_position: any;
  public company_group: any;
  progress: number;
  company_id;
  public responseResultCompanyGroup: any;
  public responseResultReportTo: any;
  public isProgress = false;
  public isUploaded: boolean = true;
  // Flag to be used for checking whether we are adding/editing an entry
  public isEdited: boolean = false;
  public readOnly: boolean = false;
  public hidePasswordField: boolean = false;

  public addedImgLists = '';
  len;
  public userInfo = [];
  // Flag to hide the form upon successful completion of remote operation
  public hideForm: boolean = false;
  // Property to help ste the page title
  public pageTitle: string;
  // Property to store the recordID for when an existing entry is being edited
  public recordID: any = null;
  public isUploadedProcessing: boolean = false;
  public uploadResultBase64Data;
  private apiServiceURL: string = "";
  public networkType: string;
  public responseResultCountry: any;
  constructor(private conf: Config, public platform: Platform, public nav: NavController,
    public http: Http,
    public NP: NavParams,
    public fb: FormBuilder, private camera: Camera, private transfer: FileTransfer, private ngZone: NgZone, public actionSheetCtrl: ActionSheetController) {
    this.loginas = localStorage.getItem("userInfoName");
    this.addedImgLists = this.apiServiceURL + "/images/default.png";
    // Create form builder validation rules
    this.form = fb.group({
      "hashtag": [""],
      //"country": ["", Validators.required],
      "first_name": ["", Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
      "last_name": ["", Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
      "username": [""],
      "password": [""],
      "contact": ["", Validators.required],
      "job_position": ["", Validators.required],
      "company_id": ["", Validators.required],
      "report_to": ["", Validators.required],
      //"primary": ["", Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(5)])],
      'email': ['', Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(50), Validators.pattern(/^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i)])]
    });
    this.userId = localStorage.getItem("userInfoId");
    console.log(this.userId);
    this.networkType = '';
    this.apiServiceURL = conf.apiBaseURL();
    this.platform.ready().then(() => {
      this.platform.registerBackButtonAction(() => {
        this.previous();
      });
    });

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

  ionViewDidLoad() {
    console.log('ionViewDidLoad EditprofilesteponePage');
    localStorage.setItem("fromModule", "EditprofilesteponePage");
    this.pageLoad();
  }

  // Determine whether we adding or editing a record
  // based on any supplied navigation parameters
  ionViewWillEnter() {
    this.pageLoad();
  }
  pageLoad() {

    this.getJsonCountryListData();
    this.getCompanyGroupListData();
    //this.getUserListData();
    this.naDisplay = 0;
    this.resetFields();
    if (this.NP.get("act") == 'userinfo') {
      this.pageTitle = 'Edit Profile';
      this.hidePasswordField = false;
    } else {
      this.pageTitle = 'Change Password';
      this.hidePasswordField = true;
    }


    let userInf = localStorage.getItem("userInfo");
    console.log("User Information Storage:" + JSON.stringify(userInf));
    let type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + "/settings/profile?is_mobile=1&loggedin_id=" + this.userId;
    console.log(url);
    let res;
    this.http.get(url, options)
      .subscribe((data) => {
        res = data.json();
        console.log(JSON.stringify(res));
        console.log("1" + res.settings.length);
        console.log("2" + res.settings);
        this.first_name = res.settings[0].firstname;
        this.last_name = res.settings[0].lastname;
        console.log(res.settings[0].firstname);
        this.username = res.settings[0].username;
        this.contact = res.settings[0].contact_number;
        this.photo = res.settings[0].photo_filename;
        localStorage.setItem("photofromgallery", this.photo);
        if (this.contact != undefined) {
          // let contactSplitSpace = this.contact.split(" ");
          // this.primary = contactSplitSpace[0];
          // this.contact = contactSplitSpace[1];
          this.contact = this.contact;
        }

        this.email = res.settings[0].email;
        this.email = res.settings[0].email;
        this.password = res.settings[0].password;
        this.re_password = res.settings[0].password;
        this.hashtag = "@" + this.username;
        this.country = res.settings[0].country_id;
        this.company_id = res.settings[0].company_id;
        this.report_to = res.settings[0].report_to;
        console.log("this.report_to "+this.report_to );
        //if (this.company_id > 0) {
          this.getUserListData();
       // }

        this.job_position = res.settings[0].job_position;

        console.log(res.settings[0].country_name);
        // if (res.settings[0].photo_filename != '' && res.settings[0].photo_filename != 'NULL' && res.settings[0].photo_filename != null) {           
        //   this.photo = this.apiServiceURL + "/staffphotos/" + res.settings[0].photo_filename;
        //    console.log('My Acccount One Photo Available....');
        // }else {
        //   console.log('Edit Profile One Photo Not Available....')
        // }

        if (res.settings[0].photo_filename != '' && res.settings[0].photo_filename != 'NULL' && res.settings[0].photo_filename != null) {
          this.addedImgLists = this.apiServiceURL + "/staffphotos/" + res.settings[0].photo_filename;
          console.log('My Acccount One Photo Available....');
        } else {
          this.addedImgLists = this.apiServiceURL + "/images/default.png";
          console.log('My Acccount  One Photo Not Available....');
        }

      }, error => {
        this.networkType = this.conf.serverErrMsg();// + "\n" + error;
      });
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
  // Update an existing record that has been edited in the page's HTML form
  // Use angular's http post method to submit the record data
  // to our remote PHP script (note the body variable we have created which
  // supplies a variable of key with a value of update followed by the key/value pairs
  // for the record data
  //first_name, last_name, email, username,password, contact, this.userId
  updateEntry(first_name, last_name, email, username, password, contact, createdby, hashtag, job_position, company_id, report_to) {



    // let userPhotoFile = localStorage.getItem("userPhotoFile");
    // if (userPhotoFile) {
    //   console.log("Upload Device Image File:" + userPhotoFile);
    //   this.fileTrans(userPhotoFile);
    // }
    contact = contact.replace("+", "%2B");
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


    let body: string = "is_mobile=1&loggedin_id=" + this.userId +
      "&firstname=" + this.first_name +
      "&lastname=" + this.last_name +
      "&photo=" + this.photo +
      "&email=" + this.email +
      "&contact_number=" + contact +
      "&createdby=" + this.userId +
      "&updatedby=" + this.userId +
      "&job_position=" + job_position +
      "&username=" + this.username +
      "&password=" + this.password +
      "&report_to=" + this.report_to +
      "&personalhashtag=" + this.hashtag +
      "&company_id=" + company_id,

      type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + "/settings/profileupdate";
    console.log(url);
    console.log(body);

    this.http.post(url, body, options)
      .subscribe(data => {
        console.log(data);
        // If the request was successful notify the user
        if (data.status === 200) {
          this.hideForm = true;
          // if (!userPhotoFile) {
          localStorage.setItem("userPhotoFile", "");
          localStorage.setItem("photofromgallery", "");
          // this.conf.sendNotification(`User profile successfully updated`);
          //this.nav.setRoot(MyaccountPage);
          //}

          this.conf.sendNotification(data.json().msg['result']);
          this.nav.setRoot(MyaccountPage);

        }
        // Otherwise let 'em know anyway
        else {
          this.conf.sendNotification('Something went wrong!');
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
      url: any = this.apiServiceURL + "/api/companygroup.php";

    this.http.post(url, body, options)
      .subscribe(data => {
        // If the request was successful notify the user
        if (data.status === 200) {
          this.hideForm = true;
          //this.conf.sendNotification(`Company group was successfully deleted`);
          this.conf.sendNotification(data.json().msg[0]['result']);
        }
        // Otherwise let 'em know anyway
        else {
          this.conf.sendNotification('Something went wrong!');
        }
      }, error => {
        this.networkType = this.conf.serverErrMsg();// + "\n" + error;
      });
  }



  // Handle data submitted from the page's HTML form
  // Determine whether we are adding a new record or amending an
  // existing record
  saveEntry() {




    let isNet = localStorage.getItem("isNet");
    if (isNet == 'offline') {
      this.networkType = this.conf.networkErrMsg();
    } else {
      let first_name: string = this.form.controls["first_name"].value,
        last_name: string = this.form.controls["last_name"].value,
        username: string = this.form.controls["username"].value,
        password: string = this.form.controls["password"].value,
        email: string = this.form.controls["email"].value,
        contact: string = this.form.controls["contact"].value,
       // primary: string = this.form.controls["primary"].value,
        //country: string = this.form.controls["country"].value,
        hashtag: string = this.form.controls["hashtag"].value,
        job_position: string = this.form.controls["job_position"].value,
        company_id: string = this.form.controls["company_id"].value,
        report_to: string = this.form.controls["report_to"].value;
      //contact = primary + " " + contact;
      contact = contact;
      console.log("Contact Concatenate" + contact);
      console.log(this.form.controls);
      console.log("this.isUploadedProcessing" + this.isUploadedProcessing);


      // let body: string = "key=emailexist&email=" + email,
      //   type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      //   headers: any = new Headers({ 'Content-Type': type }),
      //   options: any = new RequestOptions({ headers: headers }),
      //   url: any = this.apiServiceURL + "/api/users.php";

      // this.http.post(url, body, options)
      //   .subscribe((data) => {
      //     console.log(JSON.stringify(data.json()));
      //     // If the request was successful notify the user
      //     if (data.status === 200) {
      //       this.hideForm = true;
      //       console.log(data.json().Error);
      //       if (data.json().Error > 0) {
      //         this.userInfo = []; // need this one
      //         this.conf.sendNotification(data.json().message);
      //         return false;
      //       }
      //     }
      //     // Otherwise let 'em know anyway
      //     else {
      //       this.conf.sendNotification('Something went wrong!');
      //     }
      //   });

      if (this.isUploadedProcessing == false) {
        this.updateEntry(first_name, last_name, email, username, password, contact, this.userId, hashtag, job_position, company_id, report_to);
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




  getJsonCountryListData() {

    let type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + "/api/countries.php";
    let res;

    this.http.get(url, options)
      .subscribe(data => {
        res = data.json();
        this.responseResultCountry = res;
      }, error => {
        this.networkType = this.conf.serverErrMsg();// + "\n" + error;
      });

  }

  previous() {
    this.nav.setRoot(MyaccountPage);
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
              correctOrientation:true
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
              correctOrientation:true
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

  getCompanyGroupListData() {
    let type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      // url: any = this.apiServiceURL + "/getcompanies?loginid=" + this.userId+"comapnyid="+this.companyId;
      url: any = this.apiServiceURL + "/getcompanies?loginid=" + this.userId+"&pagename=";
    let res;
    this.http.get(url, options)
      .subscribe(data => {
        res = data.json();
        this.responseResultCompanyGroup = res.companies;
      }, error => {
        this.networkType = this.conf.serverErrMsg();// + "\n" + error;
      });

  }

  getUserListData() {
    if (this.isEdited == true) {
      //this.userId = this.recordID;
      let type: string = "application/x-www-form-urlencoded; charset=UTF-8",
        headers: any = new Headers({ 'Content-Type': type }),
        options: any = new RequestOptions({ headers: headers }),
        url: any = this.apiServiceURL + "/getstaffs?loginid=" + this.userId + "&company_id=" + this.company_id;
      let res;
      console.log("Report To API:" + url)
      this.http.get(url, options)
        .subscribe(data => {
          res = data.json();
          console.log(JSON.stringify(res));
          // this.responseResultReportTo="N/A";
          if (this.report_to == 0) {
            this.len = 0;
          }
          else {
            this.len = res.TotalCount;
          }
          console.log("this.len:"+this.len)
          console.log("length" + res.TotalCount);
          this.naDisplay = 1;
          this.responseResultReportTo = res.staffslist;
        }, error => {
          this.networkType = this.conf.serverErrMsg();// + "\n" + error;
        });
    }
    else {
      let type: string = "application/x-www-form-urlencoded; charset=UTF-8",
        headers: any = new Headers({ 'Content-Type': type }),
        options: any = new RequestOptions({ headers: headers }),
        url: any = this.apiServiceURL + "/getstaffs?loginid=" + this.userId + "&company_id=" + this.company_id;
      let res;
      console.log("Report To API:" + url)
      this.http.get(url, options)
        .subscribe(data => {
          res = data.json();
          // this.responseResultReportTo="N/A";
          this.len = res.TotalCount;
          console.log("length" + res.TotalCount);
          this.naDisplay = 1;
          this.responseResultReportTo = res.staffslist;
        }, error => {
          this.networkType = this.conf.serverErrMsg();// + "\n" + error;
        });
    }

  }


}

