import { Component } from '@angular/core';
import {  NavController, NavParams } from 'ionic-angular';
import { ReporttemplatePage } from '../reporttemplate/reporttemplate';

/**
 * Generated class for the ReporttemplatedetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-reporttemplatedetail',
  templateUrl: 'reporttemplatedetail.html',
})
export class ReporttemplatedetailPage {
  public templatename;
  public availableheading = [];
  public footerBar=[];
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    // Footer Menu Access - Start
    let footeraccessstorage = localStorage.getItem("footermenu");
    let footeraccessparams = this.navParams.get('footermenu');
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
    this.templatename=this.navParams.get('templatename');
    this.availableheading=this.navParams.get('templatedata');
    console.log("Report template name"+this.templatename);
    console.log("Report availabe"+JSON.stringify(this.availableheading));
    // console.log('ionViewDidLoad ReporttemplatedetailPage');
    // let res = this.navParams.get('templatedata');
    // console.log(JSON.stringify(res));
    // if (res.length > 0) {
    //   console.log('A');
    //   for (let availabletemps in res) {
    //     console.log('B');
    //     this.reporttemplateAllLists.push({
    //       id: res[availabletemps].id,
    //       templatename: res[availabletemps].templatename,
    //      // availableheading: res[availabletemps].availableheading.split("#")
    //     });
    //   }
    //   console.log(JSON.stringify(this.reporttemplateAllLists));
    // } else {
    //   console.log('C');
    //   //this.totalCount = 0;
    // }
  }
  previous() {
    this.navCtrl.setRoot(ReporttemplatePage);
  }
}
