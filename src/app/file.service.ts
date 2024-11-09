import { Injectable } from '@angular/core';
import { FileInfo } from './file-info';

/** Represents a service which contains video files being currently processed. */
@Injectable({ providedIn: 'root' })
export class FileService {
  files: FileInfo[] = [];

  add(newFile: File): void {
    if (!this.files.some(fi => fi.file.path === newFile.path)) {
      this.files.push(new FileInfo(newFile));
    }
  }

  remove(fileIndex: number): void {
    if (this.files.length <= fileIndex) {
        throw new Error('File index is out of bounds.');
    }
    this.files.splice(fileIndex, 1);
  }

  clear(): void {
    this.files = [];
  }
}