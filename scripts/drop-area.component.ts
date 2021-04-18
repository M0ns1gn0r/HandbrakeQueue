import * as fs from 'fs';
import { remote } from 'electron';
import { Component } from '@angular/core';
import { QueueService } from './queue.service';
import { FileService } from './file.service';
import { FileInfo } from './file-info';

@Component({ templateUrl: 'scripts/drop-area.component.html' })
export class DropAreaComponent {
  allowedMimes = new Set(['video/mp4', 'video/avi', 'video/quicktime', 'video/3gpp']);
  filesAreOver = false;

  constructor(
    private fileService: FileService,
    private queueService: QueueService) {
  }

  get files() {
    return this.fileService.files;
  }

  onFilesOver(filesOver: boolean): void {
    this.filesAreOver = filesOver;
  }

  onFilesDrop(fs: File[]): void {
    fs.forEach(f => this.fileService.add(f));
  }

  /** Executed when the video is loaded and its duration is calculated.*/
  onDurationChange(event: Event) {
    const video = event.target as HTMLVideoElement;
    if (!video.duration) {
      return;
    }
    const idx = +video.id.substr(5);
    this.files[idx].duration = video.duration;
  }

  createQueue(): void {
    const queueXml = this.queueService.create(this.files);
    const config: Electron.SaveDialogOptions = {
      title: 'Create Queue',
      defaultPath: 'queue.hbq'
    };
    remote.dialog
      .showSaveDialog(remote.getCurrentWindow(), config)
      .then(x => x.filePath && fs.writeFileSync(x.filePath, queueXml));
  }

  clearQueue(): void {
    this.fileService.clear();
  }

  removeFile(fileIndex: number): boolean {
    this.fileService.remove(fileIndex);
    return false;
  }

  formatTime(totalSeconds: number) {
    return new Intl
      .DateTimeFormat('en-US', { minute: 'numeric', second: 'numeric' })
      .format(new Date(totalSeconds * 1000));
  }

  formatSegment(file: FileInfo): string {
    const { firstSecond, lastSecond } = file.config.segment;
    const from = this.formatTime(firstSecond || 0);
    const till = this.formatTime(lastSecond || file.duration);
    return `${from}–${till}`;
  }

  hasDifferentTargetName(file: FileInfo): boolean {
    return file.config.getTargetName() !== file.name;
  }
}
