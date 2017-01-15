import * as fs from 'fs';
import { Component } from '@angular/core';
import { QueueService } from './queue.service';
import { FileService } from './file.service';
import { FileInfo } from './file-info';

@Component({
  template: `
  <div class="hq-flex-container">
    <section
      class="hq-drop-area"
      fileDrop
      [ngClass]="{'hq-drop-area--file-over': filesAreOver}"
      [allowedExtensions]="allowedExtensions"
      (filesOver)="onFilesOver($event)"
      (filesDrop)="onFilesDrop($event)">
      <p class="hq-drop-area_prompt" *ngIf="!files.length">
        Drop files here
      </p>
      <div class="hq-file" *ngFor="let file of files; let idx = index">
        <a [routerLink]="[ '/file', idx ]">
          {{file.name}} ({{file.size}})
        </a>
      </div>
    </section>
    <button
      class="hq-create-button"
      [disabled]="!files.length"
      (click)="createQueue()">
      Create queue
    </button>
  </div>`
})
export class DropAreaComponent {
  allowedExtensions = new Set(['.mp4', '.avi', '.mov', '.3gp']);
  filesAreOver = false;
  files: FileInfo[] = [];

  constructor(
    fileService: FileService,
    private queueService: QueueService) {

    this.files = fileService.files;
  }

  onFilesOver(filesOver: boolean): void {
    this.filesAreOver = filesOver;
  }

  onFilesDrop(fs: File[]): void {
    fs.forEach(newFile => {
      if (!this.files.some(fi => fi.file.path === newFile.path)) {
        this.files.push(new FileInfo(newFile));
      }
    });
  }

  createQueue(): void {
    const queueXml = this.queueService.create(this.files);

    fs.writeFileSync('d:\\1\\output.hbq', queueXml);
    console.log('Queue created.');
  }
}
