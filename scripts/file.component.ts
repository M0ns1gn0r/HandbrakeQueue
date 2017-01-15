import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FileService } from './file.service';
import { FileInfo, Preset } from './file-info';

@Component({
  template: `
  <div>
    <a routerLink="/drop-area">Back</a>
    <br />
    <br />
    <section>
      <div>
        <strong>Target path:</strong>
        <span>{{file.config.targetPath}}</span>
      </div>
      <div>
        <strong>Segment:</strong>
        <span>{{getSegmentInfo()}}</span>
      </div>
      <div>
        <strong>Rotate:</strong>
        <span>{{file.config.rotate === 0 ? 'No' : file.config.rotate + ' degrees'}}</span>
      </div>
      <div>
        <strong>Preset:</strong>
        <span>{{getPresetName()}}</span>
      </div>
    </section>
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

  getSegmentInfo(): string {
    const seg = this.file.config.segment;
    if (!seg) {
      return 'Full video';
    }
    if (!seg.lastSecond) {
      return `From ${seg.firstSecond}-th second till the end.`;
    }
    return `From the beginning till ${seg.lastSecond}-th second.`;
  }

  getPresetName(): string {
    return Preset[this.file.config.preset];
  }
}
