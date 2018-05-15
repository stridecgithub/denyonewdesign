import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams, AlertController, Events, Platform, ModalController, ToastController, App } from 'ionic-angular';
import { Config } from '../../config/config';
import { Http, Headers, RequestOptions } from '@angular/http';
import { NotificationPage } from '../notification/notification';
import { MessagesPage } from '../messages/messages';
import { UnitdetailsPage } from '../unitdetails/unitdetails';
import { Push, PushObject, PushOptions } from '@ionic-native/push';
import { EventDetailsPage } from '../event-details/event-details';
import { EventDetailsEventPage } from '../event-details-event/event-details-event';
import { ServicingDetailsPage } from '../servicing-details/servicing-details';
import { MessageDetailViewPage } from '../message-detail-view/message-detail-view';
import { CommentdetailsPage } from '../commentdetails/commentdetails';
import { ModalPage } from '../modal/modal';
import { ViewunitPage } from '../viewunit/viewunit';
declare let google;
declare var jQuery: any;
import { AddUnitPage } from "../add-unit/add-unit";
import { MockProvider } from '../../providers/pagination/pagination';
//import { Network } from '@ionic-native/network';
//import { LocalNotifications } from '@ionic-native/local-notifications';
//import { LoginPage } from '../login/login';
//import { PermissionPage } from '../permission/permission';
/**
 * Generated class for the DashboardPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html',
  providers: [Push, Config]//
})

export class DashboardPage {
  footerBar: number = 0;
  tabIndexVal;
  @ViewChild('map') mapElement: ElementRef;
  public map: any;
  public alarms: string = "0";
  public warningcount: string = "0";
  public runningcount: string = "0";
  public readycount: string = "0";
  public offlinecount: string = "0";
  public tabs: string = 'mapView';
  public unitsPopups: any;
  selectallopenpop = 0;
  moreopenpop = 0;
  selectallopenorclose = 1;
  moreopenorclose = 1;
  connected;
  disconnected;
  private apiServiceURL: string = '';
  public totalCount: number;
  public totalCountList: number;
  public unitAllLists = [];
  public defaultUnitAllLists = [];
  public arrayid = [];
  public reportData: any =
    {
      status: '',
      sort: 'unit_id',
      sortascdesc: 'desc',
      startindex: 0,
      results: 200000
    };
  public sortLblTxt: string = 'Favourites';
  testRadioOpen: boolean;
  testRadioResult;
  public companyId: any;
  public userId: any;
  public msgcount: any;
  public notcount: any;
  public profilePhoto;
  firstname;
  lastname;
  companyGroupName;
  dashboardhighlight;
  rolePermissionMsg;
  pushnotifycount;
  page;
  alert: any;
  segmenttabshow;
  pages: Array<{ title: string, component: any, icon: string, color: any, background: any }>;
  //
  public MAPVIEWACCESS: any;
  public UNITVIEWACCESS: any;
  public UNITEDITACCESS: any;
  public UNITHIDEACCESS: any;

  previousPage;
  public selecteditems = [];
  items: any;
  isInfiniteHide: boolean;
  pageperrecord;
  constructor(private mockProvider: MockProvider, private app: App, public toastCtrl: ToastController, public modalCtrl: ModalController, private push: Push, public alertCtrl: AlertController, public platform: Platform, public navCtrl: NavController, public NP: NavParams, public navParams: NavParams, private conf: Config, private http: Http, public events: Events) {
    this.isInfiniteHide = true;
    this.totalCount = 0;
    this.totalCountList = 0;
    this.platform.ready().then(() => {
      this.platform.registerBackButtonAction(() => {
        const overlayView = this.app._appRoot._overlayPortal._views[0];
        if (overlayView && overlayView.dismiss) {
          overlayView.dismiss();
        }
        if (this.navCtrl.canGoBack()) {
          this.navCtrl.pop();
        } else {
          if (this.alert) {
            this.alert.dismiss();
            this.alert = null;
          } else {
            this.showAlertExist();
          }
        }
      });

      this.previousPage = this.navCtrl.getActive().name;
      this.tabIndexVal = localStorage.getItem("tabIndex");
      this.initPushNotification();
    });
    this.apiServiceURL = this.conf.apiBaseURL();
    this.pageperrecord = this.conf.pagePerRecord();

    //this.pageperrecord = 6;
    this.profilePhoto = localStorage.getItem("userInfoPhoto");
    if (this.profilePhoto == '' || this.profilePhoto == 'null') {
      this.profilePhoto = this.apiServiceURL + "/images/default.png";
    } else {
      this.profilePhoto = this.apiServiceURL + "/staffphotos/" + this.profilePhoto;
    }

    this.pages = [
      { title: 'Dashboard', component: '', icon: 'dashboard', color: 'gray', background: 'gray' },
      { title: 'Units', component: '', icon: 'units', color: 'gray', background: 'gray' },
      { title: 'Calendar', component: '', icon: 'calendar', color: 'gray', background: 'gray' },
      { title: 'Message', component: '', icon: 'messages', color: 'gray', background: 'gray' },
      { title: 'Reports', component: '', icon: 'reports', color: 'gray', background: 'gray' },
      { title: 'Settings', component: '', icon: 'settings', color: 'gray', background: 'gray' },
      { title: 'Logout', component: '', icon: 'logout', color: 'gray', background: 'gray' }
    ];
    // this.totalCount = 0;
  }

  presentModal(unit) {
    let modal = this.modalCtrl.create(ModalPage, { unitdata: unit });
    modal.present();
  }

  isNet() {
    let isNet = localStorage.getItem("isNet");
    if (isNet == 'offline') {
      this.conf.networkErrorNotification('You are now ' + isNet + ', Please check your network connection');
    }

  }

  displayNetworkUpdate(connectionState: string) {
    // let networkType = this.network.type;
  }
  ionViewWillLeave() {
    this.tabIndexVal = localStorage.getItem("tabIndex");
  }
  ionViewDidLoad() {
    this.selectallopenpop = 0;
    this.moreopenpop = 0;

    this.UNITEDITACCESS = localStorage.getItem("DASHBOARD_UNITS_EDIT");
    this.UNITHIDEACCESS = localStorage.getItem("DASHBOARD_UNITS_HIDE");
    this.MAPVIEWACCESS = localStorage.getItem("DASHBOARD_MAP_VIEW");
    this.UNITVIEWACCESS = localStorage.getItem("DASHBOARD_UNITS_VIEW");

    localStorage.setItem("tabIndex", "0");
    this.tabIndexVal = localStorage.getItem("tabIndex");
    this.dashboardhighlight = this.navParams.get('dashboardselected');



    this.conf.showfooter();
    let mapView = document.getElementById('mapView');
    let listView = document.getElementById('listView');
    if (this.navParams.get("tabs") != undefined) {
      if (this.navParams.get("tabs") == 'mapView') {
        mapView.style.display = 'block';
        listView.style.display = 'none';
      } else {
        mapView.style.display = 'none';
        listView.style.display = 'block';
      }
    }
    this.companyId = localStorage.getItem("userInfoCompanyId");
    this.userId = localStorage.getItem("userInfoId");
    if (this.userId == 'undefined') {
      this.userId = '';
    }
    if (this.userId == undefined) {
      this.userId = '';
    }
    if (this.userId == 'null') {
      this.userId = '';
    }
    if (this.userId == null) {
      this.userId = '';
    }
    if (this.userId != "") {
      this.companyId = localStorage.getItem("userInfoCompanyId");
      this.userId = localStorage.getItem("userInfoId");

    } else {
      this.events.subscribe('user:created', (user, time) => {
        // user and time are the same arguments passed in `events.publish(user, time)`


        this.companyId = user.company_id;
        this.userId = user.staff_id

      });
    }
    if (this.UNITVIEWACCESS == 1 && this.MAPVIEWACCESS == 0) {

      jQuery('#maptab').hide();
      jQuery('#unittab').show();
      mapView.style.display = 'none';
      listView.style.display = 'block';
      this.rolePermissionMsg = '';
      this.segmenttabshow = 0;
    } else if (this.UNITVIEWACCESS == 0 && this.MAPVIEWACCESS == 0) {

      jQuery('#maptab').hide();
      jQuery('#unittab').hide();
      mapView.style.display = 'none';
      listView.style.display = 'none';
      this.rolePermissionMsg = this.conf.rolePermissionMsg();
      this.segmenttabshow = 0;
    } else if (this.UNITVIEWACCESS == 1 && this.MAPVIEWACCESS == 1) {

      jQuery('#maptab').show();
      jQuery('#unittab').show();
      mapView.style.display = 'block';
      listView.style.display = 'none';
      this.rolePermissionMsg = '';
      this.segmenttabshow = 1;
    } else if (this.UNITVIEWACCESS == 0 && this.MAPVIEWACCESS == 1) {
      this.rolePermissionMsg = '';

      jQuery('#maptab').show();
      jQuery('#unittab').hide();
      mapView.style.display = 'block';
      listView.style.display = 'none';
      this.segmenttabshow = 0;
    }
  }


  ionViewDidEnter() {

    this.UNITEDITACCESS = localStorage.getItem("DASHBOARD_UNITS_EDIT");
    this.UNITHIDEACCESS = localStorage.getItem("DASHBOARD_UNITS_HIDE");
    this.MAPVIEWACCESS = localStorage.getItem("DASHBOARD_MAP_VIEW");
    this.UNITVIEWACCESS = localStorage.getItem("DASHBOARD_UNITS_VIEW");
    localStorage.setItem("tabIndex", "0");
    this.tabIndexVal = localStorage.getItem("tabIndex");
    this.dashboardhighlight = this.navParams.get('dashboardselected');
    this.conf.showfooter();
    let mapView = document.getElementById('mapView');
    let listView = document.getElementById('listView');
    if (this.navParams.get("tabs") != undefined) {
      if (this.navParams.get("tabs") == 'mapView') {
        mapView.style.display = 'block';
        listView.style.display = 'none';
      } else {
        mapView.style.display = 'none';
        listView.style.display = 'block';
      }
    }
    this.companyId = localStorage.getItem("userInfoCompanyId");
    this.userId = localStorage.getItem("userInfoId");
    if (this.userId == 'undefined') {
      this.userId = '';
    }
    if (this.userId == undefined) {
      this.userId = '';
    }
    if (this.userId == 'null') {
      this.userId = '';

    }
    if (this.userId == null) {
      this.userId = '';

    }
    if (this.userId != "") {
      this.companyId = localStorage.getItem("userInfoCompanyId");
      this.userId = localStorage.getItem("userInfoId");
      this.doUnit();
      this.doNotifiyCount();
      // Initiate G Map
      this.initMap();
    } else {
      this.events.subscribe('user:created', (user, time) => {
        this.companyId = user.company_id;
        this.userId = user.staff_id
        this.doUnit();
        this.doNotifiyCount();
        // Initiate G Map
        this.initMap();
      });
    }
    if (this.UNITVIEWACCESS == 1 && this.MAPVIEWACCESS == 0) {
      jQuery('#maptab').hide();
      jQuery('#unittab').show();
      mapView.style.display = 'none';
      listView.style.display = 'block';
      this.rolePermissionMsg = '';
      this.segmenttabshow = 0;
    } else if (this.UNITVIEWACCESS == 0 && this.MAPVIEWACCESS == 0) {
      jQuery('#maptab').hide();
      jQuery('#unittab').hide();
      mapView.style.display = 'none';
      listView.style.display = 'none';
      this.rolePermissionMsg = this.conf.rolePermissionMsg();
      this.segmenttabshow = 0;
    } else if (this.UNITVIEWACCESS == 1 && this.MAPVIEWACCESS == 1) {
      jQuery('#maptab').show();
      jQuery('#unittab').show();
      mapView.style.display = 'block';
      listView.style.display = 'none';
      this.rolePermissionMsg = '';
      this.segmenttabshow = 1;
    } else if (this.UNITVIEWACCESS == 0 && this.MAPVIEWACCESS == 1) {
      this.rolePermissionMsg = '';
      jQuery('#maptab').show();
      jQuery('#unittab').hide();
      mapView.style.display = 'block';
      listView.style.display = 'none';
      this.segmenttabshow = 0;
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


  /****************************/
  /*@doUnit calling on unit */

  /****************************/
  doUnit() {
    //this.items = [];
    this.conf.presentLoading(1);
    if (this.reportData.status == '') {
      this.reportData.status = "DRAFT";
    }
    if (this.reportData.sort == '') {
      this.reportData.sort = "vendor";
    }
    let type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      //url: any = this.apiServiceURL + "/units?is_mobile=1&startindex=" + this.reportData.startindex + "&results=" + this.reportData.results + "&sort=" + this.reportData.sort + "&dir=" + this.reportData.sortascdesc + "&company_id=" + this.companyId + "&loginid=" + this.userId;
      url: any = this.apiServiceURL + "/dashboard?is_mobile=1&startindex=" + this.reportData.startindex + "&results=" + this.reportData.results + "&sort=" + this.reportData.sort + "&dir=" + this.reportData.sortascdesc + "&loginid=" + this.userId + "&company_id=" + this.companyId;

    let res;
    this.http.get(url, options)
      .subscribe((data) => {
        this.conf.presentLoading(0);
        res = data.json();
        if (res.totalCount > 0) {

          for (let unit in res.units) {
            let cname = res.units[unit].unitgroup_name;

            if (cname != 'undefined' && cname != undefined) {
              let stringToSplit = cname;
              let x = stringToSplit.split("");
              cname = x[0].toUpperCase();
            } else {
              cname = '';
            }
            this.unitAllLists.push({
              unit_id: res.units[unit].unit_id,
              unitname: res.units[unit].unitname,
              location: res.units[unit].location,
              projectname: res.units[unit].projectname,
              colorcode: res.units[unit].colorcode,
              contacts: res.units[unit].contacts,
              nextservicedate: res.units[unit].nextservicedate,
              controllerid: res.units[unit].controllerid,
              neaplateno: res.units[unit].neaplateno,
              companys_id: res.units[unit].companys_id,
              unitgroups_id: res.units[unit].unitgroups_id,
              serial_number: res.units[unit].serialnumber,
              models_id: res.units[unit].models_id,
              alarmnotificationto: res.units[unit].alarmnotificationto,
              genstatus: res.units[unit].genstatus,
              favoriteindication: res.units[unit].favorite,
              lat: res.units[unit].latitude,
              lng: res.units[unit].longtitude,
              runninghr: res.units[unit].runninghr,
              companygroup_name: cname,
              mapicon: res.units[unit].mapicon,
              viewonid: res.units[unit].viewonid,
              logo: "assets/imgs/square.png",
              active: ""

            });
            this.items = this.mockProvider.getData(this.unitAllLists, 0, this.pageperrecord);
          }

          this.totalCountList = res.totalCount;
          this.reportData.startindex += this.reportData.results;
        }

        if (this.items.length == 0) {
          this.totalCountList = 0;
        }
      }, error => {

      });

  }

  
 

  // List page navigate to notification list
  notification() {
    // Navigate the notification list page
    this.navCtrl.setRoot(NotificationPage);
  }


  messages() {
    this.navCtrl.setRoot(MessagesPage);
  }

  // Favorite Action

  favorite(unit_id) {
    this.isInfiniteHide = true;
    this.reportData.startindex = 0;
    this.unitAllLists = [];
    let body: string = "unitid=" + unit_id + "&is_mobile=1" + "&loginid=" + this.userId,
      type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + "/setdashboardfavorite";
    this.http.post(url, body, options)
      .subscribe(data => {
        let res = data.json();


        if (res.totalCount > 0) {
          for (let unit in res.units) {
            let cname = res.units[unit].unitgroup_name;

            if (cname != 'undefined' && cname != undefined) {
              let stringToSplit = cname;
              let x = stringToSplit.split("");
              cname = x[0].toUpperCase();
            } else {
              cname = '';
            }

            this.unitAllLists.push({
              unit_id: res.units[unit].unit_id,
              unitname: res.units[unit].unitname,
              location: res.units[unit].location,
              contacts: res.units[unit].contacts,
              projectname: res.units[unit].projectname,
              colorcode: res.units[unit].colorcode,
              nextservicedate: res.units[unit].nextservicedate,
              neaplateno: res.units[unit].neaplateno,
              companys_id: res.units[unit].companys_id,
              unitgroups_id: res.units[unit].unitgroups_id,
              models_id: res.units[unit].models_id,
              serial_number: res.units[unit].serialnumber,
              alarmnotificationto: res.units[unit].alarmnotificationto,
              favoriteindication: res.units[unit].favorite,
              genstatus: res.units[unit].genstatus,
              lat: res.units[unit].latitude,
              lng: res.units[unit].longtitude,
              runninghr: res.units[unit].runninghr,
              mapicon: res.units[unit].mapicon,
              companygroup_name: cname,
              viewonid: res.units[unit].viewonid,
              logo: "assets/imgs/square.png",
              active: ""
            });
            this.items = this.mockProvider.getData(this.unitAllLists, 0, this.pageperrecord);
          }
          //this.unitAllLists = res.units;
          this.totalCountList = res.totalCount;
          this.reportData.startindex += this.reportData.results;
        }

        // If the request was successful notify the user
        if (data.status === 200) {
          if (res.favorite == 0) {
            //this.conf.sendNotification("Unfavorited successfully");
            this.conf.sendNotification(res.msg['result']);
          } else {
            //this.conf.sendNotification("Favourite successfully");
            this.conf.sendNotification(res.msg['result']);
          }


        }
        // Otherwise let 'em know anyway
        else {
          this.conf.sendNotification('Something went wrong!');
        }
      }, error => {

      });
    //this.doUnit();
  }


  /**
   * Segment Changed
   */
  segmentChanged(e) {
    this.doUnit();
    this.initMap();

    let mapView = document.getElementById('mapView');
    let listView = document.getElementById('listView');

    if (e._value == 'mapView') {
      mapView.style.display = 'block';
      listView.style.display = 'none';
    } else {
      mapView.style.display = 'none';
      listView.style.display = 'block';
    }

  }


  /**
   * Initiate G Map
   */
  initMap() {

    // Setting up for API call
    let type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + "/dashboard?is_mobile=1&startindex=0&results=" + this.reportData.results + "&sort=unit_id&dir=asc&loginid=" + this.userId + "&company_id=" + this.companyId;

    // API Request
    this.http.get(url, options)
      .subscribe((data) => {

        // JSON data
        let res = data.json();
        this.totalCount = res.totalCount;


        if (res.totalCount > 0) {        // Map overlay circles
          this.alarms = res.trippedcount;
          this.warningcount = res.warningcount;
          this.runningcount = res.runningcount;
          this.readycount = res.readycount;
          this.offlinecount = res.offlinecount;
        } else {
          this.alarms = '0';
          this.warningcount = '0';
          this.runningcount = '0';
          this.readycount = '0';
          this.offlinecount = '0';
        }


        if (res.units == undefined) {
          this.defaultUnitAllLists.push({
            unitname: '',
            longtitude: '103.70307100000002',
            latitude: '1.3249773'
          })
          // Load G Map
          this.loadMap(this.defaultUnitAllLists, 0);
          // Units popups
          this.unitsPopups = this.defaultUnitAllLists;
        } else if (res.units == 'undefined') {

          this.defaultUnitAllLists.push({
            unitname: '',
            longtitude: '103.70307100000002',
            latitude: '1.3249773'
          })
          // Load G Map
          this.loadMap(this.defaultUnitAllLists, 0);
          // Units popups
          this.unitsPopups = this.defaultUnitAllLists;
        } else if (res.units == '') {
          this.defaultUnitAllLists.push({
            unitname: '',
            longtitude: '103.70307100000002',
            latitude: '1.3249773'
          })
          // Load G Map
          this.loadMap(this.defaultUnitAllLists, 0);
          // Units popups
          this.unitsPopups = this.defaultUnitAllLists;
        } else {


          // Load G Map
          this.loadMap(res.units, 1);
          // Units popups
          this.unitsPopups = res.units;

        }

      });

  }


  /**
   * Load G Map
   *
   * @param units
   */
  loadMap(units, unitsavail) {



    // Units

    let markers = units;

    // Maps styles
    let mapStyle = [
      {
        "featureType": "all",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "saturation": 36
          },
          {
            "color": "#333333"
          },
          {
            "lightness": 40
          }
        ]
      },
      {
        "featureType": "all",
        "elementType": "labels.text.stroke",
        "stylers": [
          {
            "visibility": "on"
          },
          {
            "color": "#ffffff"
          },
          {
            "lightness": 16
          }
        ]
      },
      {
        "featureType": "all",
        "elementType": "labels.icon",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "administrative",
        "elementType": "geometry.fill",
        "stylers": [
          {
            "color": "#ffffff"
          },
          {
            "lightness": 20
          }
        ]
      },
      {
        "featureType": "administrative",
        "elementType": "geometry.stroke",
        "stylers": [
          {
            "color": "#fefefe"
          },
          {
            "lightness": 17
          },
          {
            "weight": 1.2
          }
        ]
      },
      {
        "featureType": "landscape",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#f5f5f5"
          },
          {
            "lightness": 20
          }
        ]
      },
      {
        "featureType": "landscape.man_made",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#e6e6e6"
          }
        ]
      },
      {
        "featureType": "poi",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#f5f5f5"
          },
          {
            "lightness": 21
          }
        ]
      },
      {
        "featureType": "poi.park",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#dadada"
          }
        ]
      },
      {
        "featureType": "road.highway",
        "elementType": "geometry.fill",
        "stylers": [
          {
            "color": "#acacac"
          },
          {
            "lightness": 17
          }
        ]
      },
      {
        "featureType": "road.highway",
        "elementType": "geometry.stroke",
        "stylers": [
          {
            "lightness": 29
          },
          {
            "weight": 0.2
          },
          {
            "color": "#ffffff"
          }
        ]
      },
      {
        "featureType": "road.arterial",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#bcbcbc"
          },
          {
            "lightness": 18
          }
        ]
      },
      {
        "featureType": "road.arterial",
        "elementType": "geometry.stroke",
        "stylers": [
          {
            "color": "#f3f3f3"
          }
        ]
      },
      {
        "featureType": "road.local",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#ffffff"
          },
          {
            "lightness": 16
          }
        ]
      },
      {
        "featureType": "road.local",
        "elementType": "geometry.stroke",
        "stylers": [
          {
            "color": "#d7d7d7"
          }
        ]
      },
      {
        "featureType": "transit.line",
        "elementType": "geometry.fill",
        "stylers": [
          {
            "color": "#ffffff"
          }
        ]
      },
      {
        "featureType": "transit.station.airport",
        "elementType": "labels.icon",
        "stylers": [
          {
            "color": "#000000"
          }
        ]
      },
      {
        "featureType": "transit.station.bus",
        "elementType": "labels.icon",
        "stylers": [
          {
            "color": "#ff0000"
          }
        ]
      },
      {
        "featureType": "transit.station.rail",
        "elementType": "labels.icon",
        "stylers": [
          {
            "color": "#000000"
          }
        ]
      },
      {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#989898"
          },
          {
            "lightness": 17
          }
        ]
      }
    ];

    let bounds = new google.maps.LatLngBounds();
    let latLngmapoption;
    let zoomlevel = 8;
    if (markers.length == 1) {
      zoomlevel = 10;
      latLngmapoption = new google.maps.LatLng(markers[0].latitude, markers[0].longtitude);
    } else if (markers.length > 1) {
      zoomlevel = 5;
      latLngmapoption = new google.maps.LatLng(markers[0].latitude, markers[0].longtitude);
    } else {
      zoomlevel = 18;
      latLngmapoption = new google.maps.LatLng(1.32, 103.701);
    }

    // Map options
    let mapOptions = {
      styles: mapStyle,
      disableDefaultUI: true,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      center: latLngmapoption,
      zoom: 18
    }


    // Create map
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

    // Use unit location for info box content
    let infowindow = new google.maps.InfoWindow({
      content: ''
    });

    //if (units > 0) {
    // Loop to go through all generators Lat Lang
    for (let i = 0; i < markers.length; i++) {
      if (markers[i].latitude == 0 || markers[i].longtitude == 0) {

      } else {


        let latLng = new google.maps.LatLng(markers[i].latitude, markers[i].longtitude);

        bounds.extend(latLng);

        let iconDisplay;
        if (unitsavail == 0) {
          iconDisplay = 'assets/imgs/marker-white-default.png';
        } else {
          if (markers[i].mapicon != '') {
            iconDisplay = 'assets/imgs/marker-' + markers[i].mapicon + '.png';
          } else {
            iconDisplay = 'assets/imgs/marker-' + 'white-default.png';
          }

          //}


        }
        let marker = new google.maps.Marker({
          position: latLng,
          map: this.map,
          title: markers[i].unitname,
          icon: iconDisplay
        });



        google.maps.event.addListener(infowindow, 'closeclick', function () {
          let popups = document.getElementsByClassName('popup');
          for (let i = 0; i < popups.length; i++) {
            popups[i].classList.remove('showPopup');

          }

        });

        // let currinfowindow = null;


        // Add click event
        marker.addListener('click', function () {

          // Use unit location for info box content
          infowindow.setContent(markers[i].location);
          infowindow.open(this.map, marker);

          let popups = document.getElementsByClassName('popup');
          let popup = document.getElementById(markers[i].unit_id);

          for (let i = 0; i < popups.length; i++) {
            popups[i].classList.remove('showPopup');

          }

          popup.classList.add('showPopup');

        });


      }

    }


    //}
    // Automatically center the map fitting all markers on the screen
    //this.map.setZoom(11);
    //this.map.fitBounds(bounds);

    // Override our map zoom level once our fitBounds function runs (Make sure it only runs once)
    let boundsListener = google.maps.event.addListener((this.map), 'bounds_changed', function (event) {
      this.setZoom(zoomlevel);
      google.maps.event.removeListener(boundsListener);
    });


  }



  doSort() {
    this.isInfiniteHide = true;
    let prompt = this.alertCtrl.create({
      title: 'Sort By',
      inputs: [
        {
          type: 'radio',
          label: 'Favourites',
          value: 'favorite'
        },
        {
          type: 'radio',
          label: 'Unit Name',
          value: 'unitname',
        },
        {
          type: 'radio',
          label: 'Unit Group',
          value: 'unitgroup',
        },
        {
          type: 'radio',
          label: 'Status',
          value: 'status',
        },
        /*{
          type: 'radio',
          label: 'Tripped',
          value: 'tripped',
        },
        {
          type: 'radio',
          label: 'Waring',
          value: 'warning',
        },
        {
          type: 'radio',
          label: 'Running',
          value: 'running',
        },
        {
          type: 'radio',
          label: 'Offline',
          value: 'offline',
        },*/




      ],
      buttons: [
        {
          text: 'Asc',
          handler: data => {
            if (data != undefined) {
              this.reportData.sort = data;
              this.reportData.sortascdesc = 'asc';
              if (data == 'unitname') {
                this.sortLblTxt = 'Unit Name';
              } else if (data == 'favorite') {
                this.sortLblTxt = 'Favourites';
              } else if (data == 'unitgroup') {
                this.sortLblTxt = 'Unit Group';
              } else if (data == 'status') {
                this.sortLblTxt = 'Status';
              }
              this.reportData.startindex = 0;
              this.unitAllLists = [];
              this.selecteditems = [];
              this.doUnit();
            }
          }
        },
        {
          text: 'Desc',
          handler: data => {
            if (data != undefined) {
              this.reportData.sort = data;
              this.reportData.sortascdesc = 'desc';
              if (data == 'unitname') {
                this.sortLblTxt = 'Unit Name';
              } else if (data == 'favorite') {
                this.sortLblTxt = 'Favourites';
              } else if (data == 'unitgroup') {
                this.sortLblTxt = 'Unit Group';
              } else if (data == 'status') {
                this.sortLblTxt = 'Status';
              }
              this.reportData.startindex = 0;
              this.unitAllLists = [];
              this.selecteditems = [];
              this.doUnit();
            }
          }
        }
      ]
    });
    prompt.present();
  }

  hideondash(id) {
    let confirm = this.alertCtrl.create({
      message: 'Are you sure you want to hide from dashboard?',
      buttons: [{
        text: 'Yes',
        handler: () => {
          this.hideondashboard(id);
        }
      },
      {
        text: 'No',
        handler: () => {
        }
      }]
    });
    confirm.present();
  }
  hideondashboard(id) {
    let urlstr = "/dashboardaction?id=" + id + "&action=hide&is_mobile=1&loginid=" + this.userId;
    let type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + urlstr;

    this.http.get(url, options)
      .subscribe((data) => {

        // If the request was successful notify the user
        if (data.status === 200) {
          //this.conf.sendNotification(`Dashboard hide action successfully updated`);
          this.conf.sendNotification(data.json().msg['result']);
          this.reportData.startindex = 0;
          this.unitAllLists = [];
          this.doUnit();
        }
        // Otherwise let 'em know anyway
        else {
          // this.conf.sendNotification('Something went wrong!');
        }
      }, error => {
        // this.networkType = this.conf.serverErrMsg();// + "\n" + error;
      });
  }
  doAction(item, act, unitId) {
    if (act == 'edit') {
      this.navCtrl.setRoot(AddUnitPage, {
        record: item,
        act: act,
        unitId: unitId,
        from: 'dashboard'
      });
      return false;
    } else if (act == 'detail') {

      localStorage.setItem("unitId", unitId);
      localStorage.setItem("iframeunitId", unitId);
      localStorage.setItem("unitunitname", item.unitname);
      localStorage.setItem("unitlocation", item.location);
      localStorage.setItem("unitprojectname", item.projectname);
      localStorage.setItem("unitcolorcode", item.colorcodeindications);
      if (item.lat == undefined) {
        item.lat = '';
      }
      if (item.lat == 'undefined') {
        item.lat = '';
      }

      if (item.lng == undefined) {
        item.lng = '';
      }
      if (item.lng == 'undefined') {
        item.lng = '';
      }



      if (item.runninghr == undefined) {
        item.runninghr = '';
      }
      if (item.runninghr == 'undefined') {
        item.runninghr = '';
      }

      if (item.nextservicedate == undefined) {
        item.nextservicedate = '';
      }
      if (item.nextservicedate == 'undefined') {
        item.nextservicedate = '';
      }


      localStorage.setItem("unitlat", item.lat);
      localStorage.setItem("unitlng", item.lng);
      localStorage.setItem("runninghr", item.runninghr);
      localStorage.setItem("nsd", item.nextservicedate);

      localStorage.setItem("microtime", "");
      this.navCtrl.setRoot(UnitdetailsPage, {
        record: item
      });
      return false;
    } else {
      /*  this.navCtrl.setRoot(ViewcompanygroupPage, {
         record: item,
         act: act
       });
       return false;*/
    }
  }
  pushTesting(type, event_id) {
    console.log("Type:"+type);
    console.log("Event Id:"+event_id);
    if (type == 'S') {
      this.navCtrl.setRoot(ServicingDetailsPage, {
        event_id: event_id,
        from: 'Push'
      });
    } else if (type == 'M') {
      this.navCtrl.setRoot(MessageDetailViewPage, {
        event_id:  event_id,
        from: 'push'
      })
    }else if (type == 'E') {
      this.navCtrl.setRoot(EventDetailsEventPage, {
        event_id:  event_id,
        from: 'Push'
      })
    }else if (type == 'C') {
      this.navCtrl.setRoot(CommentdetailsPage, {
        event_id:  event_id,
        from: 'Push'
      })
    }

    
  }


  initPushNotification() {
    // to check if we have permission
    this.push.hasPermission()
      .then((res: any) => {

        if (res.isEnabled) {

        } else {

        }

      });

    // to initialize push notifications


    const options: PushOptions = {
      android: {
        senderID: '7125886423',
        forceShow: false,
        vibrate: true,
        sound: 'true'
      },
      ios: {
        alert: 'true',
        badge: true,
        sound: 'true'
      },
      windows: {}
    };

    const pushObject: PushObject = this.push.init(options);


    if (this.userId != '') {// Shut off the condition push rejected
      pushObject.on('notification').subscribe((notification: any) => {

        this.pushnotifycount = 0;
        if (notification.additionalData.arrayval.type == 'M') {

          this.pushnotifycount = this.pushnotifycount + 1;

        }
        // this.showAlert('JSON Array Value', JSON.stringify(notification));
        if (notification.additionalData.foreground == true) {
          // this.doConfirmRead(notification)
          this.presentToast(notification);

        } else {
          this.pushDetail(notification);
        }
      }
      );
    }
    pushObject.on('registration').subscribe((registration: any) => {


      localStorage.setItem("deviceTokenForPushNotification", registration.registrationId);
    }
    );

    pushObject.on('error').subscribe(error => { });


  }

  presentToast(notification) {
    let toast = this.toastCtrl.create({
      message: notification.title + "\n" + notification.message,
      duration: 3000,
      position: 'top'
    });
    toast.present();
    toast.onDidDismiss(() => {
      this.pushDetail(notification);
    });
  }


  sampleToast(mssg) {
    let toast = this.toastCtrl.create({
      message: mssg,
      duration: 130000,
      cssClass: 'pushtoast',
      position: 'top'
    });
    toast.present();
    toast.onDidDismiss(() => {
    });
  }

  doConfirmRead(notification) {
    let confirm = this.alertCtrl.create({
      title: notification.title,
      message: notification.message,
      buttons: [{
        text: 'View',
        handler: () => {
          this.pushDetail(notification);
        }
      },
      {
        text: 'Cancel',
        handler: () => {
        }
      }]
    });
    confirm.present();
  }
  pushDetail(notification) {
    if (notification.additionalData.arrayval.type == 'M') {
      this.navCtrl.setRoot(MessageDetailViewPage, {
        event_id: notification.additionalData.arrayval.id,
        from: 'push'
      });
    }
    else if (notification.additionalData.arrayval.type == 'OA') {
      this.navCtrl.setRoot(EventDetailsPage, {
        event_id: notification.additionalData.arrayval.id,
        from: 'Push'
      });
    } else if (notification.additionalData.arrayval.type == 'A') {
      this.navCtrl.setRoot(EventDetailsPage, {
        event_id: notification.additionalData.arrayval.id,
        from: 'Push'
      });
      localStorage.setItem("fromModule", "AlarmdetailsPage");
    } else if (notification.additionalData.arrayval.type == 'C') {
      this.navCtrl.setRoot(CommentdetailsPage, {
        event_id: notification.additionalData.arrayval.id,
        from: 'Push'
      });
      localStorage.setItem("fromModule", "CommentdetailsPage");
    } else if (notification.additionalData.arrayval.type == 'E') {
      this.navCtrl.setRoot(EventDetailsEventPage, {
        event_id: notification.additionalData.arrayval.id,
        from: 'Push',
      });
      localStorage.setItem("fromModule", "CalendardetailPage");
    } else if (notification.additionalData.arrayval.type == 'S') {
      this.navCtrl.setRoot(ServicingDetailsPage, {
        event_id: notification.additionalData.arrayval.id,
        from: 'Push'
      });
      localStorage.setItem("fromModule", "ServicedetailsPage");
    }
  }

  showAlert(titl, msg) {
    let alert = this.alertCtrl.create({
      title: titl,
      subTitle: msg,
      buttons: ['OK']
    });
    alert.present();
  }



  pushNavigationTeseting() {
    /*
    this.navCtrl.setRoot(ServicingDetailsPage, {
      event_id: 520,
      from: 'Push'
    });
    */
    this.navCtrl.setRoot(EventDetailsPage, {
      event_id: 521,
      from: 'Push'
    });

  }

  showAlertExist() {
    this.alert = this.alertCtrl.create({
      title: 'Exit?',
      message: 'Do you want to exit the app?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            this.alert = null;
          }
        },
        {
          text: 'Exit',
          handler: () => {
            this.platform.exitApp();
          }
        }
      ]
    });
    this.alert.present();
  }
  pressed(item, index) {
    this.selecteditems = [];
    if (this.unitAllLists[index]) {
      if (this.unitAllLists[index].active == '') {
        this.unitAllLists[index].active = 'active';
        this.unitAllLists[index].logo = 'assets/imgs/tick_white_background.png';
      } else {
        this.unitAllLists[index].active = '';
        this.unitAllLists[index].logo = 'assets/imgs/tick_white_background.png';
      }
    }



    for (let i = 0; i < this.unitAllLists.length; i++) {
      if (this.unitAllLists[i].active == 'active') {

        let cname = this.unitAllLists[i].unitgroup_name;

        if (cname != 'undefined' && cname != undefined) {
          let stringToSplit = cname;
          let x = stringToSplit.split("");
          cname = x[0].toUpperCase();
        } else {
          cname = '';
        }

        this.selecteditems.push({
          unit_id: this.unitAllLists[i].unit_id,
          unitname: this.unitAllLists[i].unitname,
          location: this.unitAllLists[i].location,
          projectname: this.unitAllLists[i].projectname,
          colorcode: this.unitAllLists[i].colorcode,
          contacts: this.unitAllLists[i].contacts,
          nextservicedate: this.unitAllLists[i].nextservicedate,
          controllerid: this.unitAllLists[i].controllerid,
          neaplateno: this.unitAllLists[i].neaplateno,
          companys_id: this.unitAllLists[i].companys_id,
          unitgroups_id: this.unitAllLists[i].unitgroups_id,
          serial_number: this.unitAllLists[i].serialnumber,
          models_id: this.unitAllLists[i].models_id,
          alarmnotificationto: this.unitAllLists[i].alarmnotificationto,
          genstatus: this.unitAllLists[i].genstatus,
          favoriteindication: this.unitAllLists[i].favorite,
          mapicon: this.unitAllLists[i].mapicon,
          lat: this.unitAllLists[i].latitude,
          lng: this.unitAllLists[i].longtitude,
          runninghr: this.unitAllLists[i].runninghr,
          companygroup_name: cname,
          viewonid: this.unitAllLists[i].viewonid
        }
        );
      }
    }


  }
  released() {
  }
  resettoback(item) {
    this.unitAllLists = [];
    this.selectallopenpop = 0;
    this.moreopenpop = 0;
    this.selecteditems = [];
    for (let unit in item) {
      this.unitAllLists.push({
        unit_id: item[unit].unit_id,
        unitname: item[unit].unitname,
        location: item[unit].location,
        projectname: item[unit].projectname,
        colorcode: item[unit].colorcode,
        contacts: item[unit].contacts,
        nextservicedate: item[unit].nextservicedate,
        controllerid: item[unit].controllerid,
        neaplateno: item[unit].neaplateno,
        companys_id: item[unit].companys_id,
        unitgroups_id: item[unit].unitgroups_id,
        serial_number: item[unit].serialnumber,
        models_id: item[unit].models_id,
        alarmnotificationto: item[unit].alarmnotificationto,
        genstatus: item[unit].genstatus,
        favoriteindication: item[unit].favoriteindication,
        lat: item[unit].latitude,
        mapicon: item[unit].mapicon,
        lng: item[unit].longtitude,
        runninghr: item[unit].runninghr,
        companygroup_name: item[unit].companygroup_name,
        viewonid: item[unit].viewonid,
        logo: "assets/imgs/square.png",
        active: ""
      });
    }
    this.items = this.mockProvider.getData(this.unitAllLists, 0, this.pageperrecord);

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
    for (let i = 0; i < this.unitAllLists.length; i++) {
      this.unitAllLists[i].active = 'active';
      this.unitAllLists[i].logo = 'assets/imgs/tick_white_background.png';

      let cname = this.unitAllLists[i].unitgroup_name;

      if (cname != 'undefined' && cname != undefined) {
        let stringToSplit = cname;
        let x = stringToSplit.split("");
        cname = x[0].toUpperCase();
      } else {
        cname = '';
      }

      this.selecteditems.push({
        unit_id: this.unitAllLists[i].unit_id,
        unitname: this.unitAllLists[i].unitname,
        location: this.unitAllLists[i].location,
        projectname: this.unitAllLists[i].projectname,
        colorcode: this.unitAllLists[i].colorcode,
        contacts: this.unitAllLists[i].contacts,
        nextservicedate: this.unitAllLists[i].nextservicedate,
        controllerid: this.unitAllLists[i].controllerid,
        neaplateno: this.unitAllLists[i].neaplateno,
        companys_id: this.unitAllLists[i].companys_id,
        unitgroups_id: this.unitAllLists[i].unitgroups_id,
        serial_number: this.unitAllLists[i].serialnumber,
        models_id: this.unitAllLists[i].models_id,
        alarmnotificationto: this.unitAllLists[i].alarmnotificationto,
        genstatus: this.unitAllLists[i].genstatus,
        favoriteindication: this.unitAllLists[i].favorite,
        lat: this.unitAllLists[i].latitude,
        mapicon: this.unitAllLists[i].mapicon,
        lng: this.unitAllLists[i].longtitude,
        runninghr: this.unitAllLists[i].runninghr,
        companygroup_name: cname,
        viewonid: this.unitAllLists[i].viewonid
      }
      );

    }
  }

  onholdaction(action) {
    this.isInfiniteHide = true;
    this.moreopenpop = 0;
    let str = '';
    this.arrayid = [];
    if (action == 'favorite') {
      for (let i = 0; i < this.selecteditems.length; i++) {
        this.arrayid.push(
          this.selecteditems[i].unit_id
        )
      }
    } else {
      for (let i = 0; i < this.selecteditems.length; i++) {
        str = str + this.selecteditems[i].viewonid + ",";
      }
    }



    str = str.replace(/,\s*$/, "");
    if (action == 'view') {
      //let modal = this.modalCtrl.create(ViewunitPage, { item: this.selecteditems });
      //modal.present();
      this.navCtrl.setRoot(ViewunitPage, { item: this.selecteditems, 'from': 'dashboard' });
    } else if (action == 'remove') {
      let confirm = this.alertCtrl.create({
        message: 'Are you sure you want to remove this unit from dashboard?',
        buttons: [{
          text: 'Yes',
          handler: () => {

            let urlstr;
            urlstr = "/onholddashboardaction?id=" + str + "&action=hide&is_mobile=1&loginid=" + this.userId;
            let type: string = "application/x-www-form-urlencoded; charset=UTF-8",
              headers: any = new Headers({ 'Content-Type': type }),
              options: any = new RequestOptions({ headers: headers }),
              url: any = this.apiServiceURL + urlstr;
            this.http.get(url, options)
              .subscribe((data) => {
                if (data.status === 200) {


                  this.reportData.startindex = 0;
                  this.unitAllLists = [];
                  /*let res = data.json();
                  if (res.totalCount > 0) {
                    for (let unit in res.units) {
                      let cname = res.units[unit].unitgroup_name;

                      if (cname != 'undefined' && cname != undefined) {
                        let stringToSplit = cname;
                        let x = stringToSplit.split("");
                        cname = x[0].toUpperCase();
                      } else {
                        cname = '';
                      }

                      this.unitAllLists.push({
                        unit_id: res.units[unit].unit_id,
                        unitname: res.units[unit].unitname,
                        location: res.units[unit].location,
                        contacts: res.units[unit].contacts,
                        projectname: res.units[unit].projectname,
                        colorcode: res.units[unit].colorcode,
                        nextservicedate: res.units[unit].nextservicedate,
                        neaplateno: res.units[unit].neaplateno,
                        companys_id: res.units[unit].companys_id,
                        unitgroups_id: res.units[unit].unitgroups_id,
                        models_id: res.units[unit].models_id,
                        serial_number: res.units[unit].serialnumber,
                        alarmnotificationto: res.units[unit].alarmnotificationto,
                        favoriteindication: res.units[unit].favorite,
                        genstatus: res.units[unit].genstatus,
                        lat: res.units[unit].latitude,
                        lng: res.units[unit].longtitude,
                        mapicon: res.units[unit].mapicon,
                        runninghr: res.units[unit].runninghr,
                        companygroup_name: cname,
                        viewonid: res.units[unit].viewonid,
                        logo: "assets/imgs/square.png",
                        active: ""
                      });
                      this.items = this.mockProvider.getData(this.unitAllLists, 0, this.pageperrecord);
                    }

                    this.totalCountList = res.totalCount;
                    this.reportData.startindex += this.reportData.results;
                  } */
                  this.items = [];
                  this.doUnit();
                  this.selecteditems = [];
                  this.conf.sendNotification(data.json().msg['result']);

                }
                // Otherwise let 'em know anyway
                else {
                }
              });
          }
        },
        {
          text: 'No',
          handler: () => { }
        }]
      });
      confirm.present();
    } else if (action == 'favorite') {
      let urlstr;
      urlstr = "/onholddashboardaction?id=" + this.arrayid + "&action=favorite&is_mobile=1&loginid=" + this.userId;
      //let bodymessage: string = "",
      let type1: string = "application/x-www-form-urlencoded; charset=UTF-8",
        headers1: any = new Headers({ 'Content-Type': type1 }),
        options1: any = new RequestOptions({ headers: headers1 }),
        url: any = this.apiServiceURL + urlstr;;
      let res;
      this.http.get(url, options1)
        .subscribe((data) => {
          res = data.json();
          if (data.status === 200) {

            this.selecteditems = [];
            this.unitAllLists = [];
            this.conf.sendNotification(data.json().msg.result);
            this.reportData.startindex = 0;
            this.doUnit();

            // this.conf.sendNotification(data.json().msg['result']);
          }
          // Otherwise let 'em know anyway
          else {
            // this.conf.sendNotification('Something went wrong!');
          }
        }, error => {

        });
    }
  }
  /**********************/
  /* Infinite scrolling */
  /**********************/
  doInfinite(infiniteScroll) {
    this.mockProvider.getAsyncData(this.unitAllLists, this.items.length, this.pageperrecord).then((newData) => {
      for (var i = 0; i < newData.length; i++) {
        this.items.push(newData[i]);
      }

      if (this.items.length >= this.totalCountList) {
        this.isInfiniteHide = false
      }
      infiniteScroll.complete();

    });
  }

}

