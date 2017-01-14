import * as fs from 'fs';
import { Component } from '@angular/core';
import { FileInfo } from './file-info';

@Component({
  template: `
  <div>
    <a routerLink="/drop-area">Back</a>
    <p>The file will be here</p>
  </div>`
})
export class FileComponent {
}
