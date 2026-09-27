import { Component } from '@angular/core';
import { RainbowTextDirective } from '../../directives/rainbow-text.directive';

@Component({
  selector: 'app-private-hire-page',
  standalone: true,
  imports: [RainbowTextDirective],
  templateUrl: './private-hire-page.component.html',
  styleUrl: './private-hire-page.component.css',
})
export class PrivateHirePageComponent {}
