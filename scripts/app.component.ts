import { Component, Output } from '@angular/core';
import { writeFileSync } from 'fs';
import { QueueService } from './queueService';

@Component({
  selector: 'my-app',
  template: `
  <section
    class="file-drop"
    fileDrop
    [ngClass]="{'files-are-over': filesAreOver}"
    [allowedExtensions]="allowedExtensions"
    (filesOver)="onFilesOver($event)"
    (filesDrop)="onFilesDrop($event)">
    <p class="drop-request" *ngIf="!filesAreDropped">
      Drop files here
    </p>
    <ul *ngIf="filesAreDropped">
      <li *ngFor="let file of files">{{file.name}}</li>
    </ul>
  </section>
  <button ondragstart="return false;" ondrop="return false;"
    class="create-button"
    [disabled]="!filesAreDropped"
    (click)="createQueue()">
    Create queue
  </button>`, 
})
export class AppComponent {
  allowedExtensions = new Set([".mp4", ".avi", ".mov", ".3gp"]);
  filesAreOver = false;
  filesAreDropped = false;
  files: File[] = [];

  constructor(private queueService: QueueService) {

  }

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
    const queueXml = this.queueService.create(this.files);

    writeFileSync("d:\\output.hbq", queueXml);
    console.log("Queue created.");
  }
}
