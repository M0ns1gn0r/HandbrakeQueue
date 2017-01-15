import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FileService } from './file.service';
import { FileInfo } from './file-info';

@Component({
  template: `
  <div>
    <a routerLink="/drop-area">Back</a>
    <p>The file will be here</p>
  </div>`
})
export class FileComponent implements OnInit {
  file: FileInfo;

  constructor(
    private route: ActivatedRoute,
    private fileService: FileService) {
  }

  ngOnInit() {
    this.route.params.subscribe(ps => {
      const idxString = ps['idx'];
      if (!idxString) {
        throw new Error('The "idx" parameter was not specified.');
      }
      const idx = +idxString;

      if (this.fileService.files.length <= idx) {
        throw new Error('The file with the passed "idx" parameter does not exist.');
      }

      this.file = this.fileService.files[idx];
    });
  }
}
