import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
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

@IonicPage()
@Component({
  selector: 'page-changepassword',
  templateUrl: 'changepassword.html',
})
export class ChangepasswordPage {
  private apiServiceURL: string = "";
  public form: FormGroup;
  constructor(private conf: Config,public navCtrl: NavController, public navParams: NavParams, public http: Http,
    public NP: NavParams,
    public fb: FormBuilder
  ) {

    this.form = fb.group({
      "currentpassword": ["", Validators.required],
      "confirmpassword": ["", Validators.required],
      "newpassword": ["", Validators.required]
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChangepasswordPage');



  }

  saveEntry() {
    
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
              if (res.msg[0].Error > 0) {
                this.conf.sendNotification(res.msg[0].result);
              } else {
                this.conf.sendNotification('Forgot password has been sending your registered email id.');
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



}
