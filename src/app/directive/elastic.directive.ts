import {AfterViewInit, Directive, ElementRef, HostListener} from '@angular/core';

@Directive({
  selector: '[elastic]',
  exportAs: 'elastic'
})
export class ElasticDirective implements AfterViewInit {
  @HostListener('input', ['$event.target'])
  onInput(textArea: HTMLTextAreaElement): void {
    this.adjust();
  }

  constructor(public element: ElementRef) {
  }

  ngAfterViewInit(): void {
    this.adjust();
  }

  adjust(): void {
    this.element.nativeElement.style.overflow = 'hidden';
    this.element.nativeElement.style.height = '0px';
    this.element.nativeElement.style.height = +this.element.nativeElement.scrollHeight + 2 + 'px';
  }
}
