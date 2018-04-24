import { Component } from '@angular/core';
import { MockProvider} from './provider';
//import { InfiniteScroll } from '../../../../../src';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Config } from '../../config/config';
@Component({
  selector: 'page-paginate',
  templateUrl: 'paginate.html',
  providers:[MockProvider,Config]
})
export class PaginatePage {
  items: string[];
  private apiServiceURL: string = "";
  public unitDetailData: any = {
    userId: '',
    loginas: '',
    pageTitle: '',
    getremark: '',
    serviced_by: '',
    nextServiceDate: '',
    addedImgLists1: '',
    addedImgLists2: '',
    colorcodeindications: '',
		mapicon:''
  }
  
  constructor(private mockProvider: MockProvider, public http: Http, private conf: Config) {
    this.items = mockProvider.getData();
    this.apiServiceURL = this.conf.apiBaseURL();
  }
  ionViewWillEnter() {
   
   // let iframeunitid = localStorage.getItem("iframeunitId");
   
   

   
    let
      type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + "/getunitdetailsbyid?is_mobile=1&loginid=1"+
        "&unitid=2";

    this.http.get(url, options)
      .subscribe((data) => {					// If the request was successful notify the user
        if (data.status === 200) {
          this.unitDetailData.unitname = data.json().units[0].unitname;
          this.unitDetailData.projectname = data.json().units[0].projectname;
          this.unitDetailData.location = data.json().units[0].location;
          this.unitDetailData.colorcodeindications = data.json().units[0].colorcode;
          this.unitDetailData.gen_status = data.json().units[0].genstatus;
          this.unitDetailData.nextservicedate = data.json().units[0].nextservicedate;
          this.unitDetailData.companygroup_name = data.json().units[0].companygroup_name;
          this.unitDetailData.runninghr = data.json().units[0].runninghr;
          this.unitDetailData.mapicon=data.json().units[0].mapicon;
          this.unitDetailData.alarmnotificationto = data.json().units[0].nextservicedate;
          if (data.json().units[0].lat == undefined) {
            this.unitDetailData.lat = '';
          } else {
            this.unitDetailData.lat = data.json().units[0].lat;
          }

          if (data.json().units[0].lat == 'undefined') {
            this.unitDetailData.lat = '';
          } else {
            this.unitDetailData.lat = data.json().units[0].lat;
          }


          if (data.json().units[0].lng == undefined) {
            this.unitDetailData.lng = '';
          } else {
            this.unitDetailData.lng = data.json().units[0].lng;
          }

          if (data.json().units[0].lng == 'undefined') {
            this.unitDetailData.lng = '';
          } else {
            this.unitDetailData.lng = data.json().units[0].lng;
          }

          this.unitDetailData.favoriteindication = data.json().units[0].favorite;
         

        }
      }, error => {
       // this.networkType = this.conf.serverErrMsg();// + "\n" + error;
      });
    // Unit Details API Call
   // this.doService();
    //this.unit_id = this.NP.get("record").unit_id;
    // Atmentioned Tag Storage
  }
  doInfinite(infiniteScroll) {
    this.mockProvider.getAsyncData().then((newData) => {
      for (var i = 0; i < newData.length; i++) {
        JSON.stringify(this.items.push( newData[i] ));
      }

      infiniteScroll.complete();

      if (this.items.length > 179) {
        infiniteScroll.enable(false);
      }
    });
  }
}