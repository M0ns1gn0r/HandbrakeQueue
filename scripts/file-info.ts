import * as path from 'path';

export class FileInfo {
  name: string;
  path: string;
  size: string;
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
  preset: Preset = Preset.Canon9X;

  constructor(file: File) {
    const dirName  = path.dirname(file.path);
    if (dirName.toLowerCase().endsWith(path.sep + 'videosrc')) {
      this.targetPath = path.join(dirName, '..', file.name);
    } else {
      this.targetPath = path.join(dirName, 'transcoded', file.name);
    }
  }
}

/** Available encoding presets. */
export enum Preset {
  Canon9X = 1,
  IPad,
  Nikon
}

export interface VideoSegment {
  firstSecond?: number;
  lastSecond?: number;
}