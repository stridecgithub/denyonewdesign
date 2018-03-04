import { Component } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Http, Headers, RequestOptions } from '@angular/http';
import { LoginPage } from '../login/login';
import { Config } from '../../config/config';
/**
 * Generated class for the ForgotpasswordPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-forgotpassword',
  templateUrl: 'forgotpassword.html',
  providers: [Config]
})
export class ForgotpasswordPage {
  public loginas: any;
  public companyid: any;
  public form: FormGroup;
  public uname: any;
  public email: any;
  public ccode: any;
  public nccode: any;
  public userId: any;
  public responseResultCountry: any;

  // Flag to be used for checking whether we are adding/editing an entry
  public isEdited: boolean = false;
  public readOnly: boolean = false;

  // Flag to hide the form upon successful completion of remote operation
  public hideForm: boolean = false;
  public hideActionButton = true;
  // public isUploadedProcessing: boolean = false;
  // Property to help ste the page title
  public pageTitle: string;
  // Property to store the recordID for when an existing entry is being edited
  public recordID: any = null;
  private apiServiceURL: string = "";
  public networkType: string;

  constructor(private conf: Config, public platform: Platform, public nav: NavController,
    public http: Http,
    public NP: NavParams,
    public fb: FormBuilder) {
    this.loginas = localStorage.getItem("userInfoName");
    // Create form builder validation rules
    this.form = fb.group({
      "uname": ["", Validators.required],
      //"email": ["", Validators.required]
      "email": ['', Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(50), Validators.pattern(/^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i)])]

    });
    this.pageTitle = "Forgot Password";
    this.userId = localStorage.getItem("userInfoId");
    this.companyid = localStorage.getItem("userInfoCompanyId");
    this.networkType = '';
    this.apiServiceURL = conf.apiBaseURL();
    this.platform.ready().then(() => {
      this.platform.registerBackButtonAction(() => {
        this.previous();
      });
      
      let isNet = localStorage.getItem("isNet");
      if (isNet == 'offline') {
        this.networkType = this.conf.networkErrMsg();
      } else {
        this.networkType = '';
      }
    });
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad ForgotpasswordPage');
    localStorage.setItem("fromModule", "ForgotpasswordPage");
  }
  saveEntry() {
    let isNet = localStorage.getItem("isNet");
    if (isNet == 'offline') {
      this.networkType = this.conf.networkErrMsg();
    } else {
      let uname: string = this.form.controls["uname"].value,
        email: string = this.form.controls["email"].value;
      console.log(uname, email);
      let body: string = "is_mobile=1&username=" + uname + "&useremail=" + email,
        type: string = "application/x-www-form-urlencoded; charset=UTF-8",
        headers: any = new Headers({ 'Content-Type': type }),
        options: any = new RequestOptions({ headers: headers }),
        url: any = this.apiServiceURL + "/forgetpassprocess";
      this.http.post(url, body, options)
        .subscribe((data) => {
          let res = data.json();
          console.log(JSON.stringify(data.json()));
          // If the request was successful notify the user
          if (data.status === 200) {
            console.log("Msg Results:-" + res.msg[0].result);
            this.hideForm = true;         
              //this.conf.sendNotification('Forgot password has been sending your registered email id.');           
              //this.nav.push(LoginPage);
              if (res.msg[0].Error > 0) {
                this.conf.sendNotification(res.msg[0].result);
              } else {
                this.conf.sendNotification(res.msg[0].result);
               // this.conf.sendNotification('Forgot password has been sending your registered email id.');
                this.nav.setRoot(LoginPage);
              }
          }
          // Otherwise let 'em know anyway
          else {
            this.conf.sendNotification('Something went wrong!');
          }
        }, error => {
          this.networkType = this.conf.serverErrMsg();// + "\n" + error;
        });
    }
  }

  previous() {
    this.nav.push(LoginPage);
  }
}