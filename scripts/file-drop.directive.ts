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
  /** A set of file extensions allowed to be dropped. Example: [".mp4", ".avi", ".mov"]. */
  @Input() allowedExtensions = new Set<string>();
  @Output() filesOver = new EventEmitter<boolean>();
  @Output() filesDrop = new EventEmitter<File[]>();

  constructor(
    private element: ElementRef) {
  }

  @HostListener('dragover', [ '$event' ])
  onDragOver(event: DragEvent) {
    this.preventAndStop(event);

    const transfer = event.dataTransfer;

    if (this.getAllowedFiles(transfer.items).length === 0) {
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

  private getAllowedFiles(fileList: DataTransferItemList): File[] {
    const files: File[] = Array.prototype
      .slice.call(fileList)
      .map((i: DataTransferItem) => i.getAsFile());
    if (this.allowedExtensions.size === 0) {
      return files; // All files allowed.
    }
    return files.filter(f => {
      const extension = path.extname(f.name).toLowerCase();
      return this.allowedExtensions.has(extension);
    });
  }
}
