import { Component } from '@angular/core';
import { clipboard } from 'electron';
import { existsSync } from 'fs';

@Component({
  selector: 'my-app',
  template: `<h1>Hello {{name}}</h1>`,
})
export class AppComponent {
  name = 'Angular';

  constructor() {
      const text = existsSync("c:\\boot.txt") ? "exists" : "does not exist";
      clipboard.write({ text: text });
  };
}
