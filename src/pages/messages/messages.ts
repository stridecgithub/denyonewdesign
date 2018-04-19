import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, ModalController, Platform, App } from 'ionic-angular';
import { ComposePage } from "../compose/compose";
import { Http, Headers, RequestOptions } from '@angular/http';
import { Config } from '../../config/config';
import { NotificationPage } from '../notification/notification';
import { MessagedetailPage } from '../messagedetail/messagedetail';
declare var jQuery: any;
//import { PermissionPage } from '../permission/permission';
import { DashboardPage } from '../dashboard/dashboard';
@Component({
  selector: 'page-messages',
  templateUrl: 'messages.html',
  providers: [Config]
})
export class MessagesPage {
  footerBar: number = 3;
  public tabs: string = 'inboxView';
  isReadyToSave: boolean;
  public photoInfo = [];
  public actionId = [];
  public arrayid = [];
  public uploadResultBase64Data;
  public inboxLists = [];
  public sendLists = [];
  public inboxsortaction: boolean = false;
  public sendsortaction: boolean = false;
  public isCompose: boolean = false;
  public loginas: any;
  public hashtag;
  public photo: any;
  public mdate: any;
  public act: any;
  public sendact: any;
  public inboxact: any;
  rolePermissionMsg;
  public priority_lowclass: any;
  public priority_highclass: any;
  public addedImgListsArray = [];
  public addedImgLists = [];
  public attachedFileLists = [];
  private apiServiceURL: string = "";
  public networkType: string;
  public composemessagecontent: any;
  progress: number;
  public personalhashtag;
  public personalhashtagreplaceat;
  public receiver_id;
  public receiver_idreplaceat;
  public pageTitle: any;
  public recordID: any;
  public userId: any;
  public companyId: any;
  public str: any;
  public strsend: any;
  public strinbox: any;
  public service_id: any;
  public serviced_by: any;
  public messageid: any;
  public serviced_datetime: any;
  public isSubmitted: boolean = false;
  public messages_subject: any;
  public messages_body: any;
  public next_service_date: any;
  public message_priority: any;
  public isReply: any;
  copytome: any;
  public serviced_by_name: any;
  public service_resources: any;
  micro_timestamp: any;
  public isUploadedProcessing: boolean = false;
  public isUploaded: boolean = true;
  public selectedAction = [];
  public message_readstatus: any;
  public replyforward: any;
  item: any;
  public senderid: any;

  // Authority for message send
  public MESSAGESENTVIEWACCESS;
  public MESSAGESENTCREATEACCESS;
  public MESSAGESENTEDITACCESS;
  public MESSAGESENTDELETEACCESS;
  // Authority for message send
  // Authority for message inbox
  public MESSAGEINBOXVIEWACCESS;
  public MESSAGEINBOXCREATEACCESS;
  public MESSAGEINBOXEDITACCESS;
  public MESSAGEINBOXDELETEACCESS;
  // Authority for message inbox

  public msgcount: any;
  public notcount: any;
  public to: any;
  public subject: any;
  atmentedInnerHTML: string;
  public isEdited: boolean = false;
  public addedAttachList;
  public totalCount;
  public totalCountSend;
  valueforngif = true;
  public inboxData: any =
    {
      status: '',
      sort: 'messages_id',
      sortascdesc: 'desc',
      startindex: 0,
      results: 50
    }
  public sendData: any =
    {
      status: '',
      sort: 'messages_id',
      sortascdesc: 'desc',
      startindex: 0,
      results: 50
    }
  public hideActionButton = true;
  public sortLblTxt: string = 'Date Received';
  public sortLblSendTxt: string = 'Date Sent';
  segmenttabshow;
  testRadioOpen: boolean;
  testRadioResult;
  // tabBarElement;
  public profilePhoto;
  roleId;

  selectallopenpop = 0;
  moreopenpop = 0;
  selectallopenorclose = 1;
  moreopenorclose = 1;
  public selecteditems = [];
  onholdselectinboxsend;
  constructor(public app: App, public platform: Platform, public modalCtrl: ModalController, private conf: Config, public alertCtrl: AlertController, public navCtrl: NavController, public navParams: NavParams, public http: Http) {
    this.apiServiceURL = this.conf.apiBaseURL();
    this.userId = localStorage.getItem("userInfoId");
    this.companyId = localStorage.getItem("userInfoCompanyId");
    this.roleId = localStorage.getItem("userInfoRoleId");
    this.inb();
    this.profilePhoto = localStorage.getItem("userInfoPhoto");
    if (this.profilePhoto == '' || this.profilePhoto == 'null') {
      this.profilePhoto = this.apiServiceURL + "/images/default.png";
    } else {
      this.profilePhoto = this.apiServiceURL + "/staffphotos/" + this.profilePhoto;
    }

    this.platform.ready().then(() => {
      this.platform.registerBackButtonAction(() => {
        const overlayView = this.app._appRoot._overlayPortal._views[0];
        if (overlayView && overlayView.dismiss) {
          overlayView.dismiss();
        }
        this.navCtrl.setRoot(DashboardPage, {
        });
      });
    });
    this.doNotifiyCount();






  }
  isNet() {
    let isNet = localStorage.getItem("isNet");
    if (isNet == 'offline') {
      this.conf.networkErrorNotification('You are now ' + isNet + ', Please check your network connection');
    }
  }

