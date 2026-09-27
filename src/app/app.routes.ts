import { inject } from '@angular/core';
import { Router, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { AboutPageComponent } from './pages/about-page/about-page.component';
import { EventsPageComponent } from './pages/events-page/events-page.component';
import { EventPageComponent } from './pages/event-page/event-page.component';

export const routes: Routes = [
    {
        // The site starts on the home page
        path: '',
        pathMatch: 'full',
        redirectTo: 'home'
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
        path: 'events',
        component: EventsPageComponent,
        title: 'Events - The Marlborough Playhouse'
    },
    {
        // Title is set from the event once it has loaded
        path: 'events/:id',
        component: EventPageComponent,
        title: 'Events - The Marlborough Playhouse'
    },
    {
        // Old address for the events page
        path: 'booking',
        redirectTo: 'events'
    },
    {
        // Private hire now lives on the home page; keep old links working
        path: 'private-hire',
        component: HomePageComponent,
        canActivate: [() => inject(Router).createUrlTree(['/home'], { fragment: 'private-hire' })]
    }
];
