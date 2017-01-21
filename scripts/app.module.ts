import { NgModule }      from '@angular/core';
import { FormsModule }   from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';

import { QueueService } from './queue.service';
import { FileService } from './file.service';

import { FileDropDirective } from './file-drop.directive';

import { AppComponent }  from './app.component';
import { DropAreaComponent }  from './drop-area.component';
import { FileComponent }  from './file.component';

const appRoutes: Routes = [
  { path: 'drop-area', component: DropAreaComponent },
  { path: 'file/:idx', component: FileComponent },
  { path: '', redirectTo: '/drop-area', pathMatch: 'full' }
];

@NgModule({
  imports:      [ BrowserModule, FormsModule, RouterModule.forRoot(appRoutes, { useHash: true }) ],
  providers:    [ QueueService, FileService ],
  declarations: [ AppComponent, DropAreaComponent, FileComponent, FileDropDirective ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