  doNotifiyCount() {
    // Notification count
    let
      type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + "/msgnotifycount?loginid=" + this.userId;
    this.http.get(url, options)
      .subscribe((data) => {
        this.msgcount = data.json().msgcount;
        this.notcount = data.json().notifycount;
      }, error => {
      });
    // Notiifcation count
  }


  ionViewDidLoad() {
    // Authority for message send
    this.MESSAGESENTVIEWACCESS = localStorage.getItem("MESSAGES_SENT_VIEW");
    this.MESSAGESENTCREATEACCESS = localStorage.getItem("MESSAGES_SENT_CREATE");
    this.MESSAGESENTEDITACCESS = localStorage.getItem("MESSAGES_SENT_EDIT");
    this.MESSAGESENTDELETEACCESS = localStorage.getItem("MESSAGES_SENT_DELETE");
    // Authority for message send
    // Authority for message inbox
    this.MESSAGEINBOXVIEWACCESS = localStorage.getItem("MESSAGES_INBOX_VIEW");
    this.MESSAGEINBOXCREATEACCESS = localStorage.getItem("MESSAGES_INBOX_CREATE");
    this.MESSAGEINBOXEDITACCESS = localStorage.getItem("MESSAGES_INBOX_EDIT");
    this.MESSAGEINBOXDELETEACCESS = localStorage.getItem("MESSAGES_INBOX_DELETE");
    // Authority for message inbox



    let elements = document.querySelectorAll(".tabbar");

    if (elements != null) {
      Object.keys(elements).map((key) => {
        elements[key].style.display = 'flex';
      });
    }
    if (this.MESSAGESENTVIEWACCESS == 1 && this.MESSAGEINBOXVIEWACCESS == 1) {
      this.tabs = 'inboxView';

      jQuery('#inboxView').show();
      jQuery('#sentView').show();
      jQuery('#inboxblock').show();
      jQuery('#sendblock').show();
      this.segmenttabshow = 1;
      this.rolePermissionMsg = '';

    } else if (this.MESSAGESENTVIEWACCESS == 0 && this.MESSAGEINBOXVIEWACCESS == 1) {
      this.tabs = 'inboxView';

      jQuery('#inboxView').show();
      jQuery('#sentView').hide();
      jQuery('#inboxblock').show();
      jQuery('#sendblock').hide();
      this.segmenttabshow = 0;
      this.rolePermissionMsg = '';

    } else if (this.MESSAGESENTVIEWACCESS == 1 && this.MESSAGEINBOXVIEWACCESS == 0) {
      this.tabs = 'sentView';

      jQuery('#inboxView').hide();
      jQuery('#sentView').show();
      jQuery('#inboxblock').hide();
      jQuery('#sendblock').show();
      this.segmenttabshow = 1;
      this.rolePermissionMsg = '';
      this.snd();

    } else if (this.MESSAGESENTVIEWACCESS == 0 && this.MESSAGEINBOXVIEWACCESS == 0) {

      jQuery('#inboxView').hide();
      jQuery('#sentView').hide();
      jQuery('#inboxblock').hide();
      jQuery('#sendblock').hide();
      this.segmenttabshow = 0;
      this.rolePermissionMsg = this.conf.rolePermissionMsg();
    }

    if (this.navParams.get("fromtab") != undefined) {
      if (this.navParams.get("fromtab") == 'sentView') {

        this.tabs = 'sendView';
        this.snd();
      } else {
        this.inb();
        this.tabs = 'inboxView';

      }
      this.tabs = this.navParams.get("fromtab");
    }
  }

