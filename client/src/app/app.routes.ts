import { Routes } from '@angular/router';
import { UniversitySelectComponent } from './components/university-select/university-select';
import { BookingPageComponent } from './components/booking-page/booking-page';
import { Login } from './components/login/login';
import { ContactComponent } from './components/contact/contact';
import { DashboardComponent } from './components/dashboard/dashboard';

export const routes: Routes = [
    { path: '', component: UniversitySelectComponent },
    { path: 'booking/:id', component: BookingPageComponent },
    { path: 'login', component: Login },
    { path: 'admin', component: Login },
    { path: 'admin/dashboard', component: DashboardComponent },
    { path: 'contact', component: ContactComponent },
    { path: '**', redirectTo: '' }
];
