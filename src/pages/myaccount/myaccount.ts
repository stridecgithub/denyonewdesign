/**
 * Generated class for the MyaccountPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
import { Component } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';
import { Http, Headers, RequestOptions } from '@angular/http';
import { EditprofilesteponePage } from '../editprofilestepone/editprofilestepone';
import { DashboardPage } from '../dashboard/dashboard';
import { NotificationPage } from '../notification/notification';
import { CalendarPage } from '../calendar/calendar';
import { OrgchartPage } from '../orgchart/orgchart';
import { CompanygroupPage } from '../companygroup/companygroup';
import { ReporttemplatePage } from '../reporttemplate/reporttemplate';
import { Config } from '../../config/config';
import { ChangepasswordPage } from '../changepassword/changepassword';

/**
 * Generated class for the MyaccountPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-myaccount',
  templateUrl: 'myaccount.html',
  providers: [Config]
})
export class MyaccountPage {
  footerBar: number = 0;
  public pageTitle: string;
  public photo: any;
  public name: any;
  public msgcount: any;
  public notcount: any;
  public userid: any;
  public password: any;
  public hashtag: any;
  public loginas: any;
  public role: any;
  public email: any;
  public country: any;
  public job_position: any;
  public accountcreatedby: any;
  public userId: any;
  public item: any;
  public VIEWACCESS: any;
  public CREATEACCESS: any;
  public companyId: any;
  public EDITACCESS: any;
  public DELETEACCESS: any;
  private apiServiceURL: string = "";
  private permissionMessage: string = "";
  public networkType: string;
  company_group;
  firstname;
  lastname;
  username;
  contactnumber;
  //{"msg":{"result":"Success!"},"settings":[{"firstname":"Guest 1","lastname":"Demo","email":"balamurugan@webneo.in","job_position":"Country Manager","username":"denyov2","password":"newnew","country_name":"Singapore","country_id":"195","company_id":"2","role_name":"Denyo Admin","photo_filename":"20171212082607_123_DENYO LOGO_Transparent.png","contact_number":"+65 1111 2222","Account createdby":"Guest 1","Company Group":"Stridec","company_group":"Stridec"}]}
  constructor(private conf: Config, public platform: Platform, public http: Http, public navCtrl: NavController, public navParams: NavParams, public nav: NavController) {
    this.pageTitle = 'My Account';
    this.loginas = localStorage.getItem("userInfoName");
    
    this.userId = localStorage.getItem("userInfoId");
    this.VIEWACCESS = localStorage.getItem("SETTINGS_MYACCOUNT_VIEW");
    console.log("Role Authority for Unit Listing View:" + this.VIEWACCESS);
    this.CREATEACCESS = localStorage.getItem("SETTINGS_MYACCOUNT_CREATE");
    console.log("Role Authority for Unit Listing Create:" + this.CREATEACCESS);
    this.EDITACCESS = localStorage.getItem("SETTINGS_MYACCOUNT_EDIT");
    console.log("Role Authority for Unit Listing Edit:" + this.EDITACCESS)
    this.DELETEACCESS = localStorage.getItem("SETTINGS_MYACCOUNT_DELETE");
    console.log("Role Authority for Unit Listing Delete:" + this.DELETEACCESS);
    this.companyId = localStorage.getItem("userInfoCompanyId");

    this.networkType = '';
    this.permissionMessage = conf.rolePermissionMsg();
    this.apiServiceURL = conf.apiBaseURL();
    this.photo =   this.apiServiceURL + "/images/default.png"
    this.platform.ready().then(() => {
      this.platform.registerBackButtonAction(() => {
        this.previous();
      });
    });
  }

  //[{"userid":"1","userdetailsid":"1","username":"webkannan","password":"webkannan","role":"1","hashtag":"@welcome","first_name":"Kannan","last_name":"Nagarathinam","email":"kannan@gmail.com","contact":"123456789","country":"2","photo":"1496647262537.jpg","job_position":"At prog","report_to":"0","company_group":"1","companygroup_name":"Denyo"}]

  ionViewDidLoad() {
  
  	
  
    console.log('ionViewDidLoad My Account Page');
    localStorage.setItem("fromModule", "MyaccountPage");
    localStorage.setItem("userPhotoFile", '');
    // body: string = "key=myaccount&userId=" + this.userId,
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
        if (res.settings.length > 0) {
          this.userid = res.settings[0].username;
          this.username = res.settings[0].username;
          this.password = res.settings[0].password;
          this.contactnumber = res.settings[0].contact_number;
          this.hashtag = res.settings[0].personalhashtag;
          this.role = res.settings[0].role_name;
          this.email = res.settings[0].email;
          this.country = res.settings[0].country_name;
          this.job_position = res.settings[0].job_position;
          this.accountcreatedby = res.settings[0].report_to;
          this.company_group = res.settings[0].company_group;
          this.firstname = res.settings[0].firstname;
          this.lastname = res.settings[0].lastname;

          console.log("A" + res.settings[0].photo_filename);
          if (res.settings[0].photo_filename != '' && res.settings[0].photo_filename != 'NULL' && res.settings[0].photo_filename != null) {           
            this.photo = this.apiServiceURL + "/staffphotos/" + res.settings[0].photo_filename;
             console.log('My Acccount One Photo Available....');
          }else{
            this.photo = this.apiServiceURL + "/images/default.png";
             console.log('My Acccount  One Photo Not Available....');
          }
        }
        // [{ "userid": "1", "userdetailsid": "1", "username": "denyov2", "password": "e3b81d385ca4c26109dfbda28c563e2b", "firstname": "Super Admin", "lastname": "Denyo", "email": "balamurugan@webneo.in", "contact_number": "9597645985", "country_id": "99", "photo": "1496647262537.jpg", "job_position": "Country Manager", "report_to": "0", "company_id": "1", "companygroup_name": "Denyo" }]


      }, error => {
        this.networkType = this.conf.serverErrMsg();// + "\n" + error;
      });
    let //body: string = "loginid=" + this.userId,
      type1: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers1: any = new Headers({ 'Content-Type': type1 }),
      options1: any = new RequestOptions({ headers: headers1 }),
      url1: any = this.apiServiceURL + "/msgnotifycount?loginid=" + this.userId;
    console.log(url1);
    // console.log(body);
    this.http.get(url1, options1)
      .subscribe((data) => {
        console.log("Count Response Success:" + JSON.stringify(data.json()));
        this.msgcount = data.json().msgcount;
        this.notcount = data.json().notifycount;
      }, error => {
        this.networkType = this.conf.serverErrMsg();// + "\n" + error;
      });
  }
  doEdit(userid, act) {
    this.nav.setRoot(EditprofilesteponePage, {
      userId: userid,
      act: act
    });
  }
  
  changepassword(){
		this.nav.setRoot(ChangepasswordPage);
	}


  viewOrgChart() {
    this.nav.setRoot(OrgchartPage, {
      companyId: this.companyId
    });
  }
  previous() {
    this.nav.setRoot(DashboardPage);
  }

  notification() {
    this.nav.setRoot(NotificationPage);
  }

}
