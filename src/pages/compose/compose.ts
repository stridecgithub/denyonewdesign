import { Component, NgZone } from '@angular/core';
import { AlertController, NavController, NavParams, ActionSheetController } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Config } from '../../config/config';
import { MessagesPage } from '../messages/messages';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { FileChooser } from '@ionic-native/file-chooser';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { NotificationPage } from '../notification/notification';
import { PreviewanddownloadPage } from '../previewanddownload/previewanddownload';
declare var jQuery: any;
declare var mention: any;

/**
 * Generated class for the ComposePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-compose',
  templateUrl: 'compose.html',
  providers: [Camera, FileChooser, FileTransfer, File, Config]
})
export class ComposePage {
  form: FormGroup;
  copytome: any;
  public messageid: any;
  public addedImgLists = [];
  public attachedFileLists = [];
  public isUploadedProcessing: boolean = false;
  micro_timestamp: any;
  public isReply: any;
  public isSubmitted: boolean = false;
  public replyforward: any;
  public message_priority: any;
  private apiServiceURL: string = "";
  private activelow: string = "1";
  private activehigh: string = "0";
  private normallow: string = "1";
  private activenormal: string = "0";
  public userId: any;
  public isUploaded: boolean = true;
  public addedAttachList;
  totalFileSizeExisting;
  progress: number;
  hashtag;
  public isProgress = false;
  totalCount;
  totalFileSize = 0;
  nowuploading = 0;
  overAllFileSize = 0;
  messages_subject;
  messages_body;
  personalhashtag;
  personalhashtagreplaceat;
  photo;
  mdate;
  priority_highclass = '';
  priority_lowclass = '';
  inboxsortaction = false;
  sendsortaction = false;
  isCompose = true;
  inboxact = false;
  sendact = false;
  act;
  choice;
  receiver_id;
  receiver_idreplaceat;
  sender_id;
  senderid;
  composemessagecontent;
  subject;
  to;
  // tabBarElement: any;
  isopenorclose = 1;
  close = 0;
  open = 1;
  public companyId: any;
  public atmentioneddata = [];
  existingimagecount;
  replyall;
  constructor(private alertCtrl: AlertController, private conf: Config, public actionSheetCtrl: ActionSheetController, private formBuilder: FormBuilder, public navCtrl: NavController, public navParams: NavParams, public http: Http, public camera: Camera, private filechooser: FileChooser,

    private transfer: FileTransfer,
    private ngZone: NgZone) {
    this.companyId = localStorage.getItem("userInfoCompanyId");
    this.totalFileSizeExisting = 0;
    this.form = formBuilder.group({
      subject: ['', Validators.required],
      composemessagecontent: ['', Validators.required],
      copytome: [''],
      to: ['', Validators.required]

    });
    this.getPrority(0);
    this.apiServiceURL = conf.apiBaseURL();
    this.message_priority = 0;
    this.nowuploading = 0;
    let already = localStorage.getItem("microtime");
    if (already != undefined && already != 'undefined' && already != '') {
      this.micro_timestamp = already;
    } else {
      let dateStr = new Date();
      let yearstr = dateStr.getFullYear();
      let monthstr = dateStr.getMonth();
      let datestr = dateStr.getDate();
      let hrstr = dateStr.getHours();
      let mnstr = dateStr.getMinutes();
      let secstr = dateStr.getSeconds();
      this.micro_timestamp = yearstr + "" + monthstr + "" + datestr + "" + hrstr + "" + mnstr + "" + secstr;

    }
    localStorage.setItem("microtime", this.micro_timestamp);
    this.userId = localStorage.getItem("userInfoId");
    this.replyforward = 0;
    this.isReply = 0;
    //this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
    this.close = 1;
    this.open = 0;
  }
  toggle(isopenorclose) {
    console.log(isopenorclose);
    if (isopenorclose == 1) {
      this.open = 1;
      this.isopenorclose = 0;
      this.close = 0;
    }
    if (isopenorclose == 0) {
      this.open = 0;
      this.isopenorclose = 1;
      this.close = 1;
    }
  }
  ionViewWillLeave() {
    //this.tabBarElement.style.display = 'flex';
  }

  preview(imagedata, frompage, from, favstatus, message_readstatus, messageid) {
    console.log("Message Id" + messageid);
    this.navCtrl.setRoot(PreviewanddownloadPage, {
      imagedata: imagedata,
      record: this.navParams.get('item'),
      frompage: frompage,
      from: from,
      favstatus: favstatus,
      message_readstatus: message_readstatus,
      messageid: messageid
    });
  }

  ionViewDidLoad() {
    //this.tabBarElement.style.display = 'none';
	
		

    this.copytome = 0;
    console.log('ionViewDidLoad ComposePage');
    this.doAttachmentResources(this.micro_timestamp);
    if (this.navParams.get("record") != undefined) {
      console.log("Record Item" + JSON.stringify(this.navParams.get("record")));
      this.messageid = this.navParams.get("record").message_id;
      this.replyall = this.navParams.get("record").replyall;
    }
    this.act = this.navParams.get("action");

    console.log("REply all:" + this.replyall);
    console.log("Action" + this.act);
    this.choice = this.navParams.get("from");
    console.log("Choice of From" + this.choice);
    if (this.choice != undefined) {
      //this.doDetails(this.navParams.get("record"), this.choice);
      if (this.act == 'reply') {
        //this.reply(this.navParams.get("record").messages_body);
        this.priority_highclass = '';
        this.priority_lowclass = '';
        this.inboxsortaction = false;
        this.sendsortaction = false;
        this.isCompose = true;
        this.isSubmitted = false;
        this.replyforward = 1;
        this.isReply = 1;
        if (this.senderid == this.userId) {

          this.to = this.receiver_id;

          this.addedImgLists = [];
          this.copytome = 0;

          this.getPrority(this.navParams.get("record").message_priority);
          console.log("TO A" + this.navParams.get("record").message_priority);
          this.subject = this.messages_subject;
        }
        else {
          this.isReply = 0;
          this.to = this.navParams.get("record").personalhashtag;

          this.addedImgLists = [];
          this.copytome = 0;
          this.getPrority(this.navParams.get("record").message_priority);
          console.log("Priority B" + this.navParams.get("record").message_priority);
          this.subject = this.navParams.get("record").messages_subject;
          this.composemessagecontent = "\n\n\n" + this.navParams.get("record").message_body;

        }

        this.isReply = 1;
        console.log("Reply Calling");
        this.messageid = this.navParams.get("record").message_id;
        this.doAttachmentResourcesExisting(this.messageid, this.micro_timestamp);
      }


      if (this.act == 'replytoall') {
        
        console.log("goto replytoall");
        //this.reply(this.navParams.get("record").messages_body);
        this.priority_highclass = '';
        this.priority_lowclass = '';
        this.inboxsortaction = false;
        this.sendsortaction = false;
        this.isCompose = true;
        this.isSubmitted = false;
        this.replyforward = 1;
        this.isReply = 1;
        if (this.senderid == this.userId) {
          console.log("A:Get Reply All Users:" + this.navParams.get("record").replyall);
          this.to = this.navParams.get("record").replyall;//this.receiver_id;

          this.addedImgLists = [];
          this.copytome = 0;

          this.getPrority(this.navParams.get("record").message_priority);
          console.log("TO A" + this.navParams.get("record").message_priority);
          this.subject = this.messages_subject;
          this.composemessagecontent = "\n\n\n" + this.navParams.get("record").message_body;
          
        }
        else {

          this.isReply = 0;
          console.log("B:Get Reply All Users:" + this.navParams.get("record").replyall);
          this.to = this.navParams.get("record").replyall;

          this.addedImgLists = [];
          this.copytome = 0;
          this.getPrority(this.navParams.get("record").message_priority);
          console.log("Priority B" + this.navParams.get("record").message_priority);
          this.subject = this.navParams.get("record").messages_subject;
          this.composemessagecontent = "\n\n\n" + this.navParams.get("record").message_body;

          //jQuery("#composemessagecontent").html("<p><br><br></p>"+this.composemessagecontent);
        }

        this.isReply = 1;
        console.log("Reply Calling");
        this.messageid = this.navParams.get("record").message_id;
        this.doAttachmentResourcesExisting(this.messageid, this.micro_timestamp);
      }

      if (this.act == 'forward') {
        this.messageid = this.navParams.get("record").message_id;
        this.doAttachmentResourcesExisting(this.messageid, this.micro_timestamp);
        console.log("Forward Calling");

        this.priority_highclass = '';
        this.priority_lowclass = '';
        this.inboxsortaction = false;
        this.sendsortaction = false;
        this.isCompose = true;
        this.isSubmitted = false;
        this.replyforward = 1;
        this.to = '';

        this.addedImgLists = [];
        this.copytome = 0;
        console.log("Priority C" + this.navParams.get("record").message_priority);
        this.getPrority(this.navParams.get("record").message_priority);
        this.subject = this.navParams.get("record").messages_subject;
        this.composemessagecontent = "\n\n\n" + "-----Forward Message-----" + "\n" + this.navParams.get("record").message_body;
        this.replyforward = 1;
      }
    }
    // Atmentioned API Calls
    let body: string = '',
      //body: string = "key=delete&recordID=" + recordID,
      type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + "/messagehashtags?companyId=" + this.companyId + "&loginid=" + this.userId;
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
    jQuery(".to").mention({
      users: this.atmentioneddata
    });
    // Atmentioned API Calls


    // if (this.replyforward > 0) {

    //   let imgcount = localStorage.getItem("existingimagecount");
    //   if (imgcount != undefined && imgcount != 'undefined' && imgcount != '') {
    //     this.existingimagecount = imgcount;
    //   } else {
    //     localStorage.set("existingimagecount" + this.addedImgLists.length);
    //     this.existingimagecount = this.addedImgLists.length;
    //   }
    // }
  }




  doAttachmentResources(micro_timestamp) {
    this.addedImgLists = [];
    let bodymessage: string = "messageid=0&micro_timestamp=" + micro_timestamp + "&loginid=" + this.userId,
      type1: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers1: any = new Headers({ 'Content-Type': type1 }),
      options1: any = new RequestOptions({ headers: headers1 }),
      url1: any = this.apiServiceURL + "/getmessagedetails";
    console.log(url1 + '?' + bodymessage);
    this.http.post(url1, bodymessage, options1)
      //this.http.get(url1, options1)
      .subscribe((data) => {


        console.log("Message Response Success:" + JSON.stringify(data.json()));
        console.log("Message Details:" + data.json().messages[0]);
        this.selectEntry(data.json().messages[0]);

        /*
                console.log("servicebyid Response Success:" + JSON.stringify(data.json()));
                this.totalCount = 0;
                console.log(data.json().length - 1);
                for (let i = 0; i < data.json().length; i++) {
        
                  console.log("Attachmnt:" + data.json()[i].attachment_id);
                  this.totalFileSize = data.json()[i];
                  let imgSrc;
                  //imgSrc = this.apiServiceURL + "/attachments" + '/' + data.json()[i].attachment;
                  if (data.json()[i].attachment_id > 0) {
                    this.addedImgLists.push({
                      fileName: data.json()[i].attachment,
                      fileSize: data.json()[i].filesize_kb,
                      resouce_id: data.json()[i].attachment_id
                    });
                  }
                  if (data.json().length == this.totalCount) {
        
                    break;
                  }
                  this.totalCount++;
                }
        
                console.log("Attached from api response:" + JSON.stringify(this.addedImgLists));
                if (this.messageid != 0) {
                  this.totalFileSize = this.addedImgLists[0].fileSize;
                }
        */

      });
  }

  doAttachmentResourcesExisting(message_id, micro_timestamp) {

    let bodymessage: string = "messageid=" + message_id + "&micro_timestamp=" + micro_timestamp + "&loginid=" + this.userId,
      type1: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers1: any = new Headers({ 'Content-Type': type1 }),
      options1: any = new RequestOptions({ headers: headers1 }),
      url1: any = this.apiServiceURL + "/getmessagedetails";
    console.log(url1 + '?' + bodymessage);
    this.http.post(url1, bodymessage, options1)
      //this.http.get(url1, options1)
      .subscribe((data) => {
        console.log("Message Response Success:" + JSON.stringify(data.json()));
        console.log("Message Details:" + data.json().messages[0]);
        this.selectEntry(data.json().messages[0]);
        //this.doAttachmentResources(data.json().messages[0].message_id);
      }, error => {
      });
    /*
    this.addedImgLists = [];
    //micro_timestamp = '2017112123520';
    console.log("doImageResources function calling successfully....")
    let //body: string = "micro_timestamp=" + micro_timestamp,
      type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      //http://denyoappv2.stridecdev.com/api/message_attachments_by_messageid.php?message_id=87
      url: any = this.apiServiceURL + "/api/message_attachments_by_messageid.php?message_id=" + message_id;
    console.log(url);
    this.http.get(url, options)
      .subscribe((data) => {
        console.log("servicebyid Response Success:" + JSON.stringify(data.json()));
        this.totalCount = 0;
        console.log(data.json().length - 1);
        for (let i = 0; i < data.json().length; i++) {
  
          console.log("Attachmnt:" + data.json()[i].messageresource_id);
          this.totalFileSize = data.json()[i];
          let imgSrc;
          imgSrc = this.apiServiceURL + "/attachments" + '/' + data.json()[i].messageresource_filename;
          if (data.json()[i].messageresource_id > 0) {
            this.addedImgLists.push({
              fileName: data.json()[i].messageresource_filename,
              fileSize: data.json()[i].filesize_kb,
              resouce_id: data.json()[i].messageresource_id,
              imgSrc: imgSrc
            });
          }
          if (data.json().length == this.totalCount) {
  
            break;
          }
          this.totalCount++;
        }
  
        console.log("Attached from api response:" + JSON.stringify(this.addedImgLists));
  
  
      });*/
  }

  selectEntry(item) {

    console.log(JSON.stringify(item));
    //if (this.nowuploading == 0) {
    this.totalFileSize = item.totalfilesize;
    //}
    this.totalFileSizeExisting = this.totalFileSize;
    console.log("this.totalFileSizeExisting:" + this.totalFileSizeExisting);
    if (item.attachments != '') {
      let ath = item.attachments.split("#");
      let flsize = item.filesizes.split("#");
      let resourceid = item.resourceids.split("#")
      for (let i = 0; i < ath.length; i++) {
        this.addedImgLists.push({
          fileName: ath[i],
          fileSize: flsize[i],
          resource_id: resourceid[i]
          // fileSize: data.json()[i].filesize_kb,
          // resouce_id: data.json()[i].messageresource_id,
          //  imgSrc: imgSrc
        });
      }
      console.log("filesizes:" + item.filesizes);
    }
  }
  // When form submitting the below function calling
  saveEntry() {

    // let to = jQuery('.to').tagEditor('getTags')[0].tags;
    // console.log(to.length);
    // if (to.length == 0) {
    //   this.conf.sendNotification(`To address required`);
    //   return false;
    // }
   
    if (this.isUploadedProcessing == false) {
      let //to: string = this.form.controls["to"].value,
        copytome: string = this.form.controls["copytome"].value,
        composemessagecontent: string = this.form.controls["composemessagecontent"].value,
        subject: string = this.form.controls["subject"].value;
    
  

      this.createEntry(this.micro_timestamp, copytome, composemessagecontent, subject);

    }

  }

  // Save a new record that has been added to the page's HTML form
  // Use angular's http post method to submit the record data
  // to our remote PHP script (note the body variable we have created which
  // supplies a variable of key with a value of create followed by the key/value pairs
  // for the record data

  createEntry(micro_timestamp,  copytome, composemessagecontent, subject) {
    let to = jQuery(".to").val();
    this.isSubmitted = true;
    if (copytome == true) {
      copytome = '1';
    }
    // if (this.replyforward == 0) {
    //   if (localStorage.getItem("atMentionResult") != '') {
    //     to = localStorage.getItem("atMentionResult");
    //   }
    // }
    let param;
    let urlstring;
    console.log("is reply forward and this.messageid" + this.replyforward + " " + this.messageid);
    console.log("Is reply?" + this.isReply);
    if (this.replyforward > 0) {

      let isrepfor;
      if (this.isReply > 0) {
        isrepfor = 'Reply';
      } else {
        isrepfor = 'forward';
      }
   
      param = "is_mobile=1" +
        "&important=" + this.message_priority +
        "&microtime=" + micro_timestamp +
        "&loginid=" + this.userId +
        "&to=" + to +
        "&composemessagecontent=" + composemessagecontent.toString() +
        "&copytome=" + copytome +
        "&submit=" + isrepfor +
        "&forwardmsgid=" + this.messageid +
        "&subject=" + subject;
      urlstring = this.apiServiceURL + "/messages/replyforward";
    } else {
      param = "is_mobile=1" +
        "&important=" + this.message_priority +
        "&microtime=" + micro_timestamp +
        "&loginid=" + this.userId +
        "&to=" + to +
        "&composemessagecontent=" + composemessagecontent.toString() +
        "&copytome=" + copytome +
        "&subject=" + subject;
      urlstring = this.apiServiceURL + "/messages/store";
    }
    let body: string = param,

      type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = urlstring;
    console.log("Message sending API" + url + "?" + body);

    this.http.post(url, body, options)
      .subscribe((data) => {
        //console.log("Response Success:" + JSON.stringify(data.json()));
        // If the request was successful notify the user
        if (data.status === 200) {

          localStorage.setItem("microtime", "");
          // this.conf.sendNotification(`Message sending successfully`);
          //localStorage.setItem("atMentionResult", '');
          // this.navCtrl.setRoot(MessagesPage);
          // return false;

          this.conf.sendNotification(data.json().msg[0]['result']);
          this.navCtrl.setRoot(MessagesPage);

        }
        // Otherwise let 'em know anyway
        else {
          this.conf.sendNotification('Something went wrong!');
        }
      });
    localStorage.setItem("microtime", "");
    // localStorage.setItem("atMentionResult", '');
    //this.conf.sendNotification(`Message sending successfully`);
	
	

  }
  fileChooser(micro_timestamp) {

    let actionSheet = this.actionSheetCtrl.create({
      title: 'Attachment',
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
              console.log(imageURI);
              this.fileTrans(imageURI, micro_timestamp);
              this.addedAttachList = imageURI;
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
              console.log(uri);
              this.fileTrans(uri, micro_timestamp);
              this.addedAttachList = uri;
            }, (err) => {
              // Handle error
              this.conf.sendNotification(err);
            });
          }
        }, {
          text: 'From File',
          icon: 'document',
          handler: () => {
            console.log('File clicked');
            console.log('From File clicked');

            this.isUploadedProcessing = true;
            this.filechooser.open()
              .then(
              uri => {
                console.log(uri);
                this.fileTrans(uri, micro_timestamp);
                this.addedAttachList = uri;
              }

              )
              .catch(e => console.log(e));
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
  }
  fileTrans(path, micro_timestamp) {
    this.isSubmitted = true;
    console.log("Path:" + path);
    let fileName = path.substr(path.lastIndexOf('/') + 1);
    const fileTransfer: FileTransferObject = this.transfer.create();
    let currentName = path.replace(/^.*[\\\/]/, '');
    console.log("File Name is:" + currentName);

    let dateStr = new Date();
    let year = dateStr.getFullYear();
    let month = dateStr.getMonth();
    let date = dateStr.getDate();
    let hr = dateStr.getHours();
    let mn = dateStr.getMinutes();
    let sec = dateStr.getSeconds();
    let d = new Date(),
      n = d.getTime(),
      newFileName = year + "" + month + "" + date + "" + hr + "" + mn + "" + sec + "_Denyo_" + currentName;

    console.log("File Name is :" + newFileName);

    let options: FileUploadOptions = {
      fileKey: 'file',
      fileName: newFileName,
      headers: {},
      chunkedMode: false,
      mimeType: "text/plain",
    }
    fileTransfer.onProgress(this.onProgress);

    console.log("Upload Attach URL:" + this.apiServiceURL + '/api/upload_attach.php?micro_timestamp=' + micro_timestamp + "&message_id=" + this.messageid + "&totalSize=" + this.totalFileSize);
    console.log("Upload Attach Options:" + JSON.stringify(options));

    // fileTransfer.upload(path, this.baseURI + '/api/upload_attach.php', options)
    fileTransfer.upload(path, this.apiServiceURL + '/api/upload_attach.php?micro_timestamp=' + micro_timestamp + "&message_id=" + this.messageid + "&totalSize=" + this.totalFileSize, options)
      .then((data) => {
        console.log("UPLOAD SUCCESS:" + data.response);
        this.nowuploading = 1;
        let successData = JSON.parse(data.response);
        this.isSubmitted = false;
        this.conf.sendNotification("File attached successfully");

        console.log('http:' + '//' + successData.baseURL + '/' + successData.target_dir + '/' + successData.fileName);
        let imgSrc;
        if (this.messageid == undefined) {
          this.messageid = 0;
        }
        console.log("Image get from resource for message Id:" + this.messageid);

        if (this.messageid > 0) {
          this.doAttachmentResourcesExisting(this.messageid, this.micro_timestamp);
        }
        this.doAttachmentResources(this.micro_timestamp);
        if (this.messageid != 0) {
          //this.totalFileSize = successData.totalSizeInKB;
        }
        /*console.log("this.totalFileSize"+this.totalFileSize); 
        this.overAllFileSize=this.totalFileSize+this.totalFileSizeExisting;
         console.log("this.overAllFileSize"+this.totalFileSize); */
        localStorage.setItem('fileAttach', JSON.stringify(this.addedImgLists));
        console.log("Added Image List Response:" + JSON.stringify(this.addedImgLists));
        if (this.addedImgLists.length > 9) {
          this.isUploaded = false;
        }
        this.progress += 5;
        if (this.progress == 100) {
          this.isSubmitted = false;
        }
        this.isProgress = false;
        this.isUploadedProcessing = false;


        return false;
      }, (err) => {

        this.isProgress = false;
        console.log("Upload Error:" + JSON.stringify(err));
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
  // List page navigate to notification list
  notification() {
    console.log('Will go notification list page');
    // Navigate the notification list page
    this.navCtrl.setRoot(NotificationPage);
  }
  getPrority(val) {
    console.log("getPrority function calling:-" + val);


    if (val == "2") {
      console.log('val A:' + val);
      this.activelow = "0";
      this.activehigh = "1";
      this.normallow = "0";
      this.activenormal = "1";
    } else if (val == "1") {
      console.log('val B:' + val);
      this.activelow = "1";
      this.activehigh = "0";
      this.normallow = "1";
      this.activenormal = "0";
    } else {
      console.log('val C:' + val);
      this.activelow = "0";
      this.activehigh = "0";
      this.normallow = "0";
      this.activenormal = "0";
    }


    this.message_priority = val
  }
  address1get(hashtag) {
    console.log(hashtag);
    this.hashtag = hashtag;


    var str = " i am from Tamil nadu.";
    var res = str.split(" ");  //split by space
    res.pop();  //remove last element
    console.log(res.join(" ") + ".");  //join back together


  }

  doRemoveResouce(item) {
    console.log("Deleted Id" + item.resource_id);
    console.log("Image Item" + JSON.stringify(item));
    let confirm = this.alertCtrl.create({
      message: 'Are you sure you want to delete this file?',
      buttons: [{
        text: 'Yes',
        handler: () => {
          if (item.resource_id != undefined) {
            this.deleteEntry(item.resource_id);
          }

          for (let q: number = 0; q < this.addedImgLists.length; q++) {
            if (this.addedImgLists[q] == item) {
              this.addedImgLists.splice(q, 1);

            }
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

  previous() {
    this.navCtrl.setRoot(MessagesPage);
  }
  // Remove an existing record that has been selected in the page's HTML form
  // Use angular's http post method to submit the record data
  // to our remote PHP script (note the body variable we have created which
  // supplies a variable of key with a value of delete followed by the key/value pairs
  // for the record ID we want to remove from the remote database
  deleteEntry(recordID) {
    let
      //body: string = "key=delete&recordID=" + recordID,
      type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + "/" + recordID + "/removeattachment";
    console.log(url);
    this.http.get(url, options)
      .subscribe(data => {
        // If the request was successful notify the user
        if (data.status === 200) {
          // this.conf.sendNotification(`File was successfully deleted`);
          //this.doImageResources(service_id);
          this.conf.sendNotification(data.json().msg[0]['result']);
          this.doAttachmentResources(this.micro_timestamp);
        }
        // Otherwise let 'em know anyway
        else {
          this.conf.sendNotification('Something went wrong!');
        }
      }, error => {

      });
  }


}
