import { Component } from '@angular/core';
import { PopInDirective } from '../../directives/pop-in.directive';

@Component({
  selector: 'app-about-page',
  standalone: true,
  imports: [PopInDirective],
  templateUrl: './about-page.component.html',
  styleUrl: './about-page.component.css'
})
export class AboutPageComponent {

}
