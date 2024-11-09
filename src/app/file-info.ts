//import * as path from 'path';

// TODO: Remove this once we have a real path implementation.
const path = {
  dirname: (p: string) => p,
  join: (...paths: string[]) => paths.join('/'),
  basename: (p: string) => p,
  parse: (p: string) => ({ name: p, ext: '' }),
  sep: '/'
}

export class FileInfo {
  name: string;
  path: string;
  size: string;
  duration: number = 0;
  config: TranscodeConfig;

  constructor(public file: File) {
    this.name = file.name;
    this.path = file.path;
    this.size = (file.size / (1024 * 1024)).toFixed(2) + ' MiB';
    this.config = new TranscodeConfig(file);
  }
}

/** Various configuration options used for transcoding.  */
export class TranscodeConfig {
  targetPath: string;
  segment: VideoSegment = {};
  rotate: -90 | 0 | 90 | 180 = 0;

  constructor(file: File) {
    const fileName = this.parseFileName(file);
    const dirName = path.dirname(file.path);
    if (dirName.toLowerCase().endsWith(path.sep + 'videosrc')) {
      this.targetPath = path.join(dirName, '..', fileName);
    } else {
      this.targetPath = path.join(dirName, 'transcoded', fileName);
    }
  }

  getTargetName(): string {
    const { name , ext } = path.parse(this.targetPath);
    return name + ext;
  }

  hasSegment(): boolean {
    return !!this.segment.firstSecond || !!this.segment.lastSecond;
  }

  private parseFileName(file: File): string {
    let fileName = path.basename(file.path);

    const parts = new RegExp(/^(\d*)\s*---\s*(\d*)\s*(.*)/).exec(fileName);
    if (parts && parts.length === 4) {
      if (parts[1]) {
        this.segment.firstSecond = +parts[1];
      }
      if (parts[2]) {
        this.segment.lastSecond = +parts[2];
      }
      // The rest is the real file name.
      fileName = parts[3];
    }

    return fileName;
  }
}

export interface VideoSegment {
  firstSecond?: number;
  lastSecond?: number;
}