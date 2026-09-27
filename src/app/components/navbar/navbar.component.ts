import { Component, ElementRef, NgZone, OnDestroy, OnInit, ViewChild, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RainbowTextDirective } from '../../directives/rainbow-text.directive';

interface NavLink {
  label: string;
  path: string;
  fragment?: string;
}

// How far (px) the user has to scroll up before the sticky bar slides in
const REVEAL_DISTANCE = 40;

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RainbowTextDirective],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit, OnDestroy {
  readonly links: NavLink[] = [
    { label: 'HOME', path: '/home' },
    { label: 'PLAN YOUR VISIT', path: '/home', fragment: 'plan-your-visit' },
    { label: 'PRIVATE HIRE', path: '/home', fragment: 'private-hire' },
    { label: 'CONTACT', path: '/home', fragment: 'contact' },
    { label: 'EVENTS', path: '/events' },
  ];

  readonly menuOpen = signal(false);
  readonly stickyVisible = signal(false);
  readonly stickyMenuOpen = signal(false);

  @ViewChild('header', { static: true }) private header!: ElementRef<HTMLElement>;

  private readonly zone = inject(NgZone);
  private lastScrollY = 0;
  private scrolledUpBy = 0;
  private frame = 0;

  ngOnInit() {
    this.lastScrollY = window.scrollY;
    // Scroll events don't need change detection unless the bar's state changes
    this.zone.runOutsideAngular(() => {
      window.addEventListener('scroll', this.onScroll, { passive: true });
    });
  }

  ngOnDestroy() {
    window.removeEventListener('scroll', this.onScroll);
    cancelAnimationFrame(this.frame);
  }

  toggleMenu() {
    this.menuOpen.update((open) => !open);
  }

  closeMenu() {
    this.menuOpen.set(false);
  }

  toggleStickyMenu() {
    this.stickyMenuOpen.update((open) => !open);
  }

  closeStickyMenu() {
    this.stickyMenuOpen.set(false);
  }

  private readonly onScroll = () => {
    if (this.frame) return;
    this.frame = requestAnimationFrame(() => {
      this.frame = 0;
      this.updateStickyBar();
    });
  };

  // Show the sticky bar once the user scrolls up a little after passing the
  // main header, and hide it again when they scroll down or reach the header
  private updateStickyBar() {
    const y = window.scrollY;
    const delta = y - this.lastScrollY;
    this.lastScrollY = y;

    const headerBottom = this.header.nativeElement.getBoundingClientRect().bottom + y;
    let visible = this.stickyVisible();

    // Keep the bar open while its menu is open, unless back at the main header
    if (y <= headerBottom || (delta > 0 && !this.stickyMenuOpen())) {
      visible = false;
      this.scrolledUpBy = 0;
    } else if (delta < 0) {
      this.scrolledUpBy -= delta;
      if (this.scrolledUpBy >= REVEAL_DISTANCE) visible = true;
    }

    if (visible !== this.stickyVisible()) {
      this.zone.run(() => {
        this.stickyVisible.set(visible);
        if (!visible) this.stickyMenuOpen.set(false);
      });
    }
  }
}
