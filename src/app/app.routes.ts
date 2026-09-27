import { inject } from '@angular/core';
import { Router, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { AboutPageComponent } from './pages/about-page/about-page.component';
import { BookingPageComponent } from './pages/booking-page/booking-page.component';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';

export const routes: Routes = [
    { 
        path: '',
        component: LandingPageComponent,
        title: 'The Marlborough Playhouse',
    },
    { 
        path: 'home',
        component: HomePageComponent,
        title: 'Home - The Marlborough Playhouse'
    },
    { 
        path: 'about',
        component: AboutPageComponent,
        title: 'About Us - The Marlborough Playhouse'
    },
    { 
        // Contact now lives on the home page; keep old links working
        path: 'contact',
        component: HomePageComponent,
        canActivate: [() => inject(Router).createUrlTree(['/home'], { fragment: 'contact' })]
    },
    { 
        path: 'booking',
        component: BookingPageComponent,
        title: 'Events - The Marlborough Playhouse'
    },
    {
        // Private hire now lives on the home page; keep old links working
        path: 'private-hire',
        component: HomePageComponent,
        canActivate: [() => inject(Router).createUrlTree(['/home'], { fragment: 'private-hire' })]
    }
];
