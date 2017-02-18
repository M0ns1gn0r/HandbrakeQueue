import * as fs from 'fs';
import { Component } from '@angular/core';
import { QueueService } from './queue.service';
import { FileService } from './file.service';
import { FileInfo } from './file-info';

@Component({ templateUrl: 'scripts/drop-area.component.html' })
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

    // TODO: show a save file dialog.
    fs.writeFileSync('d:\\1\\output.hbq', queueXml);
    console.log('Queue created.');
  }

  removeFile(fileIndex: number): boolean {
    if (this.files.length <= fileIndex) {
      throw new Error('File index is out of bounds.');
    }
    this.files.splice(fileIndex, 1);
    return false;
  }
}
