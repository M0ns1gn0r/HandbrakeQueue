export class FileInfo {
  constructor(public file: File) {
    this.name = file.name;
    this.path = file.path;
    this.size = (file.size / (1024*1024)).toFixed(2) + " Mb";
  }  

  name: string;
  path: string;
  size: string;
}
