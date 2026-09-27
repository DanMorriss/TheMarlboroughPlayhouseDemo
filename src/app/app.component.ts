import { Component, inject } from '@angular/core';
import { Router, RouterOutlet, Scroll } from '@angular/router';
import { ViewportScroller } from '@angular/common';
import { filter } from 'rxjs';
import { NavbarComponent } from "./components/navbar/navbar.component";
import { FooterComponent } from "./components/footer/footer.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'the-marlborough-playhouse';

  private readonly viewportScroller = inject(ViewportScroller);
  private previousPath = '';

  constructor() {
    inject(Router)
      .events.pipe(filter((e): e is Scroll => e instanceof Scroll))
      .subscribe((e) => this.handleScroll(e));
  }

  // Start new pages at the top, then smoothly scroll to any #anchor so it's
  // clear the section is part of the page rather than a separate one.
  private handleScroll(e: Scroll) {
    // Back/forward navigation: restore the previous position
    if (e.position) {
      this.viewportScroller.scrollToPosition(e.position);
      return;
    }

    const event = e.routerEvent;
    const url = 'urlAfterRedirects' in event ? event.urlAfterRedirects : event.url;
    const path = url.split('#')[0];
    const pageChanged = path !== this.previousPath;
    this.previousPath = path;

    if (pageChanged) {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }

    if (e.anchor) {
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const anchor = e.anchor;
      // Wait a frame after jumping to the top so the scroll visibly starts there
      requestAnimationFrame(() => {
        document
          .getElementById(anchor)
          ?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
      });
    }
  }
}
