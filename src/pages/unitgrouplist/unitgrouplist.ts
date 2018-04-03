import { Component } from '@angular/core';
import { NavController, ToastController, AlertController, NavParams,Platform,App } from 'ionic-angular';
import 'rxjs/add/operator/map';
import { Http, Headers, RequestOptions } from '@angular/http';
//import { AddunitsonePage } from '../addunitsone/addunitsone';
import { LoadingController } from 'ionic-angular';
//import { DashboardPage } from '../dashboard/dashboard';
//import { UserPage } from '../user/user';
//import { MyaccountPage } from '../myaccount/myaccount';
import { UnitgroupPage } from '../unitgroup/unitgroup';
//import { CompanygroupPage } from '../companygroup/companygroup';
//mport { RolePage } from '../role/role';
import { UnitdetailsPage } from '../unitdetails/unitdetails';
import { NotificationPage } from '../notification/notification';
//import { ReportsPage } from '../reports/reports';
//import { CalendarPage } from '../calendar/calendar';
//import { OrgchartPage } from '../orgchart/orgchart';
//import { UnitsPage } from '../units/units';

/**
 * Generated class for the Unitgrouplist page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

import { Config } from '../../config/config';
@Component({
  selector: 'page-unitgrouplist',
  templateUrl: 'unitgrouplist.html',
})
export class Unitgrouplist {

  public loginas: any;
  public pageTitle: string;
  private apiServiceURL: string = "";
    public VIEWACCESS: any;
  public CREATEACCESS: any;
  public EDITACCESS: any;
  public DELETEACCESS: any;
  public totalCount;
  pet: string = "ALL";
  public fav: any;
  public userId: any;
  public sortby = 2;
  public detailvalue: any;
  public vendorsort = "asc";
  public ascending = true;
  public colorListArr: any;
  public companyId: any;
  public str: any;
  public msgcount: any;
  public notcount: any;
  remark;
  createdOn;
  colorcode; cname; favoriteindication; unitgroup_name; totalunits
  //Authorization Declaration
 footerBar: number = 1;
  //Authorization Declaration
  public reportData: any =
    {
      status: '',
      sort: 'unit_id',
      sortascdesc: 'asc',
      startindex: 0,
      results: 50
    }
  public reportAllLists = [];
  unitgroup;
  constructor( public app: App,private conf: Config,public platform:Platform,public http: Http, public nav: NavController,
    public toastCtrl: ToastController, public alertCtrl: AlertController, public navParams: NavParams, public loadingCtrl: LoadingController) {
      this.apiServiceURL = this.conf.apiBaseURL();
      this.platform.ready().then(() => {
        this.platform.registerBackButtonAction(() => {
          const overlayView = this.app._appRoot._overlayPortal._views[0];
        if (overlayView && overlayView.dismiss) {
          overlayView.dismiss();
        }
          this.nav.setRoot(UnitgroupPage);
        });
      });
  
    
      this.pageTitle = 'Units';
    this.str = '';
    this.loginas = localStorage.getItem("userInfoName");
    this.companyId = localStorage.getItem("userInfoCompanyId");
    this.userId = localStorage.getItem("userInfoId");
    //Authorization Get Value

    //Authorization Get Value
    this.colorcode = this.navParams.get('colorcode');
    this.cname = this.navParams.get('cname');

    this.favoriteindication = this.navParams.get('favoriteindication');

    this.unitgroup_name = this.navParams.get('unitgroup_name');
    this.remark = this.navParams.get('remark');
    this.createdOn = this.navParams.get('createdOn');
    this.totalunits = this.navParams.get('totalunits');

   
  }

  ionViewDidLoad() {
  }
  doRefresh(refresher) {
    this.reportData.startindex = 0;
    this.reportAllLists = [];
    this.doUnit();
    setTimeout(() => {
      refresher.complete();
    }, 2000);
  }


  /****************************/
  /*@doUnit calling on report */
  /****************************/
  doUnit() {
    this.colorListArr = [
      "FBE983",
      "5584EE",
      "A4BDFD",
      "47D6DC",
      "7AE7BE",
      "51B749",
      "FBD75C",
      "FFB878",
      "FF877C",
      "DC2128",
      "DAADFE",
      "E1E1E1"
    ];
    this.presentLoading(1);
    if (this.reportData.status == '') {
      this.reportData.status = "DRAFT";
    }
    if (this.reportData.sort == '') {
      this.reportData.sort = "vendor";
    }
    let type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + "/unitgroupdetails?startindex=" + this.reportData.startindex + "&results=" + this.reportData.results + "&sort=" + this.reportData.sort + "&dir=" + this.reportData.sortascdesc + "&unitgroupid=" + this.navParams.get('unitid') + "&loginid=" + this.userId;
    let res;
    
    this.http.get(url, options)
      .subscribe((data) => {
        res = data.json();
        if (res.units.length > 0) {
          for (let unit in res.units) {
            let colorcode;
            let favorite;
            let index = this.colorListArr.indexOf(res.units[unit].colorcode); 
            let colorvalincrmentone = index + 1;
            colorcode = "button" + colorvalincrmentone;
            if (res.units[unit].favorite == 1) {
              favorite = "favorite";
              localStorage.setItem("unitfav", favorite);
            }
            else {
              this.fav = favorite;
              favorite = "unfavorite";
              localStorage.setItem("unitfav", favorite);

            }

            this.reportAllLists.push({
              unit_id: res.units[unit].unit_id,
              unitname: res.units[unit].unitname,
              location: res.units[unit].location,
              projectname: res.units[unit].projectname,
              colorcode: res.units[unit].colorcode,
              contacts: res.units[unit].contacts,
              nextservicedate: res.units[unit].nextservicedate,
              colorcodeindications: colorcode,
              controllerid: res.units[unit].controllerid,
              neaplateno: res.units[unit].neaplateno,
              companys_id: res.units[unit].companys_id,
              unitgroups_id: res.units[unit].unitgroups_id,
              models_id: res.units[unit].models_id,
              alarmnotificationto: res.units[unit].alarmnotificationto,
              genstatus: res.units[unit].genstatus,
              lat: res.units[unit].lat,
              lng: res.units[unit].lng,
              favoriteindication: favorite
            });
          }
          //this.reportAllLists = res.units;
          this.totalCount = res.totalCount;
          this.reportData.startindex += this.reportData.results;
        } else {
          this.totalCount = 0;
        }
       

      });
    this.presentLoading(0);
  }

  /**********************/
  /* Infinite scrolling */
  /**********************/
  doInfinite(infiniteScroll) {
   
    if (this.reportData.startindex < this.totalCount && this.reportData.startindex > 0) {
     
      this.doUnit();
    }
   
    setTimeout(() => {
     
      infiniteScroll.complete();
    }, 500);
    
  }
  ionViewWillEnter() {
    this.detailvalue = "";
    localStorage.setItem("viewlist", "");
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

    this.doUnit();

  }

 
  getCheckBoxValue(item, val) {
    
    if (val != '') {
      if (this.str == '') {
        this.str = val;
      } else {
        this.str = this.str + "," + val;
      }
    }
    this.detailvalue = item;   
  }

  onAction(actpet) {    
    let urlstr;
    if (actpet == 'delete') {
      if (this.str == '') {
        this.sendNotification("Please select Atleast One Unit")
      }
      else {
        urlstr = "/unitlistaction/" + this.str + "/1/delete";
      }
    }
    if (actpet == 'viewdashboard') {
      if (this.str == '') {
        this.sendNotification("Please select Atleast One Unit")
      }
      else {
        urlstr = "/unitlistaction/" + this.str + "/1/dashboard?ses_login_id=" + this.userId;
      }
    }
    if (actpet == 'view') {
      if (this.str == '') {
        this.sendNotification("Please select Atleast One Unit")
      }
      else {
         this.nav.setRoot(UnitdetailsPage, {
          record: this.detailvalue
        });
        return false;
      }
    }
    if (urlstr != undefined) {
     
      let type: string = "application/x-www-form-urlencoded; charset=UTF-8",
        headers: any = new Headers({ 'Content-Type': type }),
        options: any = new RequestOptions({ headers: headers }),
        url: any = this.apiServiceURL + urlstr;
      

      this.http.get(url, options)
        .subscribe((data) => {         
          // If the request was successful notify the user
          if (data.status === 200) {
            if (actpet == 'delete') {
              this.sendNotification(`Successfully Deleted`);
            } else {
              this.sendNotification(`Successfully Added`);
            }
            this.reportData.startindex = 0;
            this.reportData.sort = "unit_id";
            /// this.doUnit();
             this.nav.setRoot(this.nav.getActive().component);
          }
          // Otherwise let 'em know anyway
          else {
            // this.sendNotification('Something went wrong!');
          }
        });
    }
  }

  /******************************************/
  /* @doConfirm called for alert dialog box **/
  /******************************************/
  doConfirm(id, item) {
    let confirm = this.alertCtrl.create({
      message: 'Are you sure you want to delete this unit?',
      buttons: [{
        text: 'Yes',
        handler: () => {
          this.deleteEntry(id);
          for (let q: number = 0; q < this.reportAllLists.length; q++) {
            if (this.reportAllLists[q] == item) {
              this.reportAllLists.splice(q, 1);
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
      url: any = this.apiServiceURL + "/units/" + recordID + "/1/delete";

    this.http.get(url, options)
      .subscribe(data => {
        // If the request was successful notify the user
        if (data.status === 200) {

          this.sendNotification(`Units was successfully deleted`);
        }
        // Otherwise let 'em know anyway
        else {
          this.sendNotification('Something went wrong!');
        }
      });
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



  onSegmentChanged(val) {
    let splitdata = val.split(",");
    this.reportData.sort = splitdata[0];
    this.reportData.sortascdesc = splitdata[1];
    //this.reportData.status = "ALL";
    this.reportData.startindex = 0;
    this.reportAllLists = [];
    this.doUnit();
  }

  /********************/
  /* Sorting function */
  /********************/
  doSort(val) {
    this.reportAllLists = [];
    this.reportData.startindex = 0;
    this.sortby = 1;
    if (this.vendorsort == "asc") {
      this.reportData.sortascdesc = "desc";
      this.vendorsort = "desc";
      this.ascending = false;
    }
    else {
      this.reportData.sortascdesc = "asc";
      this.vendorsort = "asc";
      this.ascending = true;
    }
    this.reportData.sort = val;
    this.doUnit();
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

  previous() {
     this.nav.setRoot(UnitgroupPage);
  }
  favorite(unit_id) {
    this.reportData.startindex = 0;
    this.reportAllLists = [];
    let body: string = "unitid=" + unit_id + "&is_mobile=1" + "&loginid=" + this.userId,
      type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + "/setunitfavorite";
    
    
    this.http.post(url, body, options)
      .subscribe(data => {
       
        let res = data.json();
      
        if (res.msg[0] == 0) {
        
        } else {
         
        }

        if (res.units.length > 0) {
          for (let unit in res.units) {
            let colorcode;
            let favorite;
            let index = this.colorListArr.indexOf(res.units[unit].colorcode); // 1
          
            let colorvalincrmentone = index + 1;
            colorcode = "button" + colorvalincrmentone;
           
            if (res.units[unit].favorite == 1) {
              favorite = "favorite";
            }
            else {
              favorite = "unfavorite";

            }
            this.reportAllLists.push({
              unit_id: res.units[unit].unit_id,
              unitname: res.units[unit].unitname,
              location: res.units[unit].location,
              contacts: res.units[unit].contacts,
              projectname: res.units[unit].projectname,
              colorcode: res.units[unit].colorcode,
              nextservicedate: res.units[unit].nextservicedate,
              colorcodeindications: colorcode,
              controllerid: res.units[unit].controllerid,
              neaplateno: res.units[unit].neaplateno,
              companys_id: res.units[unit].companys_id,
              unitgroups_id: res.units[unit].unitgroups_id,
              models_id: res.units[unit].models_id,
              alarmnotificationto: res.units[unit].alarmnotificationto,
              favoriteindication: favorite
            });
          }
          //this.reportAllLists = res.units;
          this.totalCount = res.totalCount;
          this.reportData.startindex += this.reportData.results;
        } else {
          this.totalCount = 0;
        }

        // If the request was successful notify the user
        if (data.status === 200) {
          this.sendNotification(res.msg[0].result);
        }
        // Otherwise let 'em know anyway
        else {
          this.sendNotification('Something went wrong!');
        }
      });
    this.doUnit();
  }

  notification() {
     this.nav.setRoot(NotificationPage);
  }


}