  ionViewDidEnter() {
    // Authority for message send
    this.MESSAGESENTVIEWACCESS = localStorage.getItem("MESSAGES_SENT_VIEW");
    this.MESSAGESENTCREATEACCESS = localStorage.getItem("MESSAGES_SENT_CREATE");
    this.MESSAGESENTEDITACCESS = localStorage.getItem("MESSAGES_SENT_EDIT");
    this.MESSAGESENTDELETEACCESS = localStorage.getItem("MESSAGES_SENT_DELETE");
    // Authority for message send
    // Authority for message inbox
    this.MESSAGEINBOXVIEWACCESS = localStorage.getItem("MESSAGES_INBOX_VIEW");
    this.MESSAGEINBOXCREATEACCESS = localStorage.getItem("MESSAGES_INBOX_CREATE");
    this.MESSAGEINBOXEDITACCESS = localStorage.getItem("MESSAGES_INBOX_EDIT");
    this.MESSAGEINBOXDELETEACCESS = localStorage.getItem("MESSAGES_INBOX_DELETE");
    // Authority for message inbox

    if (this.MESSAGESENTVIEWACCESS == 1 && this.MESSAGEINBOXVIEWACCESS == 1) {

      this.tabs = 'inboxView';
      jQuery('#inboxView').show();
      jQuery('#sentView').show();
      jQuery('#inboxblock').show();
      jQuery('#sendblock').show();
      this.segmenttabshow = 1;
      this.rolePermissionMsg = '';
    } else if (this.MESSAGESENTVIEWACCESS == 0 && this.MESSAGEINBOXVIEWACCESS == 1) {

      this.tabs = 'inboxView';
      jQuery('#inboxView').show();
      jQuery('#sentView').hide();
      jQuery('#inboxblock').show();
      jQuery('#sendblock').hide();
      this.segmenttabshow = 0;
      this.rolePermissionMsg = '';
    } else if (this.MESSAGESENTVIEWACCESS == 1 && this.MESSAGEINBOXVIEWACCESS == 0) {

      this.tabs = 'sentView';
      jQuery('#inboxView').hide();
      jQuery('#sentView').show();
      jQuery('#inboxblock').hide();
      jQuery('#sendblock').show();
      this.segmenttabshow = 1;
      this.rolePermissionMsg = '';
    } else if (this.MESSAGESENTVIEWACCESS == 0 && this.MESSAGEINBOXVIEWACCESS == 0) {

      jQuery('#inboxView').hide();
      jQuery('#sentView').hide();
      jQuery('#inboxblock').hide();
      jQuery('#sendblock').hide();
      this.segmenttabshow = 0;
      this.rolePermissionMsg = this.conf.rolePermissionMsg();
    }

    if (this.navParams.get("fromtab") != undefined) {
      if (this.navParams.get("fromtab") == 'sentView') {
        this.tabs = 'sendView';
      } else {
        this.tabs = 'inboxView';
      }
      this.tabs = this.navParams.get("fromtab");
    }

  }
  compose() {
    localStorage.setItem("microtime", "");
    this.navCtrl.setRoot(ComposePage);
  }
  readAction(messageid, item, act, from) {
    localStorage.setItem("microtime", '');
    if (act == 'unread') {

      this.unreadAction(messageid, item);

      return false;
    } else if (act == 'read') {

      this.readActionStatus(messageid, item);

      return false;
    } else {

      this.navCtrl.setRoot(MessagedetailPage, {
        item: item,
        act: act,
        from: from
      });
    }

  }
  inb() {
    this.inboxLists = [];
    this.sendLists = [];
    this.inboxData.startindex = 0;
    this.doInbox();
    this.selectallopenpop = 0;
    this.moreopenpop = 0;
    this.selecteditems = [];
  }

  snd() {
    this.inboxLists = [];
    this.sendLists = [];
    this.sendData.startindex = 0;
    this.doSend();
    this.selectallopenpop = 0;
    this.moreopenpop = 0;
    this.selecteditems = [];
  }

