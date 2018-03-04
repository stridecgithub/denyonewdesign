import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the PopoverchoosecolorPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-popoverchoosecolor',
  templateUrl: 'popoverchoosecolor.html',
})
export class PopoverchoosecolorPage {
  selectedcolor;
  defaultcolorselection;
  button1_border;
  button2_border;
  button3_border;
  button4_border;
  button5_border;
  button6_border;
  button7_border;
  button8_border;
  button9_border;
  button10_border;
  button11_border;
  button12_border;
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
    this.button1_border = '';
    this.button2_border = '';
    this.button3_border = '';
    this.button4_border = '';
    this.button5_border = '';
    this.button6_border = '';
    this.button7_border = '';
    this.button8_border = '';
    this.button9_border = '';
    this.button10_border = '';
    this.button11_border = '';
    this.button12_border = '';
    this.defaultcolorselection = this.navParams.get('colorcode');
    console.log("Edit Color code:" + this.defaultcolorselection);
    if (this.defaultcolorselection == '9013fe') {
      this.button1_border = 'button1-border';
    } else if (this.defaultcolorselection == '50e2c1') {
      this.button2_border = 'button2-border';
    } else if (this.defaultcolorselection == '3f7105') {
      this.button3_border = 'button3-border';
    }
    else if (this.defaultcolorselection == '000000') {
      this.button4_border = 'button4-border';
    }
    else if (this.defaultcolorselection == 'fe1398') {
      this.button5_border = 'button5-border';
    }
    else if (this.defaultcolorselection == '2d66c4') {
      this.button6_border = 'button6-border';
    }
    else if (this.defaultcolorselection == 'f3f01e') {
      this.button7_border = 'button7-border';
    }
    else if (this.defaultcolorselection == 'fea313') {
      this.button8_border = 'button8-border';
    }
    else if (this.defaultcolorselection == 'd80e21') {
      this.button9_border = 'button9-border';
    }
    else if (this.defaultcolorselection == '6f6a73') {
      this.button10_border = 'button10-border';
    }
    else if (this.defaultcolorselection == 'DAADFE') {
      this.button11_border = 'button11-border';
    }
    else if (this.defaultcolorselection == 'E1E1E1') {
      this.button12_border = 'button12-border';
    }
  }
  close() {
    this.viewCtrl.dismiss(this.selectedcolor);
  }

  choosecolor(clr) {
    console.log(clr);
    this.selectedcolor = clr;

    this.button1_border = '';
    this.button2_border = '';
    this.button3_border = '';
    this.button4_border = '';
    this.button5_border = '';
    this.button6_border = '';
    this.button7_border = '';
    this.button8_border = '';
    this.button9_border = '';
    this.button10_border = '';
    this.button11_border = '';
    this.button12_border = '';
    this.defaultcolorselection =this.selectedcolor;
    console.log("Edit Color code:" + this.defaultcolorselection);
    if (this.defaultcolorselection == '9013fe') {
      this.button1_border = 'button1-border';
    } else if (this.defaultcolorselection == '50e2c1') {
      this.button2_border = 'button2-border';
    } else if (this.defaultcolorselection == '3f7105') {
      this.button3_border = 'button3-border';
    }
    else if (this.defaultcolorselection == '000000') {
      this.button4_border = 'button4-border';
    }
    else if (this.defaultcolorselection == 'fe1398') {
      this.button5_border = 'button5-border';
    }
    else if (this.defaultcolorselection == '2d66c4') {
      this.button6_border = 'button6-border';
    }
    else if (this.defaultcolorselection == 'f3f01e') {
      this.button7_border = 'button7-border';
    }
    else if (this.defaultcolorselection == 'fea313') {
      this.button8_border = 'button8-border';
    }
    else if (this.defaultcolorselection == 'd80e21') {
      this.button9_border = 'button9-border';
    }
    else if (this.defaultcolorselection == '6f6a73') {
      this.button10_border = 'button10-border';
    }
    else if (this.defaultcolorselection == 'DAADFE') {
      this.button11_border = 'button11-border';
    }
    else if (this.defaultcolorselection == 'E1E1E1') {
      this.button12_border = 'button12-border';
    }
  }
}