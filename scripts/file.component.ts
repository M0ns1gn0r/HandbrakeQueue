import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FileService } from './file.service';
import { FileInfo } from './file-info';
import * as videojs from 'video.js';

@Component({
  templateUrl: 'scripts/file.component.html'
})
export class FileComponent implements OnInit, OnDestroy {
  /** The currently displayed file. */
  public file: FileInfo;

  /** Index of the currently displayed file. */
  private idx: number;
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
      this.idx = +idxString;
      if (this.fileService.files.length <= this.idx) {
        console.warn('The file with the passed "idx" parameter does not exist.');
        this.router.navigateByUrl('/drop-area');
        this.file = { config: { segment: {} }} as FileInfo;
        return;
      }

      this.file = this.fileService.files[this.idx];

      const videoSource = { src: this.file.path, type: 'video/mp4' };
      if (this.initialized) {
        videojs('video').src(videoSource);
      }
      else {
        videojs('video', {
            sources: [ videoSource ],
            fluid: false,
            autoplay: false
        });
        this.initialized = true;
      }
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

  canGoPrev(): boolean {
    return this.idx > 0;
  }

  canGoNext(): boolean {
    return this.idx < this.fileService.files.length - 1;
  }

  prev(): void {
    this.router.navigateByUrl(`/file/${this.idx - 1}`);
  }

  next(): void {
    this.router.navigateByUrl(`/file/${this.idx + 1}`);
  }
}
