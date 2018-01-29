import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MessageDetailViewPage } from './message-detail-view';

@NgModule({
  declarations: [
    MessageDetailViewPage,
  ],
  imports: [
    IonicPageModule.forChild(MessageDetailViewPage),
  ],
})
export class MessageDetailViewPageModule {}
