import { Component } from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { RainbowTextDirective } from '../../directives/rainbow-text.directive';

@Component({
  selector: 'app-private-hire-page',
  standalone: true,
  imports: [NavbarComponent, RainbowTextDirective],
  templateUrl: './private-hire-page.component.html',
  styleUrl: './private-hire-page.component.css',
})
export class PrivateHirePageComponent {}
