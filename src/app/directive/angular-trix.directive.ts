import {Directive, ElementRef, EventEmitter, forwardRef, Input, OnInit, Output} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

@Directive({
  selector: 'trix-editor[appAngularTrix]',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AngularTrixDirective),
      multi: true
    }]
})
export class AngularTrixDirective implements OnInit, ControlValueAccessor {
  @Output() trixInitialize: EventEmitter<any> = new EventEmitter();
  @Output() trixChange: EventEmitter<any> = new EventEmitter();
  @Output() trixSelectionChange: EventEmitter<any> = new EventEmitter();
  @Output() trixFocus: EventEmitter<any> = new EventEmitter();
  @Output() trixBlur: EventEmitter<any> = new EventEmitter();
  @Output() trixFileAccept: EventEmitter<any> = new EventEmitter();
  @Output() trixAttachmentAdd: EventEmitter<any> = new EventEmitter();
  @Output() trixAttachmentRemove: EventEmitter<any> = new EventEmitter();
  @Input() preventTrixFileAccept: boolean = false;

  private innerValue;
  private element;
  private onTouchedCallback = (_) => {};
  private onChangeCallback = (_) => {};

  constructor(private _element: ElementRef) {
    this.element = _element.nativeElement;
  }

  ngOnInit() {
    this.element.addEventListener('trix-initialize', () => {
      if (this.innerValue) {
        this.element.editor.loadHTML(this.innerValue);
      }

      this.element.addEventListener('trix-change', () => {
        this.innerValue = this.element.innerHTML;
        this.onChangeCallback(this.innerValue);
      });

      this.registerEvents('trix-initialize', 'trixInitialize');
      this.registerEvents('trix-change', 'trixChange');
      this.registerEvents('trix-selection-change', 'trixSelectionChange');
      this.registerEvents('trix-focus', 'trixFocus');
      this.registerEvents('trix-blur', 'trixBlur');
      this.registerEvents('trix-file-accept', 'trixFileAccept');
      this.registerEvents('trix-attachment-add', 'trixAttachmentAdd');
      this.registerEvents('trix-attachment-remove', 'trixAttachmentRemove');
    });
  }

  registerEvents(type, method) {
    this.element.addEventListener(type, (e) => {
      if (type === 'trix-file-accept' && this.preventTrixFileAccept) {
        e.preventDefault();
      }
      this[method].emit({e: e, editor: this.element.editor});
    });
  }

  writeValue(val: any): void {
    this.innerValue = val;
  }

  registerOnChange(fn: any): void {
    this.onChangeCallback = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouchedCallback = fn;
  }

}
