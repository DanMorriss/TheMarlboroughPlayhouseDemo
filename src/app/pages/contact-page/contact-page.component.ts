import { Component } from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { PopInDirective } from '../../directives/pop-in.directive';

@Component({
  selector: 'app-contact-page',
  standalone: true,
  imports: [NavbarComponent, PopInDirective],
  templateUrl: './contact-page.component.html',
  styleUrl: './contact-page.component.css'
})
export class ContactPageComponent {

}
