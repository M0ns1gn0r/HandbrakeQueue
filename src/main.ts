import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

import 'video.js/dist/video-js.css';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => { console.error(err) })
