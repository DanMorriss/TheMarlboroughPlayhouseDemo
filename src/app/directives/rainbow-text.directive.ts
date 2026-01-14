import { AfterViewInit, Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[appRainbowText], .rainbow-text',
  standalone: true,
})
export class RainbowTextDirective implements AfterViewInit {
  constructor(private el: ElementRef) {}

  ngAfterViewInit() {
    this.randomizeColors();
  }

  randomizeColors() {
    const element = this.el.nativeElement;
    const text = element.textContent || '';
    element.innerHTML = '';

    for (let char of text) {
      const span = document.createElement('span');
      span.textContent = char;
      span.style.color = this.getRandomColor();
      element.appendChild(span);
    }
  }

  getRandomColor(): string {
    const colors = [
      '#FF6B6B',
      '#4ECDC4',
      '#45B7D1',
      '#FFA07A',
      '#98D8C8',
      '#F7DC6F',
      '#BB8FCE',
      '#85C1E2',
      '#F8B88B',
      '#FAD7A1',
      '#D98880',
      '#85929E',
      '#F1948A',
      '#AED6F1',
      '#A9DFBF',
      '#F9E79F',
      '#D7BDE2',
      '#A3E4D7',
      '#FAD7A0',
      '#EDBB99',
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }
}
