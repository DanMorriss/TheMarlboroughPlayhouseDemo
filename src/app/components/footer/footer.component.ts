import { Component, inject } from '@angular/core';
import { ConsentService } from '../../consent/consent.service';
import { NewsletterService } from '../../newsletter/newsletter.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css',
})
export class FooterComponent {
  readonly consent = inject(ConsentService);
  readonly newsletter = inject(NewsletterService);
  currentYear = new Date().getFullYear();
}
