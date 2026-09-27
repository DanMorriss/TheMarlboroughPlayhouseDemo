import { Component } from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { AboutPageComponent } from "../about-page/about-page.component";
import { ContactPageComponent } from "../contact-page/contact-page.component";
import { PrivateHirePageComponent } from "../private-hire-page/private-hire-page.component";
import { ParallaxDirective } from '../../directives/parallax.directive';

interface CollagePhoto {
  src: string;
  alt: string;
  // Position and width as percentages of the collage box
  left: number;
  top: number;
  width: number;
  rotate: number;
  z: number;
  // Parallax speed relative to the page scroll
  speed: number;
}

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [NavbarComponent, AboutPageComponent, PrivateHirePageComponent, ContactPageComponent, ParallaxDirective],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent {
  collagePhotos: CollagePhoto[] = [
    { src: 'assets/images/ph-10.jpeg', alt: 'The front of The Old Chapel on The Parade, Marlborough', left: 0, top: 2, width: 32, rotate: -6, z: 2, speed: 0.2 },
    { src: 'assets/images/ph-15.jpeg', alt: 'Soft play balls through an archway in the play village', left: 64, top: 0, width: 34, rotate: 5, z: 2, speed: 0.1 },
    { src: 'assets/images/ph-6.jpeg', alt: 'The main play hall with its play village, slide and chapel windows', left: 21, top: 8, width: 46, rotate: -2, z: 3, speed: 0.04 },
    { src: 'assets/images/ph-12.jpeg', alt: 'Rainbow stacking blocks beside an arched doorway', left: 2, top: 50, width: 34, rotate: 4, z: 4, speed: -0.09 },
    { src: 'assets/images/ph-22.jpeg', alt: 'A wooden play tea set with cakes and cups', left: 38, top: 54, width: 30, rotate: -4, z: 5, speed: 0.17 },
    { src: 'assets/images/ph-3.jpeg', alt: 'A cosy den with fairy lights and cushions', left: 67, top: 44, width: 31, rotate: 7, z: 3, speed: -0.14 },
  ];
}
