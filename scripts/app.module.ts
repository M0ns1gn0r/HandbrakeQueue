import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';

import { QueueService } from './queueService';
import { FileDropDirective } from './file-drop';
import { AppComponent }  from './app.component';
import { DropAreaComponent }  from './drop-area.component';
import { FileComponent }  from './file.component';

const appRoutes: Routes = [
  { path: 'drop-area', component: DropAreaComponent },
  { path: 'file/:idx', component: FileComponent },
  { path: '', redirectTo: '/drop-area', pathMatch: 'full' }
];

@NgModule({
  imports:      [ BrowserModule, RouterModule.forRoot(appRoutes) ],
  providers:    [ QueueService ],
  declarations: [ AppComponent, DropAreaComponent, FileComponent, FileDropDirective ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
