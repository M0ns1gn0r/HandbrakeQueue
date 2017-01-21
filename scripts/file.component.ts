import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FileService } from './file.service';
import { FileInfo, Preset } from './file-info';

@Component({
  templateUrl: 'scripts/file.component.html'
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
    if (!seg.firstSecond && !seg.lastSecond) {
      return 'Full video';
    }
    if (!seg.firstSecond) {
      return `From the beginning till ${seg.lastSecond}-th second.`;
    }
    if (!seg.lastSecond) {
      return `From ${seg.firstSecond}-th second till the end.`;
    }
    return `From ${seg.firstSecond}-th till ${seg.lastSecond}-th second.`;
  }

  getPresetName(preset: Preset): string {
    return Preset[preset];
  }
}
