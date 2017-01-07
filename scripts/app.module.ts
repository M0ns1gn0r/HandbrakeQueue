import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { QueueService } from './queueService';
import { FileDropDirective } from './file-drop';
import { AppComponent }  from './app.component';

@NgModule({
  imports:      [ BrowserModule ],
  providers:    [ QueueService ],
  declarations: [ AppComponent, FileDropDirective ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
