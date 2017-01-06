import { Component, Output } from '@angular/core';

@Component({
  selector: 'my-app',
  template: `
  <h1>
    Hello {{name}}
  </h1>
  <section
      class="file-drop"
      fileDrop
      [ngClass]="{'files-are-over': filesAreOver}"
      (filesOver)="filesOver($event)"
      (onFilesDrop)="onFilesDrop($event)">
      <p class="drop-request" *ngIf="!filesAreDropped">
        Drop files here
      </p>
      <ul *ngIf="filesAreDropped">
        <li *ngFor="let file of files">{{file.name}}</li>
      </ul>
    </section>`, 
})
export class AppComponent {
  name = 'Angular';
  filesAreOver = false;
  filesAreDropped = false;
  files: File[] = [];

  filesOver(filesOver: boolean): void {
    this.filesAreOver = filesOver;
  }

  onFilesDrop(fs: File[]): void {
    this.filesAreDropped = true;
    fs.forEach(newFile => {
      if (!this.files.some(f => f.path === newFile.path)) {
        this.files.push(newFile);
      }
    });
  }
}
