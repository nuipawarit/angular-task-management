import {Directive, ElementRef, Input, OnInit} from '@angular/core';

@Directive({
  selector: '[appImgPopover]'
})
export class ImgPopoverDirective implements OnInit {
  @Input() src: string;
  element;
  bigImg: HTMLImageElement;

  constructor(private _element: ElementRef) {
    this.element = _element.nativeElement;
  }

  ngOnInit() {
    this.element.src = this.src;
    this.bigImg = document.createElement('img');
    this.bigImg.src = (this.src).replace('40x40', '150x150');

    this.element.addEventListener('mouseenter', (event) => {
      this.bigImg.style.position = 'absolute';
      this.bigImg.style.height = '250px';
      this.bigImg.style.top = (event.pageY - 100) + 'px';
      this.bigImg.style.left = (event.pageX + 20) + 'px';
      this.bigImg.style.borderRadius = '6px';
      this.bigImg.style.zIndex = '9999';
      document.querySelector('body').appendChild(this.bigImg);
    });

    this.element.addEventListener('mousemove', (event) => {
      this.bigImg.style.top = (event.pageY - 100) + 'px';
      this.bigImg.style.left = (event.pageX + 20) + 'px';
    });

    this.element.addEventListener('mouseleave', (event) => {
      this.bigImg.parentNode.removeChild(this.bigImg);
    });
  }
}
