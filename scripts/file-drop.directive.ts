/*
 * Originally taken from https://github.com/jellyjs/angular2-file-drop
 * Simplified & customized for own needs.
 */

import {
  Directive,
  EventEmitter,
  ElementRef,
  HostListener,
  Output,
  Input
} from '@angular/core';

import * as path from 'path';

@Directive({ selector: '[fileDrop]' })
export class FileDropDirective {
  /** A set of mime types allowed to be dropped. Example: ["video/mp4"]. */
  @Input() allowedMimes = new Set<string>();
  @Output() filesOver = new EventEmitter<boolean>();
  @Output() filesDrop = new EventEmitter<File[]>();

  constructor(
    private element: ElementRef) {
  }

  @HostListener('dragover', [ '$event' ])
  onDragOver(event: DragEvent) {
    this.preventAndStop(event);

    const transfer = event.dataTransfer;

    if (!this.asArray(transfer.items).some(i => this.checkMimeSupported(i.type))) {
      transfer.dropEffect = 'none';
      return;
    }

    transfer.dropEffect = 'copy';
    this.filesOver.emit(true);
  }

  @HostListener('dragleave', [ '$event' ])
  onDragLeave(event: DragEvent): void {
    if (event.currentTarget === this.element[0]) {
      return;
    }

    this.preventAndStop(event);
    this.filesOver.emit(false);
  }

  @HostListener('drop', [ '$event' ])
  onDrop(event: DragEvent): void {
    this.preventAndStop(event);
    const transfer = event.dataTransfer;
    if (!transfer) {
      return;
    }
    const files = this.getAllowedFiles(transfer.items);

    this.filesOver.emit(false);
    this.filesDrop.emit(files);
  }

  private preventAndStop(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
  }

  private checkMimeSupported(mime: string): boolean {
    return this.allowedMimes.size === 0 || this.allowedMimes.has(mime);
  }

  private getAllowedFiles(fileList: DataTransferItemList): File[] {
    return this
      .asArray(fileList)
      .filter(i => this.checkMimeSupported(i.type))
      .map(i => i.getAsFile());
  }

  private asArray(fileList: DataTransferItemList): DataTransferItem[] {
    return Array.prototype.slice.call(fileList);
  }
}
