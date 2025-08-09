import { Routes } from '@angular/router';
import { Dashboard } from "./dashboard/dashboard";
import { StateDirectory } from "./state-directory/state-directory";

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: Dashboard},
  { path: 'state-directory', component: StateDirectory},
  { path: '**', redirectTo: '/dashboard' } // Fallback route
];
