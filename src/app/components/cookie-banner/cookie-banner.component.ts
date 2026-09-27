import { Component, inject } from '@angular/core';
import { ConsentService } from '../../consent/consent.service';

@Component({
  selector: 'app-cookie-banner',
  standalone: true,
  templateUrl: './cookie-banner.component.html',
  styleUrl: './cookie-banner.component.css',
})
export class CookieBannerComponent {
  readonly consent = inject(ConsentService);
}
