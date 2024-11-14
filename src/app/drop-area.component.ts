import { NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { dialog, fs } from './electron';
import { FileDropDirective } from './file-drop.directive';
import { FileInfo } from './file-info';
import { FileService } from './file.service';
import { QueueService } from './queue.service';

@Component({
  selector: 'drop-area',
  standalone: true,
  imports: [RouterLink, NgClass, FileDropDirective],
  templateUrl: './drop-area.component.html' 
})
export class DropAreaComponent {
  allowedMimes = new Set(['video/mp4', 'video/avi', 'video/quicktime', 'video/3gpp']);
  filesAreOver = false;

  private fileService = inject(FileService);
  private queueService = inject(QueueService);

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
    const idx = +video.id.substring(5);
    this.files[idx].duration = video.duration;
  }

  async createQueue(): Promise<void> {
    const queueXml = this.queueService.create(this.files);
    const res = await dialog.showSaveDialog({
      title: 'Create Queue',
      defaultPath: 'queue.hbq'
    });
    if (!res.filePath) {
      return;
    }
    const writeRes = await fs.writeFile(res.filePath, queueXml);
    if (!writeRes.success) {
      console.error("Failed to write file", writeRes.error);
      return;
    }
    this.clearQueue();
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
