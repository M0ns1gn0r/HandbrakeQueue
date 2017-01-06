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
} from '@angular/core';

import 'fileapi';

declare const FileAPI: any;

@Directive({ selector: '[fileDrop]' })
export class FileDropDirective {
  @Output() public filesOver = new EventEmitter<boolean>();
  @Output() public onFilesDrop = new EventEmitter<File[]>();

  public constructor(
    private element: ElementRef) {
  }

  @HostListener('dragover', [
    '$event',
  ])
  public onDragOver(event: DragEvent): void {
    const transfer = event.dataTransfer;

    if (!this.hasFiles(transfer.types)) {
      return;
    }

    transfer.dropEffect = 'copy';
    this.preventAndStop(event);
    this.emitFilesOver(true);
  }

  @HostListener('dragleave', [
    '$event',
  ])
  public onDragLeave(event: DragEvent): void {
    if (event.currentTarget === this.element[0]) {
      return;
    }

    this.preventAndStop(event);
    this.emitFilesOver(false);
  }

  @HostListener('drop', [
    '$event',
  ])
  public onDrop(event: DragEvent): void {
    const transfer = event.dataTransfer;
    if (!transfer) {
      return;
    }

    this.preventAndStop(event);
    this.emitFilesOver(false);
    this.emitFilesDrop(transfer.files);
  }

  // private readFile(file: File): void {
  //   const strategy = this.pickStrategy();

  //   if (!strategy) {
  //     this.emitFilesDrop(file);
  //   } else {
  //     // XXX Waiting for angular/zone.js#358
  //     const method = `readAs${strategy}`;

  //     FileAPI[method](file, (event: any) => {
  //       if (event.type === 'load') {
  //         this.emitFilesDrop(event.result);
  //       } else if (event.type === 'error') {
  //         throw new Error(`Couldn't read file '${file.name}'`);
  //       }
  //     });
  //   }
  // }

  private emitFilesOver(isOver: boolean): void {
    this.filesOver.emit(isOver);
  }

  private emitFilesDrop(files: FileList): void {
    const filesArray = Array.prototype.slice.call(files);
    this.onFilesDrop.emit(filesArray);
  }

  private preventAndStop(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
  }

  private hasFiles(types: string[]): boolean {
    return types && types.indexOf('Files') !== -1;
  }
}
