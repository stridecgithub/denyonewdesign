import { Component } from '@angular/core';
import { Platform, NavController, NavParams, AlertController,App } from 'ionic-angular';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Config } from '../../config/config';
import { MessagesPage } from "../messages/messages";
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { ComposePage } from "../compose/compose";
//import { NotificationPage } from '../notification/notification';
import { PreviewanddownloadPage } from '../previewanddownload/previewanddownload';
import { MessagedetailPage } from '../messagedetail/messagedetail';
/**
 * Generated class for the MessagedetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-message-detail-view',
  templateUrl: 'message-detail-view.html'
})
export class MessageDetailViewPage {
  public service_id: any;
  public messageid: any;
  public message_date_mobileview: any;
  public messages_subject: any;
  public messages_body: any;
  public messages_body_html: any;
  private apiServiceURL: string = "";
  public userId: any;
  public companyId: any;
  public is_favorite: any;
  public message_priority: any;
  public time_ago: any;
  public receiver_id: any;
  public sendername: any;
  public senderphoto: any;
  public attachedFileLists = [];
  public service_resources;
  priority_highclass = '';
  priority_lowclass = '';
  private activelow: string = "0";
  private activehigh: string = "0";
  // For Messages
  isUploadedProcessing;
  micro_timestamp;
  public isCompose;
  isReply;
  priority_image;
  to;
  addedImgLists = [];
  copytome;
  subject;
  composemessagecontent;
  isSubmitted;
  replyforward;
  senderid;
  personalhashtag;
  detailItem;
  form: FormGroup;
  totalCount;
  totalFileSize = 0;
  from;
  is_reply;
  //tabBarElement: any;
  isopenorclose = 1;
  close = 0;
  open = 1;
  delete_icon_only = '1';
  message_readstatus;
  favstatus: any; // 0 is unfavorite 1 is favorite
  // For Messages
  timezoneoffset;
  constructor(public app: App,private platform: Platform, private conf: Config, formBuilder: FormBuilder, public alertCtrl: AlertController, public http: Http, public navCtrl: NavController, public navParams: NavParams) {
    this.timezoneoffset = localStorage.getItem("timezoneoffset");
    this.platform.ready().then(() => {
      this.platform.registerBackButtonAction(() => {
        const overlayView = this.app._appRoot._overlayPortal._views[0];
        if (overlayView && overlayView.dismiss) {
          overlayView.dismiss();
        }
        if (this.navParams.get('from') == 'push') {
          this.navCtrl.setRoot(MessagedetailPage, {
            event_id: this.messageid,
            from: 'push',
            favstatus: this.navParams.get("favstatus"),
            message_readstatus: this.navParams.get("message_readstatus")
          });

        } else {
          this.navCtrl.setRoot(MessagedetailPage, {
            item: this.navParams.get('item'),
            act: this.navParams.get('act'),
            from: this.from,
            favstatus: this.navParams.get("favstatus"),
            message_readstatus: this.navParams.get("message_readstatus"),
            event_id: this.navParams.get("messageid")
          });
        }
      });
    });
    this.apiServiceURL = this.conf.apiBaseURL();
    this.userId = localStorage.getItem("userInfoId");
    this.companyId = localStorage.getItem("userInfoCompanyId");
    this.form = formBuilder.group({
      subject: ['', Validators.required],
      composemessagecontent: ['', Validators.required],
      to: ['', Validators.required],
      copytome: ['']

    });
    this.isCompose = 0;
    if (this.navParams.get("from") != 'push') {
      //this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
    }
    this.close = 1;
    this.open = 0;

  }
  action(item, action, from) {
    this.navCtrl.setRoot(ComposePage, {
      record: item,
      action: action,
      from: from
    });
  }
  toggle(isopenorclose) {
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
    if (this.navParams.get("from") != 'push') {
      // this.tabBarElement.style.display = 'flex';
    }
  }
  ionViewDidLoad() {
    if (this.navParams.get("from") != 'push') {
      //this.tabBarElement.style.display = 'none';
    }
    
    this.detailItem = this.navParams.get('item');
    this.from = this.navParams.get('from');
    this.favstatus = this.navParams.get('favstatus');
    this.message_readstatus = this.navParams.get('message_readstatus');
    if (this.from == 'send') {
      this.delete_icon_only = '0';
    } else if (this.from == 'push') {
      this.delete_icon_only = '0';
    } else {
      this.delete_icon_only = '1';
    }
    // if (this.from != 'push') {
    //   this.selectEntry(this.detailItem);
    // } else {
    let messageids;
    if (this.from == 'push') {
      messageids = this.navParams.get("event_id");
    } else {
      messageids = this.detailItem.message_id;
    }

    let urlstr;
    if (this.conf.isUTC() > 0) {
      urlstr ="messageid=" + messageids + "&loginid=" + this.userId+ "&timezoneoffset=" + Math.abs(this.timezoneoffset);
    } else {
      urlstr ="messageid=" + messageids + "&loginid=" + this.userId;
    }
    let bodymessage: string = urlstr,
      type1: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers1: any = new Headers({ 'Content-Type': type1 }),
      options1: any = new RequestOptions({ headers: headers1 }),
      url1: any = this.apiServiceURL + "/getmessagedetails";
    this.conf.presentLoading(1);
    this.http.post(url1, bodymessage, options1)
    
      .subscribe((data) => {
        this.conf.presentLoading(0);
        this.selectEntry(data.json().messages[0]);
      });
   
  }
  doAttachmentResources(message_id) {
    this.addedImgLists = [];
    
    let //body: string = "micro_timestamp=" + micro_timestamp,
      type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + "/api/message_attachments_by_messageid.php?message_id=" + message_id;
    
    this.http.get(url, options)
      .subscribe((data) => {
        
        this.totalCount = 0;
       
        for (let i = 0; i < data.json().length; i++) {

        
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

      


      });
  }

  selectEntry(item) {
    
    this.priority_image = '';
    
    this.message_date_mobileview = item.message_date_mobileview;
    this.messages_subject = item.messages_subject;
    this.messages_body = item.message_body;
    this.messages_body_html = item.message_body_html;

    this.priority_image = item.priority_image;
    if (this.priority_image == 'arrow_active_low.png') {
      this.getPrority(1);
    }
    if (this.priority_image == 'arrow_active_high.png') {
      this.getPrority(2);
    }
    this.messageid = item.message_id;
    this.is_reply = item.isreply;
    this.priority_highclass = '';
    this.priority_lowclass = '';
    if (item.message_priority == "2") {
      this.priority_highclass = "border-high";
    }
    if (item.message_priority == "1") {
      this.priority_lowclass = "border-low";
    }

    if (item.message_priority == "0") {
      this.priority_lowclass = "";
    } else {
      this.priority_lowclass = "";
    }


    this.favstatus = this.navParams.get('favstatus');
    this.message_readstatus = this.navParams.get('message_readstatus');

    if (this.navParams.get('favstatus') != undefined) {
      this.favstatus = this.navParams.get('favstatus');
    } else {
      this.favstatus = item.is_favorite;
    }
    if (this.navParams.get('message_readstatus') != undefined) {
      this.message_readstatus = this.navParams.get('message_readstatus');
    } else {
      this.message_readstatus = item.message_readstatus;
    }

    this.message_priority = item.message_priority;
    this.time_ago = item.time_ago;
    //this.receiver_id = item.receiver_id.toLowerCase();

    this.receiver_id = item.replyall.toLowerCase();


    let personalhashtag = localStorage.getItem("personalhashtag").toLowerCase();
    


    let n = this.receiver_id.includes(personalhashtag);
    if (n > 0) {
      this.receiver_id = this.receiver_id.toString().replace(personalhashtag, " ");
      this.receiver_id = "me " + this.conf.toTitleCase(this.receiver_id);
    }

    this.sendername = item.sendername;
    // this.senderphoto = item.senderphoto;
    // if (this.senderphoto == undefined) {
    //   this.senderphoto = item.recipient_photo;
    // }



    if (this.from == 'inbox') {
      this.senderphoto = item.senderphoto;
    }else if (this.from == 'push') {
      this.senderphoto = item.senderphoto;
    }else {
      this.senderphoto = item.recipient_photo;
    }

    if (this.senderphoto == '' || this.senderphoto == 'null') {
      this.senderphoto = this.apiServiceURL + "/images/default.png";
    }


    this.is_favorite = item.is_favorite;



    if (this.navParams.get('act') == 'read') {
      let body: string = "is_mobile=1&ses_login_id=" + this.userId +
        "&message_id=" + item.message_id + "&frompage=inbox",
        type: string = "application/x-www-form-urlencoded; charset=UTF-8",
        headers: any = new Headers({ 'Content-Type': type }),
        options: any = new RequestOptions({ headers: headers }),
        url: any = this.apiServiceURL + "/messages/changereadunread";
      this.http.post(url, body, options)
        .subscribe((data) => {
          // If the request was successful notify the user
          if (data.status === 200) {
            //this.conf.sendNotification(`Comment count successfully removed`);

          }
          // Otherwise let 'em know anyway
          else {
            // this.conf.sendNotification('Something went wrong!');
          }
        });

    }
    this.totalFileSize = item.totalfilesize;
    
    if (item.attachments != '') {
      let ath = item.attachments.split("#");
      let flsize = item.filesizes.split("#")
      for (let i = 0; i < ath.length; i++) {
        this.addedImgLists.push({
          fileName: ath[i],
          fileSize: flsize[i]
          // fileSize: data.json()[i].filesize_kb,
          // resouce_id: data.json()[i].messageresource_id,
          //  imgSrc: imgSrc
        });
      }
    
    }
  }
  previous() {
    if (this.navParams.get('from') == 'push') {
      this.navCtrl.setRoot(MessagedetailPage, {
        event_id: this.messageid,
        from: 'push',
        favstatus: this.navParams.get("favstatus"),
        message_readstatus: this.navParams.get("message_readstatus")
      });

    } else {
      this.navCtrl.setRoot(MessagedetailPage, {
        item: this.navParams.get('item'),
        act: this.navParams.get('act'),
        from: this.from,
        favstatus: this.navParams.get("favstatus"),
        message_readstatus: this.navParams.get("message_readstatus"),
        event_id: this.navParams.get("messageid")
      });
    }
  }
  readAction(messageid, act, from) {
    
    if (act == 'unread') {
     
      this.unreadAction(messageid);
     
      this.message_readstatus = 0;
      return false;
    } else if (act == 'read') {
      this.message_readstatus = 1;
     
      this.readActionStatus(messageid);
     
      return false;
    }
   
  }
  readActionStatus(val) {
    let body: string = "is_mobile=1&ses_login_id=" + this.userId +
      "&message_id=" + val + "&frompage=inbox",
      type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + "/messages/changereadunread";
    this.http.post(url, body, options)
      .subscribe((data) => {
        // If the request was successful notify the user
        if (data.status === 200) {
          if (data.json().msg[0]['Error'] == 0) {
            this.conf.sendNotification(data.json().msg[0]['result']);
          }

        }
        // Otherwise let 'em know anyway
        else {
          // this.conf.sendNotification('Something went wrong!');
        }
      });


  }
  unreadAction(val) {


    let urlstr = this.apiServiceURL + "/messages/actions?frompage=inbox&is_mobile=1&ses_login_id=" + this.userId + "&actions=Unread&messageids=" + val;
    let bodymessage: string = "",
      type1: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers1: any = new Headers({ 'Content-Type': type1 }),
      options1: any = new RequestOptions({ headers: headers1 });
    let res;
    this.http.post(urlstr, bodymessage, options1)
      .subscribe((data) => {
        res = data.json();
      
        if (data.status === 200) {
         
          if (res.msg[0]['Error'] == 0) {
            this.conf.sendNotification(res.msg[0]['result']);
          }
        
        }
        // Otherwise let 'em know anyway
        else {
          // this.conf.sendNotification('Something went wrong!');
        }
      }, error => {
       
      });


  }

  favoriteact(messageid) {
    if (this.from == 'inbox') {
      this.favorite(messageid);
    } else {
      this.sentfavorite(messageid);
    }
  }
  favorite(messageid) {
    let body: string = "loginid=" + this.userId + "&is_mobile=1&messageid=" + messageid,
      type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + "/messages/messagefavorite";
   
    this.http.post(url, body, options)
      .subscribe(data => {
       
        this.favstatus = data.json().favstatus;
        if (this.favstatus == 'fav') {
          this.favstatus = 1;
        }
        if (this.favstatus == 'unfav') {
          this.favstatus = 0;
        }
        // If the request was successful notify the user
        if (data.status === 200) {
          //this.conf.sendNotification('Favorite updated successfully');
          this.conf.sendNotification(data.json().msg[0]['result']);
          //  this.navCtrl.setRoot(MessagesPage);
        }
        // Otherwise let 'em know anyway
        else {
          this.conf.sendNotification('Something went wrong!');
        }
      }, error => {
      });


  }

  sentfavorite(messageid) {
    
    let body: string = "loginid=" + this.userId + "&is_mobile=1&messageid=" + messageid,
      type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + "/messages/sendmessagefavorite";
    
    this.http.post(url, body, options)
      .subscribe(data => {
      
        this.favstatus = data.json().favstatus;
        if (this.favstatus == 'fav') {
          this.favstatus = 1;
        }
        if (this.favstatus == 'unfav') {
          this.favstatus = 0;
        }
        // If the request was successful notify the user
        if (data.status === 200) {
          //  this.conf.sendNotification('Favorite updated successfully');
          //  this.navCtrl.setRoot(MessagesPage);
          this.conf.sendNotification(data.json().msg[0]['result']);
        }
        // Otherwise let 'em know anyway
        else {
          this.conf.sendNotification('Something went wrong!');
        }
      }, error => {
        
      });


  }

  doConfirm(id, item, type) {
   
    let confirm = this.alertCtrl.create({
      message: 'Are you sure you want to delete this message?',
      buttons: [{
        text: 'Yes',
        handler: () => {
          this.deleteEntry(id, type);

        }
      },
      {
        text: 'No',
        handler: () => { }
      }]
    });
    confirm.present();
  }
  deleteEntry(recordID, typestr) {
    let urlstr;
    if (this.from == 'inbox') {
      urlstr = this.apiServiceURL + "/messages/actions?frompage=inbox&is_mobile=1&ses_login_id=" + this.userId + "&actions=Delete&messageids=" + recordID;
    } else {
      urlstr = this.apiServiceURL + "/messages/actions?frompage=senditem&is_mobile=1&ses_login_id=" + this.userId + "&actions=Delete&messageids=" + recordID;

    }
    let bodymessage: string = "",
      type1: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers1: any = new Headers({ 'Content-Type': type1 }),
      options1: any = new RequestOptions({ headers: headers1 });
   
    let res;
    this.http.post(urlstr, bodymessage, options1)
      .subscribe((data) => {
        res = data.json();
       
        if (data.status === 200) {
          if (res.msg[0]['Error'] == 0) {
            this.conf.sendNotification(res.msg[0]['result']);
            this.navCtrl.setRoot(MessagesPage);
          }

        }
        // Otherwise let 'em know anyway
        else {
          // this.conf.sendNotification('Something went wrong!');
        }
      }, error => {
        
      });


  }


  reply(messages_body) {

    this.isCompose = 1;
    this.isSubmitted = false;
    this.replyforward = 1;
    this.isReply = 1;
    if (this.senderid == this.userId) {
      this.to = this.receiver_id;
      this.addedImgLists = [];

      this.copytome = 0;

      this.subject = this.messages_subject;
      //this.composemessagecontent = "-----Reply Message-----" + "\n" + messages_body;

    }
    else {
      this.isReply = 0;
      this.to = this.personalhashtag;
      this.addedImgLists = [];
      this.copytome = 0;

      this.subject = this.messages_subject;
      //this.composemessagecontent = "-----Reply Message-----" + "\n" + messages_body;
      this.composemessagecontent = messages_body;

    }
  }

  forward(messages_body) {

    this.isCompose = 1;
    this.isSubmitted = false;
    this.replyforward = 1;
    this.to = '';
    this.addedImgLists = [];
    this.copytome = 0;
    this.subject = this.messages_subject;
    this.composemessagecontent = "-----Forward Message-----" + "\n" + messages_body;

  }

  saveEntry() {
   
    if (this.isUploadedProcessing == false) {
      let to: string = this.form.controls["to"].value,
        copytome: string = this.form.controls["copytome"].value,
        composemessagecontent: string = this.form.controls["composemessagecontent"].value,
        subject: string = this.form.controls["subject"].value;
   

      this.createEntry(this.micro_timestamp, to, copytome, composemessagecontent, subject);

    }

  }

  // Save a new record that has been added to the page's HTML form
  // Use angular's http post method to submit the record data
  // to our remote PHP script (note the body variable we have created which
  // supplies a variable of key with a value of create followed by the key/value pairs
  // for the record data
  createEntry(micro_timestamp, to, copytome, composemessagecontent, subject) {
    this.isSubmitted = true;
    if (copytome == true) {
      copytome = '1';
    }

    let param;
    let urlstring;
    
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
        "&composemessagecontent=" + composemessagecontent +
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
        "&composemessagecontent=" + composemessagecontent +
        "&copytome=" + copytome +
        "&subject=" + subject;
      urlstring = this.apiServiceURL + "/messages/store";
    }
    let body: string = param,

      type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = urlstring;

    this.http.post(url, body, options)
      .subscribe((data) => {
        
        if (data.status === 200) {
          this.replyforward = 0;
          localStorage.setItem("microtime", "");
          //this.conf.sendNotification(`Message sending successfully`);

          this.conf.sendNotification(data.json().msg[0]['result']);
          this.addedImgLists = [];
          this.to = '';
          this.copytome = 0;
          this.composemessagecontent = "";
        }
        // Otherwise let 'em know anyway
        else {
          this.conf.sendNotification('Something went wrong!');
        }
      });
  }
  preview(imagedata, frompage, from, favstatus, message_readstatus, messageid) {
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

  getPrority(val) {
    


    if (val == "2") {
     
      this.activelow = "0";
      this.activehigh = "1";

    } else if (val == "1") {
      
      this.activelow = "1";
      this.activehigh = "0";

    } else {
     
      this.activelow = "0";
      this.activehigh = "0";

    }


    this.message_priority = val
  }
}

