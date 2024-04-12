import { Routes } from '@angular/router';
import {AboutComponent} from "./components/about/about.component";
import {PlaceholderComponent} from "./components/placeholder/placeholder.component";

export const routes: Routes = [
  { path: '', component: PlaceholderComponent },
  { path: 'about', component: AboutComponent },
];
