import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CommentviewPage } from './commentview';

@NgModule({
  declarations: [
    CommentviewPage,
  ],
  imports: [
    IonicPageModule.forChild(CommentviewPage),
  ],
})
export class CommentviewPageModule {}
