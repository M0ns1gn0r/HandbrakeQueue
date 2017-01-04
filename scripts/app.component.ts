import { Component, Output } from '@angular/core';

@Component({
  selector: 'my-app',
  template: `
  <h1>
    Hello {{name}}
  </h1>
  <div
      class="file-drop"
      fileDrop
      [ngClass]="{'file-is-over': fileIsOver}"
      [options]="options"
      (fileOver)="fileOver($event)"
      (onFileDrop)="onFileDrop($event)">
      Drop file here
    </div>`, 
})
export class AppComponent {
  name = 'Angular';
  fileIsOver = false;

  @Output() options = {
    readAs: 'ArrayBuffer'
  };

  private file: File;

  fileOver(fileIsOver: boolean): void {
    this.fileIsOver = fileIsOver;
  }

  onFileDrop(file: File): void {
    console.log('Got file!');
  }
}
