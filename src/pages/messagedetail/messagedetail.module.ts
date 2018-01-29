import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MessagedetailPage } from './messagedetail';

@NgModule({
  declarations: [
    MessagedetailPage,
  ],
  imports: [
    IonicPageModule.forChild(MessagedetailPage),
  ],
})
export class MessagedetailPageModule {}
