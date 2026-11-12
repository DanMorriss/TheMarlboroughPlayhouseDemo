import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Injector,
  afterNextRender,
  computed,
  effect,
  inject,
  input,
  output,
  untracked,
  viewChild,
} from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { Sponsor } from '../../sponsors/sponsors';
import { SOCIAL_ICONS } from './social-icons';

const OPEN_MS = 560;
const CLOSE_MS = 280;
// Lets the bubble's pop and spray play before the dialog starts growing out of it
const OPEN_DELAY_MS = 200;
// The dialog grows from (and shrinks back to) this share of the bubble's size,
// matching the small point the bubble collapses to when it pops
const BUBBLE_SCALE = 0.3;

/**
 * Modal card with a sponsor's description and contact links. Uses a native
 * <dialog> so focus trapping, Escape to close and focus return come for free.
 * It grows out of the bubble that opened it and shrinks back into it on close.
 */
@Component({
  selector: 'app-sponsor-dialog',
  standalone: true,
  imports: [NgOptimizedImage],
  templateUrl: './sponsor-dialog.component.html',
  styleUrl: './sponsor-dialog.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SponsorDialogComponent {
  readonly sponsor = input<Sponsor | null>(null);
  /** The bubble the dialog grows out of and shrinks back into */
  readonly origin = input<HTMLElement | null>(null);
  readonly closed = output<void>();

  private readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');
  private readonly injector = inject(Injector);
  private closing = false;

  readonly icons = SOCIAL_ICONS;

  // Socials we have a link and a brand button for; the rest show as plain text
  readonly linkedSocials = computed(() =>
    (this.sponsor()?.socials ?? []).filter((social) => social.url && SOCIAL_ICONS[social.platform]),
  );
  readonly unlinkedSocials = computed(() =>
    (this.sponsor()?.socials ?? []).filter((social) => !(social.url && SOCIAL_ICONS[social.platform])),
  );

  // "+44" form for tel: links so they work from anywhere
  readonly phoneHref = computed(() => {
    const phone = this.sponsor()?.phone;
    return phone ? `tel:+44${phone.replace(/\s/g, '').replace(/^0/, '')}` : null;
  });

  constructor() {
    effect(() => {
      const dialog = this.dialog().nativeElement;
      if (this.sponsor() && !dialog.open) {
        dialog.showModal();
        // Wait for the sponsor's details to render so the dialog has its final size
        afterNextRender(() => this.animateOpen(dialog), { injector: this.injector });
      } else if (!this.sponsor() && dialog.open) {
        dialog.close();
      }
    });
  }

  close() {
    const dialog = this.dialog().nativeElement;
    if (!dialog.open || this.closing) return;
    this.closing = true;

    const finish = () => {
      dialog.close();
      dialog.getAnimations({ subtree: true }).forEach((animation) => animation.cancel());
      // Browsers that don't focus buttons on click (Safari) would otherwise drop focus to the page
      untracked(this.origin)?.focus({ preventScroll: true });
      this.closing = false;
    };

    const bubble = this.bubbleTransform(dialog);
    if (!bubble) {
      dialog.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 120, fill: 'forwards' }).finished.then(finish);
      return;
    }

    const colour = this.bubbleColour();
    this.card(dialog)?.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 120, fill: 'forwards' });
    this.animateBackdrop(dialog, [{ opacity: 1 }, { opacity: 0 }], CLOSE_MS);
    dialog
      .animate(
        [
          { transform: 'none', borderRadius: '24px', backgroundColor: '#fff', opacity: 1 },
          { opacity: 1, offset: 0.8 },
          { transform: bubble, borderRadius: '50%', backgroundColor: colour, opacity: 0 },
        ],
        { duration: CLOSE_MS, easing: 'cubic-bezier(0.55, 0, 0.8, 0.4)', fill: 'forwards' },
      )
      .finished.then(finish);
  }

  // Escape: run the same shrinking close instead of vanishing instantly
  onCancel(event: Event) {
    event.preventDefault();
    this.close();
  }

  // Clicks on the dialog element itself (not its contents) land on the backdrop
  onDialogClick(event: MouseEvent) {
    if (event.target === event.currentTarget) this.close();
  }

  private animateOpen(dialog: HTMLDialogElement) {
    const bubble = this.bubbleTransform(dialog);
    if (!bubble) {
      dialog.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 150 });
      return;
    }

    // Starts as a bubble in the logo's colour and turns into the white card as it grows
    const colour = this.bubbleColour();
    this.animateBackdrop(dialog, [{ opacity: 0 }, { opacity: 1 }], OPEN_MS);
    dialog.animate(
      [
        { transform: bubble, borderRadius: '50%', backgroundColor: colour, opacity: 0 },
        { opacity: 1, offset: 0.15 },
        { backgroundColor: colour, offset: 0.3 },
        { transform: 'none', borderRadius: '24px', backgroundColor: '#fff', opacity: 1 },
      ],
      { duration: OPEN_MS, delay: OPEN_DELAY_MS, easing: 'cubic-bezier(0.25, 1.15, 0.45, 1)', fill: 'backwards' },
    );
    // Contents fade in once the dialog has mostly grown, so they don't look squashed
    this.card(dialog)?.animate([{ opacity: 0 }, { opacity: 1 }], {
      duration: 240,
      delay: OPEN_DELAY_MS + OPEN_MS * 0.4,
      fill: 'backwards',
    });
  }

  // The bubble's burst colour, set as a CSS variable on the bubble by the Sponsors page
  private bubbleColour(): string {
    const origin = untracked(this.origin);
    const colour = origin ? getComputedStyle(origin).getPropertyValue('--burst-colour').trim() : '';
    return colour || '#f1d0c3';
  }

  /**
   * Transform that shrinks the dialog to a small circle at its bubble's centre.
   * Null when there's no bubble or the visitor prefers reduced motion, in which
   * case the dialog simply fades.
   */
  private bubbleTransform(dialog: HTMLDialogElement): string | null {
    const origin = untracked(this.origin);
    if (!origin || matchMedia('(prefers-reduced-motion: reduce)').matches) return null;

    const from = origin.getBoundingClientRect();
    const to = dialog.getBoundingClientRect();
    if (!from.width || !to.width) return null;

    const dx = from.left + from.width / 2 - (to.left + to.width / 2);
    const dy = from.top + from.height / 2 - (to.top + to.height / 2);
    const sx = (from.width * BUBBLE_SCALE) / to.width;
    const sy = (from.height * BUBBLE_SCALE) / to.height;
    return `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})`;
  }

  private card(dialog: HTMLDialogElement) {
    return dialog.querySelector<HTMLElement>('.sponsor-dialog-card');
  }

  private animateBackdrop(dialog: HTMLDialogElement, keyframes: Keyframe[], duration: number) {
    try {
      dialog.animate(keyframes, { duration, pseudoElement: '::backdrop', fill: 'both' });
    } catch {
      // Older browsers can't animate ::backdrop; it just appears and disappears
    }
  }
}
