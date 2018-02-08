import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  TemplateRef
} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

@Component({
  selector: 'tag-input',
  templateUrl: './tag-input.component.html',
  styleUrls: ['./tag-input.component.less'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => TagInputComponent),
    multi: true
  }]
})
export class TagInputComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy, ControlValueAccessor {
  @Input() class: string = '';
  @Input() ngStyle: string = '';
  @Input() placeholder: string = '';
  @Input() tagLimit: number = 0;
  @Input() typeaheadLimit: number = 8;
  @Input() tagList: any[] = [];
  @Input() template: TemplateRef<any>;
  @Input() tagTemplate: TemplateRef<any>;
  @Input() allowAdd: boolean = false;
  @Input() bsRemove: boolean = false;
  @Input() readonly: boolean = false;
  @Input() disabled: boolean = false;
  @Input() required: boolean = false;

  @Input() searchModel: string;
  @Output() searchModelChange = new EventEmitter();

  private innerValue;
  private element;
  private clickHandlerCaller;
  private dismissClickHandlerCaller;

  private onTouchedCallback = (_) => {};
  private onChangeCallback = (_) => {};

  constructor(private _element: ElementRef) {
    this.element = _element.nativeElement;
  }

  get value(): any {
    return this.innerValue;
  }

  set value(v: any) {
    if (v !== this.innerValue) {
      this.innerValue = v;
      this.onChangeCallback(this.innerValue);
    }
  }

  get textInput() {
    return this.element.querySelector('input.text-input');
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    // debugger;
    // if (changes.hasOwnProperty('readonly')){
    //   changes.readonly.currentValue;
    // }
  }

  ngAfterViewInit() {
    this.registerAllEvent();
  }

  ngOnDestroy() {
    this.unRegisterAllEvent();
  }

  writeValue(obj: any): void {
    if (Array.isArray(obj)) {
      this.innerValue = obj;
    }
  }

  registerOnChange(fn: any): void {
    this.onChangeCallback = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouchedCallback = fn;
  }

  checkSearchBox() {
    const val = this.textInput.value;
    const hash_position = val.indexOf('#');
    const space_position = val.indexOf(' ', hash_position);
    if (hash_position !== -1) {
      const pushing_text = (space_position !== -1 ? val.substr(hash_position, space_position) : val.substr(hash_position));
      if (pushing_text.trim() !== '#') {
        this.addTag(pushing_text);
        this.searchModel = '';
      }
    }
  }

  typeheadOnSelect(item) {
    this.searchModel = '';
    this.addTag(item);
    this.textInput.focus();
  }

  addTag(item) {
    if (!Array.isArray(this.innerValue)) {
      this.innerValue = [];
    }

    // Check Tag Count Is More Then Limit
    if (this.tagLimit > 0 && Array.isArray(this.innerValue) && this.innerValue.length >= this.tagLimit) {
      // console.log('tag is max limited');
    }
    else if (!this.innerValue.includes(item)) {
      this.innerValue.push(item);
      this.onChangeCallback(this.innerValue);
      // console.log('addTag');
    }
  }

  removeTag(item) {
    if (!Array.isArray(this.innerValue)) {
      this.innerValue = [];
    }

    const index = this.innerValue.indexOf(item);
    this.innerValue.splice(index, 1);
    this.onChangeCallback(this.innerValue);
    // console.log('removeTag');
  }

  popTag() {
    if (!Array.isArray(this.innerValue)) {
      this.innerValue = [];
    }

    this.innerValue.pop();
    this.onChangeCallback(this.innerValue);
    // console.log('popTag');
  }


  clickHandler(evt) {
    if (!this.element.hasFocus) {
      this.element.hasFocus = true;
      this.element.querySelector('.tag-container').classList.add('focus');
      this.textInput.focus();
      this.element.dispatchEvent(new Event('focus'));
      // console.log('focused');
    }
  }

  dismissClickHandler(evt) {
    // var typehead_id = $element.find('.text-input').attr('aria-owns');
    // var $typehead = angular.element(document.getElementById(typehead_id));
    if (this.element.hasFocus && !this.element.contains(evt.target) /*&& !$typehead[0].contains(evt.target)*/) {
      this.element.hasFocus = false;
      this.element.querySelector('.tag-container').classList.remove('focus');
      this.textInput.blur();
      if (this.allowAdd) {
        this.checkSearchBox();
      }
      this.element.dispatchEvent(new Event('blur'));
      // console.log('blured');
    }
  }

  typeheadIsOpen() {
    return (this.element.querySelector('typeahead-container') !== null);
  }

  registerAllEvent() {
    this.textInput.addEventListener('keydown', (event) => {
      // add tag on enter(13) or space(32)
      if ([13, 32].includes(event.keyCode)) {
        if (this.allowAdd && !this.typeheadIsOpen()) {
          this.checkSearchBox();
        }
      }

      // removeTagOnBackspace(8)
      if ([8].includes(event.keyCode) && event.target.selectionStart === 0 && event.target.selectionEnd === 0) {
        if (this.bsRemove) {
          this.popTag();
        }
      }

      // Check Tag Count Is More Then Limit
      if (this.tagLimit > 0 && Array.isArray(this.innerValue) && this.innerValue.length >= this.tagLimit) {
        event.preventDefault();
        event.stopPropagation();
      }
    });

    this.clickHandlerCaller = this.clickHandler.bind(this);
    this.dismissClickHandlerCaller = this.dismissClickHandler.bind(this);
    this.element.addEventListener('click', this.clickHandlerCaller);
    document.documentElement.addEventListener('click', this.dismissClickHandlerCaller);
  }

  unRegisterAllEvent() {
    this.element.removeEventListener('click', this.clickHandlerCaller);
    document.documentElement.removeEventListener('click', this.dismissClickHandlerCaller);
  }
}
