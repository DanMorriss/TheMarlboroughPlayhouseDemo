import { Component } from '@angular/core';
import { ParallaxDirective } from '../../directives/parallax.directive';
import { PopInDirective } from '../../directives/pop-in.directive';

@Component({
  selector: 'app-private-hire-page',
  standalone: true,
  imports: [ParallaxDirective, PopInDirective],
  templateUrl: './private-hire-page.component.html',
  styleUrl: './private-hire-page.component.css',
})
export class PrivateHirePageComponent {}
