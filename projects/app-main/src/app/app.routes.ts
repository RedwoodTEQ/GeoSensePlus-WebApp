import { Routes } from '@angular/router';
import { Dashboard } from "./dashboard/dashboard";

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: Dashboard},
  { path: 'dashboard-test', component: Dashboard},
  { path: '**', redirectTo: '/dashboard' } // Fallback route
];
