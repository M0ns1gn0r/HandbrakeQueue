import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FileService } from './file.service';
import { FileInfo } from './file-info';
import * as videojs from 'video.js';

@Component({
  templateUrl: 'scripts/file.component.html'
})
export class FileComponent implements OnInit, OnDestroy {
  file: FileInfo;
  private initialized = false;

  constructor(
    private router: Router,
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
        console.warn('The file with the passed "idx" parameter does not exist.');
        this.router.navigateByUrl('/drop-area');
        this.file = { config: { segment: {} }} as FileInfo;
        return;
      }

      this.file = this.fileService.files[idx];
      // TODO: make a PR to add missing properties to videojs.PlayerOptions.
      const playerOptions = {
        sources: [{
          src:  this.file.path,
          type: 'video/mp4'
        }],
        fluid: false,
        autoplay: false
      };
      videojs('video', playerOptions);

      this.initialized = true;
    });
  }

  ngOnDestroy() {
    if (this.initialized) {
      videojs('video').dispose();
    }
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
}