  /****************************/
  /*@doCompanyGroup calling on report */
  /****************************/
  doInbox() {
    this.isCompose = false;
    this.inboxact = false;
    this.sendact = false;
    this.priority_highclass = '';
    this.priority_lowclass = '';
    this.inboxsortaction = true;
    this.sendsortaction = false;

    //this.conf.presentLoading(1);
    if (this.inboxData.status == '') {
      this.inboxData.status = "messages_id";
    }
    if (this.inboxData.sort == '') {
      this.inboxData.sort = "messages_id";
    }

    let type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + "/messages?is_mobile=1&startindex=" + this.inboxData.startindex + "&results=" + this.inboxData.results + "&sort=" + this.inboxData.sort + "&dir=" + this.inboxData.sortascdesc + "&loginid=" + this.userId;
    let res;

    this.conf.presentLoading(1);
    this.http.get(url, options)
      .subscribe((data) => {
        res = data.json();
        this.inboxData.startindex += this.inboxData.results;
        if (res.messages.length > 0) {
          for (let message in res.messages) {
            this.inboxLists.push({
              message_id: res.messages[message].message_id,
              sender_id: res.messages[message].sender_id,
              messages_subject: res.messages[message].messages_subject,
              message_body: res.messages[message].message_body,
              message_body_html: res.messages[message].message_body_html,
              message_date: res.messages[message].message_date,
              message_date_mobileview: res.messages[message].message_date_mobileview,
              message_date_mobileview_list: res.messages[message].message_date_mobileview_list,
              is_favorite: res.messages[message].is_favorite,
              message_readstatus: res.messages[message].message_readstatus,
              message_priority: res.messages[message].message_priority,
              priority_image: res.messages[message].priority_image,
              isreply: res.messages[message].isreply,
              time_ago: res.messages[message].time_ago,
              receiver_id: res.messages[message].receiver_id,
              attachments: res.messages[message].attachments,
              sendername: res.messages[message].sendername,
              senderphoto: res.messages[message].senderphoto,
              personalhashtag: res.messages[message].personalhashtag,
              replyall: res.messages[message].duration,
              duration: res.messages[message].duration,
              logo: "assets/imgs/square.png",
              active: ""
            });
          }
          this.totalCount = res.totalCount;
        } else {
          this.totalCount = 0;
        }
        this.conf.presentLoading(0);
      }, error => {
        this.networkType = this.conf.serverErrMsg();// + "\n" + error;
      });
    // this.conf.presentLoading(0);
  }


