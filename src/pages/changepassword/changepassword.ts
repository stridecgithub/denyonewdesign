import { Component } from '@angular/core';
import {  NavController, NavParams } from 'ionic-angular';
import { MyaccountPage } from '../myaccount/myaccount';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Config } from '../../config/config';
/**
 * Generated class for the ChangepasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-changepassword',
  templateUrl: 'changepassword.html',
})
export class ChangepasswordPage {
  private apiServiceURL: string = "";
  public form: FormGroup;
  public isSubmitted: boolean = false;
  userId;
  constructor(private conf: Config, public navCtrl: NavController, public navParams: NavParams, public http: Http,
    public NP: NavParams,
    public fb: FormBuilder
  ) {

    this.form = fb.group({
      "oldpassword": ["", Validators.required],
      "confirmpassword": ["", Validators.required],
      "newpassword": ["", Validators.required]
    });
    this.apiServiceURL = conf.apiBaseURL();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChangepasswordPage');

    this.userId = localStorage.getItem("userInfoId");

  }

  saveEntry() {
    //loginid=46&oldpassword=newnew&newpassword=123123
    let oldpassword: string = this.form.controls["oldpassword"].value,
      newpassword: string = this.form.controls["newpassword"].value;
    //denyoappv2.stridecdev.com/changepassword?loginid=46&oldpassword=newnew&newpassword=123123
    let body: string = "loginid=" + this.userId + "&oldpassword=" + oldpassword + "&newpassword=" + newpassword,
      type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + "/changepassword";
    console.log("Change Password API Calls:-" + url + "?" + body);
    this.http.post(url, body, options)
      .subscribe((data) => {
        let res = data.json();
        console.log(JSON.stringify(data.json()));
        // If the request was successful notify the user
        if (data.status === 200) {
          console.log("Msg Results:-" + res.msg[0].result);
          if (res.msg[0].Error > 0) {
            this.conf.sendNotification(res.msg[0].result);
          } else {
           // this.conf.sendNotification('New password has been updated successfully.');
           this.conf.sendNotification(res.msg[0].result);
            this.navCtrl.setRoot(MyaccountPage);
          }
        }
        // Otherwise let 'em know anyway
        else {
          this.conf.sendNotification('Something went wrong!');
        }
      }, error => {
      });
  }

  previous() {
    this.navCtrl.setRoot(MyaccountPage);
  }

  comparepassword(confirmpassword, newpassword) {
    console.log("Confirm Passowrd:" + confirmpassword + "-New Password:" + newpassword)
    if(confirmpassword!=newpassword){
      this.isSubmitted = true;
    }else{
      this.isSubmitted = false;
    }
    // this.isSubmitted = true;
    // console.log(val);
    // //if()

  }

}
