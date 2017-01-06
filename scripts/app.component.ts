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
      [ngClass]="{'files-are-over': filesAreOver}"
      (filesOver)="filesOver($event)"
      (onFilesDrop)="onFilesDrop($event)">
      Drop files here
    </div>`, 
})
export class AppComponent {
  name = 'Angular';
  filesAreOver = false;


  private file: File;

  filesOver(filesOver: boolean): void {
    this.filesAreOver = filesOver;
  }

  onFilesDrop(files: FileList): void {
    console.log('Got files!', files);
  }
}
