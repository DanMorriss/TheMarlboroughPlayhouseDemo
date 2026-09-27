import { Component, inject } from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { ConsentService } from '../../consent/consent.service';

@Component({
  selector: 'app-cookie-policy-page',
  standalone: true,
  imports: [NavbarComponent],
  templateUrl: './cookie-policy-page.component.html',
  styleUrl: './cookie-policy-page.component.css',
})
export class CookiePolicyPageComponent {
  readonly consent = inject(ConsentService);
}
