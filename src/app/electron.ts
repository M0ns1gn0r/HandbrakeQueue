const electron = (window as any).electron;

export const fs = {
  writeFile: (filePath: string, content: string): Promise<{ success: boolean, error?: string }> =>
    electron.fs.writeFile(filePath, content)
}

export const dialog = {
  showSaveDialog: (options: { title: string, defaultPath: string }): Promise<{ canceled: boolean, filePath?: string }> => 
    electron.dialog.showSaveDialog(options)
}

export interface PathParseResult {
  /** The root of the path such as '/' or 'c:\' */
  root: string;
  /** The full directory path such as '/home/user/dir' or 'c:\path\dir' */
  dir: string;
  /** The file name including extension (if any) such as 'index.html' */
  base: string;
  /** The file extension (if any) such as '.html' */
  ext: string;
  /** The file name without extension (if any) such as 'index' */
  name: string;
}

export const path = {
  dirname: (p: string): string => electron.path.dirname(p),
  basename: (p: string): string => electron.path.basename(p),
  join: (...paths: string[]): string => electron.path.join(...paths),
  parse: (p: string): PathParseResult => electron.path.parse(p),
  sep: (): "\\" | "/" => electron.path.sep
}