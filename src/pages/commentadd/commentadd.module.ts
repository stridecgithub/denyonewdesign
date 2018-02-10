import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CommentaddPage } from './commentadd';

@NgModule({
  declarations: [
    CommentaddPage,
  ],
  imports: [
    IonicPageModule.forChild(CommentaddPage),
  ],
})
export class CommentaddPageModule {}
