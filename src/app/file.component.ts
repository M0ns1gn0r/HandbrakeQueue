import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import * as videojs from 'video.js';
import { FileInfo } from './file-info';
import { FileService } from './file.service';

@Component({
  selector: 'hq-file',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './file.component.html',
})
export class FileComponent implements OnInit, OnDestroy {
  /** The currently displayed file. */
  public file: FileInfo = { config: { segment: {} }} as FileInfo;

  /** Index of the currently displayed file. */
  private idx: number = 0;
  private initialized = false;
  private originalTitle = "";

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fileService: FileService,
    private titleService: Title) {
  }

  private loadFile() {
    this.titleService.setTitle(
      `${this.originalTitle} | Video ${this.idx + 1} of ${this.fileService.files.length}`);

    this.file = this.fileService.files[this.idx];

    const videoSource = { src: this.file.path, type: 'video/mp4' };
    if (this.initialized) {
      videojs.default('video').src(videoSource);
    }
    else {
      videojs.default('video', {
          sources: [ videoSource ],
          fluid: false,
          autoplay: false
      });
      this.initialized = true;
    }
  }

  ngOnInit() {
    this.originalTitle = this.titleService.getTitle();
    this.route.params.subscribe(ps => {
      const idxString = ps['idx'];
      if (!idxString) {
        throw new Error('The "idx" parameter was not specified.');
      }
      this.idx = +idxString;
      if (this.fileService.files.length <= this.idx) {
        console.warn('The file with the passed "idx" parameter does not exist.');
        this.router.navigateByUrl('/drop-area');
        return;
      }

      this.loadFile();
    });
  }

  ngOnDestroy() {
    this.titleService.setTitle(this.originalTitle);
    if (this.initialized) {
      videojs.default('video').dispose();
    }
  }
/*
  getSegmentInfo(): string {
    if (!this.file) {
      return '';
    }

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
*/
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

  /** Navigates back to the list. */
  back(): void {
    this.router.navigateByUrl("/drop-area");
  }

  remove(): void {
    if (this.canGoNext()) {
      this.fileService.remove(this.idx);
      // Reload the file data as the index now points to the next one.
      this.loadFile();
    } else {
      this.fileService.remove(this.idx);
      this.back();
    }
  }
}
