import { Component, Output } from '@angular/core';

@Component({
  selector: 'my-app',
  template: `
  <section
      class="file-drop"
      fileDrop
      [ngClass]="{'files-are-over': filesAreOver}"
      (filesOver)="onFilesOver($event)"
      (filesDrop)="onFilesDrop($event)">
      <p class="drop-request" *ngIf="!filesAreDropped">
        Drop files here
      </p>
      <ul *ngIf="filesAreDropped">
        <li *ngFor="let file of files">{{file.name}}</li>
      </ul>
    </section>
    <button
      class="create-button"
      [disabled]="!filesAreDropped"
      (click)="createQueue()">
      Create queue
    </button>`, 
})
export class AppComponent {
  filesAreOver = false;
  filesAreDropped = false;
  files: File[] = [];

  onFilesOver(filesOver: boolean): void {
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

  createQueue(): void {
    console.log("Exported!");
  }
}