  doSend() {
    this.priority_highclass = '';
    this.priority_lowclass = '';
    this.isCompose = false;
    this.inboxact = false;
    this.sendact = false;
    this.inboxsortaction = false;
    this.sendsortaction = true;
    //this.conf.presentLoading(1);
    if (this.sendData.status == '') {
      this.sendData.status = "messages_id";
    }
    if (this.sendData.sort == '') {
      this.sendData.sort = "messages_id";
    } let type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + "/sentitems?is_mobile=1&startindex=" + this.sendData.startindex + "&results=" + this.sendData.results + "&sort=" + this.sendData.sort + "&dir=" + this.sendData.sortascdesc + "&loginid=" + this.userId;
    let res;

    this.conf.presentLoading(1);
    this.http.get(url, options)
      .subscribe((data) => {

        res = data.json();
        if (res.messages.length > 0) {
          if (res.messages.length > 0) {
            for (let message in res.messages) {
              this.sendLists.push({
                message_id: res.messages[message].message_id,
                sender_id: res.messages[message].sender_id,
                messages_subject: res.messages[message].messages_subject,
                message_body: res.messages[message].message_body,
                messages_isfavaurite: res.messages[message].messages_isfavaurite,
                message_body_html: res.messages[message].message_body_html,
                message_date: res.messages[message].message_date,
                message_date_mobileview: res.messages[message].message_date_mobileview,
                message_date_mobileview_list: res.messages[message].message_date_mobileview_list,
                time_ago: res.messages[message].time_ago,
                message_priority: res.messages[message].message_priority,
                priority_image: res.messages[message].priority_image,
                personalhashtag: res.messages[message].personalhashtag,
                receiver_id: res.messages[message].receiver_id,
                receiver_name: res.messages[message].receiver_name,
                recipient_photo: res.messages[message].recipient_photo,
                senderphoto: res.messages[message].senderphoto,
                attachments: res.messages[message].attachments,
                replyall: res.messages[message].replyall,
                duration: res.messages[message].duration,
                logo: "assets/imgs/square.png",
                active: ""
              });
            }
            this.totalCount = res.totalCount;
          } else {
            this.totalCount = 0;
          }
          this.totalCount = res.totalCount;
          this.sendData.startindex += this.sendData.results;
          this.totalCountSend = res.totalCount;
          this.sendData.startindex += this.sendData.results;
        } else {
          this.totalCountSend = 0;
        }
        this.conf.presentLoading(0);
      }, error => {
      });
    //this.conf.presentLoading(0);
  }
  /**********************/
  /* Infinite scrolling */
  /**********************/
  doInfinite(infiniteScroll) {
    if (this.inboxData.startindex < this.totalCount && this.inboxData.startindex > 0) {

      this.doInbox();
    }

    setTimeout(() => {

      infiniteScroll.complete();
    }, 500);

  }
  doSendInfinite(infiniteScroll) {
    if (this.sendData.startindex < this.totalCountSend && this.sendData.startindex > 0) {

      this.doSend();
    }

    setTimeout(() => {

      infiniteScroll.complete();
    }, 500);

  }
  doConfirm(id, item, type) {
    let confirm = this.alertCtrl.create({
      message: 'Are you sure you want to delete this message?',
      buttons: [{
        text: 'Yes',
        handler: () => {
          this.deleteEntry(id, type);
          if (type == 'inbox') {
            for (let q: number = 0; q < this.inboxLists.length; q++) {
              if (this.inboxLists[q] == item) {
                this.inboxLists.splice(q, 1);
              }
            }
          } else {
            for (let q: number = 0; q < this.sendLists.length; q++) {
              if (this.sendLists[q] == item) {
                this.sendLists.splice(q, 1);
              }
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
  deleteEntry(recordID, typestr) {
    let urlstr;
    if (typestr == 'inbox') {
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
          }
          this.strinbox = '';
          this.inboxact = '';
          this.inboxData.startindex = 0;
          this.doInbox();
        }
        // Otherwise let 'em know anyway
        else {
          // this.conf.sendNotification('Something went wrong!');
        }
      }, error => {
      });


  }
  // List page navigate to notification list
  notification() {
    this.navCtrl.setRoot(NotificationPage);
  }

  doSort() {
    let prompt = this.alertCtrl.create({
      title: 'Sort By',
      inputs: [
        {
          type: 'radio',
          label: 'Date Received',
          value: 'messages_id'
        },
        {
          type: 'radio',
          label: 'Subject',
          value: 'messages_subject',
        },
        {
          type: 'radio',
          label: 'Sender Name',
          value: 'sendername',
        },
        {
          type: 'radio',
          label: 'Favourites',
          value: 'messagesinbox_isfavaurite'
        }
      ],
      buttons: [
        {
          text: 'Asc',
          handler: data => {
            if (data != undefined) {
              this.inboxData.sort = data;
              this.inboxData.sortascdesc = 'asc';


              if (data == 'messagesinbox_isfavaurite') {
                this.sortLblTxt = 'Favourites';
              } else if (data == 'sendername') {
                this.sortLblTxt = 'Sender Name';
              } else if (data == 'messages_id') {
                this.sortLblTxt = 'Date Received';
              } else if (data == 'messages_subject') {
                this.sortLblTxt = 'Subject';
              }
              this.inboxData.startindex = 0;
              this.inboxLists = [];
              this.doInbox();


            }
          }
        },
        {
          text: 'Desc',
          handler: data => {
            if (data != undefined) {
              this.inboxData.sort = data;
              this.inboxData.sortascdesc = 'desc';

              if (data == 'messagesinbox_isfavaurite') {
                this.sortLblTxt = 'Favourites';
              } else if (data == 'sendername') {
                this.sortLblTxt = 'Sender Name';
              } else if (data == 'messages_id') {
                this.sortLblTxt = 'Date Received';
              } else if (data == 'messages_subject') {
                this.sortLblTxt = 'Subject';
              }
              this.inboxData.startindex = 0;
              this.inboxLists = [];
              this.doInbox();
            }
          }
        }
      ]
    });
    prompt.present();
  }


  doSortSendItem() {
    let prompt = this.alertCtrl.create({
      title: 'Sort By',
      inputs: [
        {
          type: 'radio',
          label: 'Date Sent',
          value: 'messages_id'
        },
        {
          type: 'radio',
          label: 'Subject',
          value: 'messages_subject',
        },
        {
          type: 'radio',
          label: 'Receipient',
          value: 'reciver_id',
        },
        {
          type: 'radio',
          label: 'Favourites',
          value: 'messages_isfavaurite',
        }
      ],
      buttons: [
        {
          text: 'Asc',
          handler: data => {
            if (data != undefined) {
              this.sendData.sort = data;
              this.sendData.sortascdesc = 'asc';


              if (data == 'messages_subject') {
                this.sortLblSendTxt = 'Subject';
              } else if (data == 'messages_id') {
                this.sortLblSendTxt = 'Date Sent';
              } else if (data == 'reciver_id') {
                this.sortLblSendTxt = 'Receipient';
              } else if (data == 'messages_isfavaurite') {
                this.sortLblSendTxt = 'Favourite';
              }
              this.sendData.startindex = 0;
              this.sendLists = [];
              this.doSend();


            }
          }
        },
        {
          text: 'Desc',
          handler: data => {
            if (data != undefined) {
              this.sendData.sort = data;
              this.sendData.sortascdesc = 'desc';


              if (data == 'messages_subject') {
                this.sortLblSendTxt = 'Subject';
              } else if (data == 'messages_id') {
                this.sortLblSendTxt = 'Date Sent';
              } else if (data == 'reciver_id') {
                this.sortLblSendTxt = 'Receipient';
              } else if (data == 'messages_isfavaurite') {
                this.sortLblSendTxt = 'Favourites';
              }


              this.sendData.startindex = 0;
              this.sendLists = [];
              this.doSend();
            }
          }
        }
      ]
    });
    prompt.present();
  }



  favorite(messageid) {
    let body: string = "loginid=" + this.userId + "&is_mobile=1&messageid=" + messageid,
      type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + "/messages/setfavorite";


    this.http.post(url, body, options)
      .subscribe(data => {
        // If the request was successful notify the user
        if (data.status === 200) {

          /* if (res.favorite == 0) {
             this.conf.sendNotification("Unfavorited successfully");
           } else {
             this.conf.sendNotification("Favorited successfully");
           }*/
          this.inboxLists = [];
          this.conf.sendNotification(data.json().msg.result);
          this.inboxData.startindex = 0;
          this.doInbox();
        }
        // Otherwise let 'em know anyway
        else {
          this.conf.sendNotification('Something went wrong!');
        }
      }, error => {
      });


  }

  senditemfavorite(messageid) {
    let body: string = "loginid=" + this.userId + "&is_mobile=1&messageid=" + messageid,
      type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + "/messages/setsenditemfavorite";


    this.http.post(url, body, options)
      .subscribe(data => {

        // If the request was successful notify the user
        if (data.status === 200) {
          this.conf.sendNotification(data.json().msg.result);

          this.sendLists = [];
          this.sendData.startindex = 0;
          //this.snd();
          this.doSend();
        }
        // Otherwise let 'em know anyway
        else {
          this.conf.sendNotification('Something went wrong!');
        }
      }, error => {

      });


  }


  unreadAction(val, inboxData) {


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

          this.strinbox = '';
          this.inboxact = '';
          this.inboxLists = [];
          this.inboxData.startindex = 0;
          this.doInbox();

        }
        // Otherwise let 'em know anyway
        else {
          // this.conf.sendNotification('Something went wrong!');
        }
      }, error => {

      });


  }

  readActionStatus(val, inboxData) {
    let body: string = "is_mobile=1&ses_login_id=" + this.userId +
      "&message_id=" + inboxData.message_id + "&frompage=inbox",
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

          this.strinbox = '';
          this.inboxact = '';
          this.inboxLists = [];
          this.inboxData.startindex = 0;
          this.doInbox();


        }
        // Otherwise let 'em know anyway
        else {
          // this.conf.sendNotification('Something went wrong!');
        }
      });


  }


  onholdaction(action) {


    this.moreopenpop = 0;
    this.arrayid = [];
    for (let i = 0; i < this.selecteditems.length; i++) {
      //str = str + this.selecteditems[i].message_id + ",";
      this.arrayid.push(
        this.selecteditems[i].message_id
      )
    }
    // str = str.replace(/,\s*$/, "");
    let urlstr;
    if (action == 'favorite') {
      if (this.onholdselectinboxsend == 'inbox') {
        urlstr = this.apiServiceURL + "/onholdmessageaction?frompage=inbox&is_mobile=1&ses_login_id=" + this.userId + "&actions=favorite&messageids=" + this.arrayid;
      } else {
        urlstr = this.apiServiceURL + "/onholdmessageaction?frompage=send&is_mobile=1&ses_login_id=" + this.userId + "&actions=favorite&messageids=" + this.arrayid;
      }
    } else if (action == 'markasread') {
      if (this.onholdselectinboxsend == 'inbox') {
        urlstr = this.apiServiceURL + "/onholdmessageaction?frompage=inbox&is_mobile=1&ses_login_id=" + this.userId + "&actions=Unread&messageids=" + this.arrayid;
      }
    } else if (action == 'delete') {

    }



    if (action == 'delete') {
      let confirm = this.alertCtrl.create({
        message: 'Are you sure you want to delete this message?',
        buttons: [{
          text: 'Yes',
          handler: () => {
            if (this.onholdselectinboxsend == 'inbox') {
              urlstr = this.apiServiceURL + "/onholdmessageaction?frompage=inbox&is_mobile=1&ses_login_id=" + this.userId + "&actions=delete&messageids=" + this.arrayid;

              let bodymessage: string = "",
                type1: string = "application/x-www-form-urlencoded; charset=UTF-8",
                headers1: any = new Headers({ 'Content-Type': type1 }),
                options1: any = new RequestOptions({ headers: headers1 });
              let res;
              console.log("URL Onhold Delete Action" + urlstr);
              this.http.post(urlstr, bodymessage, options1)
                .subscribe((data) => {
                  res = data.json();
                  console.log("Unread" + JSON.stringify(res));
                  if (data.status === 200) {
                    if (res.msg[0]['Error'] == 0) {
                      this.conf.sendNotification(res.msg[0]['result']);
                    }
                    this.strinbox = '';
                    this.inboxact = '';
                    this.inboxLists = [];
                    this.selecteditems = [];
                    this.inboxData.startindex = 0;
                    this.doInbox();
                    this.sendLists = [];
                    this.sendData.startindex = 0;
                    this.doSend();
                    console.log('Exit 2');
                  }
                  // Otherwise let 'em know anyway
                  else {
                    // this.conf.sendNotification('Something went wrong!');
                  }
                }, error => {
                  this.networkType = this.conf.serverErrMsg();// + "\n" + error;
                });
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
    if (action != 'delete') {
      let bodymessage: string = "",
        type1: string = "application/x-www-form-urlencoded; charset=UTF-8",
        headers1: any = new Headers({ 'Content-Type': type1 }),
        options1: any = new RequestOptions({ headers: headers1 });
      let res;
      console.log("URL Onhold Action" + urlstr);
      this.http.post(urlstr, bodymessage, options1)
        .subscribe((data) => {
          res = data.json();
          console.log("Unread" + JSON.stringify(res));
          if (data.status === 200) {
            if (res.msg[0]['Error'] == 0) {
              this.conf.sendNotification(res.msg[0]['result']);
            }
            this.strinbox = '';
            this.inboxact = '';
            this.inboxLists = [];
            this.selecteditems = [];
            this.inboxData.startindex = 0;
            this.doInbox();
            this.sendLists = [];
            this.sendData.startindex = 0;
            this.doSend();
            console.log('Exit 2');
          }
          // Otherwise let 'em know anyway
          else {
            // this.conf.sendNotification('Something went wrong!');
          }
        }, error => {
          this.networkType = this.conf.serverErrMsg();// + "\n" + error;
        });

    }
  }
  pressed(item, index, act) {
    this.onholdselectinboxsend = act;
    this.selecteditems = [];
    if (act == 'inbox') {
      if (this.inboxLists[index]) {
        if (this.inboxLists[index].active == '') {
          this.inboxLists[index].active = 'active';
          this.inboxLists[index].logo = 'assets/imgs/tick_white_background.png';
        } else {
          this.inboxLists[index].active = '';
          this.inboxLists[index].logo = 'assets/imgs/tick_white_background.png';
        }
      }



      for (let i = 0; i < this.inboxLists.length; i++) {
        if (this.inboxLists[i].active == 'active') {
          this.selecteditems.push({
            message_id: this.inboxLists[i].message_id,
            sender_id: this.inboxLists[i].sender_id,
            messages_subject: this.inboxLists[i].messages_subject,
            message_body: this.inboxLists[i].message_body,
            message_body_html: this.inboxLists[i].message_body_html,
            message_date: this.inboxLists[i].message_date,
            message_date_mobileview: this.inboxLists[i].message_date_mobileview,
            message_date_mobileview_list: this.inboxLists[i].message_date_mobileview_list,
            is_favorite: this.inboxLists[i].is_favorite,
            message_readstatus: this.inboxLists[i].message_readstatus,
            message_priority: this.inboxLists[i].message_priority,
            priority_image: this.inboxLists[i].priority_image,
            isreply: this.inboxLists[i].isreply,
            time_ago: this.inboxLists[i].time_ago,
            receiver_id: this.inboxLists[i].receiver_id,
            attachments: this.inboxLists[i].attachments,
            sendername: this.inboxLists[i].sendername,
            senderphoto: this.inboxLists[i].senderphoto,
            personalhashtag: this.inboxLists[i].personalhashtag,
            replyall: this.inboxLists[i].replyall,
            duration: this.inboxLists[i].duration
          });
        }
      }
    } else {
      if (this.sendLists[index]) {
        if (this.sendLists[index].active == '') {
          this.sendLists[index].active = 'active';
          this.sendLists[index].logo = 'assets/imgs/tick_white_background.png';
        } else {
          this.sendLists[index].active = '';
          this.sendLists[index].logo = 'assets/imgs/tick_white_background.png';
        }
      }



      for (let i = 0; i < this.sendLists.length; i++) {
        if (this.sendLists[i].active == 'active') {
          this.selecteditems.push({
            message_id: this.sendLists[i].message_id,
            sender_id: this.sendLists[i].sender_id,
            messages_subject: this.sendLists[i].messages_subject,
            message_body: this.sendLists[i].message_body,
            message_body_html: this.sendLists[i].message_body_html,
            message_date: this.sendLists[i].message_date,
            message_date_mobileview: this.sendLists[i].message_date_mobileview,
            message_date_mobileview_list: this.sendLists[i].message_date_mobileview_list,
            is_favorite: this.sendLists[i].is_favorite,
            message_readstatus: this.sendLists[i].message_readstatus,
            message_priority: this.sendLists[i].message_priority,
            priority_image: this.sendLists[i].priority_image,
            isreply: this.sendLists[i].isreply,
            time_ago: this.sendLists[i].time_ago,
            receiver_id: this.sendLists[i].receiver_id,
            attachments: this.sendLists[i].attachments,
            sendername: this.sendLists[i].sendername,
            senderphoto: this.sendLists[i].senderphoto,
            personalhashtag: this.sendLists[i].personalhashtag,
            replyall: this.sendLists[i].replyall,
            duration: this.sendLists[i].duration
          });
        }
      }

    }
  }
  released() {
  }
  resettoback() {
    this.selectallopenpop = 0;
    this.moreopenpop = 0;
    this.inboxLists = [];
    this.inb();
    this.sendLists = [];
    this.snd()
    this.selecteditems = [];
  }
  selectalltip(selectallopenorclose) {
    this.moreopenpop = 0;
    if (selectallopenorclose == 1) {
      this.selectallopenpop = 1;
      this.selectallopenorclose = 0;
      // this.close = 0;
    }
    if (selectallopenorclose == 0) {
      this.selectallopenpop = 0;
      this.selectallopenorclose = 1;
      //this.close = 1;
    }
  }
  moretip(moreopenorclose) {
    this.selectallopenpop = 0;
    if (moreopenorclose == 1) {
      this.moreopenpop = 1;
      this.moreopenorclose = 0;
      // this.close = 0;
    }
    if (moreopenorclose == 0) {
      this.moreopenpop = 0;
      this.moreopenorclose = 1;
      //this.close = 1;
    }
  }
  selectAll() {
    this.selecteditems = [];
    if (this.onholdselectinboxsend == 'inbox') {
      for (let i = 0; i < this.inboxLists.length; i++) {
        this.inboxLists[i].active = 'active';
        this.inboxLists[i].logo = 'assets/imgs/tick_white_background.png';
        this.selecteditems.push({
          message_id: this.inboxLists[i].message_id,
          sender_id: this.inboxLists[i].sender_id,
          messages_subject: this.inboxLists[i].messages_subject,
          message_body: this.inboxLists[i].message_body,
          message_body_html: this.inboxLists[i].message_body_html,
          message_date: this.inboxLists[i].message_date,
          message_date_mobileview: this.inboxLists[i].message_date_mobileview,
          message_date_mobileview_list: this.inboxLists[i].message_date_mobileview_list,
          is_favorite: this.inboxLists[i].is_favorite,
          message_readstatus: this.inboxLists[i].message_readstatus,
          message_priority: this.inboxLists[i].message_priority,
          priority_image: this.inboxLists[i].priority_image,
          isreply: this.inboxLists[i].isreply,
          time_ago: this.inboxLists[i].time_ago,
          receiver_id: this.inboxLists[i].receiver_id,
          attachments: this.inboxLists[i].attachments,
          sendername: this.inboxLists[i].sendername,
          senderphoto: this.inboxLists[i].senderphoto,
          personalhashtag: this.inboxLists[i].personalhashtag,
          replyall: this.inboxLists[i].replyall,
          duration: this.inboxLists[i].duration
        }
        );
      }
    } else {
      for (let i = 0; i < this.sendLists.length; i++) {
        this.sendLists[i].active = 'active';
        this.sendLists[i].logo = 'assets/imgs/tick_white_background.png';
        this.selecteditems.push({
          message_id: this.sendLists[i].message_id,
          sender_id: this.sendLists[i].sender_id,
          messages_subject: this.sendLists[i].messages_subject,
          message_body: this.sendLists[i].message_body,
          message_body_html: this.sendLists[i].message_body_html,
          message_date: this.sendLists[i].message_date,
          message_date_mobileview: this.sendLists[i].message_date_mobileview,
          message_date_mobileview_list: this.sendLists[i].message_date_mobileview_list,
          is_favorite: this.sendLists[i].is_favorite,
          message_readstatus: this.sendLists[i].message_readstatus,
          message_priority: this.sendLists[i].message_priority,
          priority_image: this.sendLists[i].priority_image,
          isreply: this.sendLists[i].isreply,
          time_ago: this.sendLists[i].time_ago,
          receiver_id: this.sendLists[i].receiver_id,
          attachments: this.sendLists[i].attachments,
          sendername: this.sendLists[i].sendername,
          senderphoto: this.sendLists[i].senderphoto,
          personalhashtag: this.sendLists[i].personalhashtag,
          replyall: this.sendLists[i].replyall,
          duration: this.sendLists[i].duration
        }
        );
      }
    }
  }

}
