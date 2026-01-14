import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RainbowTextDirective } from '../../directives/rainbow-text.directive';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RainbowTextDirective],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {}
