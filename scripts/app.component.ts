import * as fs from 'fs';
import { Component, Output } from '@angular/core';
import { QueueService } from './queueService';
import { FileInfo } from './fileInfo';

@Component({
  selector: 'my-app',
  template: `
  <section
    class="hq-drop-area"
    fileDrop
    [ngClass]="{'hq-drop-area--file-over': filesAreOver}"
    [allowedExtensions]="allowedExtensions"
    (filesOver)="onFilesOver($event)"
    (filesDrop)="onFilesDrop($event)">
    <p class="hq-drop-area_prompt" *ngIf="!filesAreDropped">
      Drop files here
    </p>
    <div class="hq-file" *ngFor="let file of files">{{file.name}} ({{file.size}})</div>
  </section>
  <button
    class="hq-create-button"
    [disabled]="!filesAreDropped"
    (click)="createQueue()">
    Create queue
  </button>`, 
})
export class AppComponent {
  allowedExtensions = new Set([".mp4", ".avi", ".mov", ".3gp"]);
  filesAreOver = false;
  filesAreDropped = false;
  files: FileInfo[] = [];

  constructor(private queueService: QueueService) {

  }

  onFilesOver(filesOver: boolean): void {
    this.filesAreOver = filesOver;
  }

  onFilesDrop(fs: File[]): void {
    this.filesAreDropped = true;
    fs.forEach(newFile => {
      if (!this.files.some(fi => fi.file.path === newFile.path)) {
        this.files.push(new FileInfo(newFile));
      }
    });
  }

  createQueue(): void {
    const queueXml = this.queueService.create(this.files);

    fs.writeFileSync("d:\\output.hbq", queueXml);
    console.log("Queue created.");
  }
}
