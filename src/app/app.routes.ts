import { Routes } from '@angular/router'
import { DropAreaComponent } from './drop-area.component';
import { FileComponent } from './file.component';

export const routes: Routes = [
    { path: 'drop-area', component: DropAreaComponent },
    { path: 'file/:idx', component: FileComponent },
    { path: '', redirectTo: '/drop-area', pathMatch: 'full' }
];
