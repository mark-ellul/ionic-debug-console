import {Component, ElementRef, Input} from '@angular/core';

declare var hljs: any;

@Component({
  selector: 'console-argument-code',
  template: `<code class="json">{{value}}</code>`,
})
export class ConsoleArgumentCodeComponent {
  @Input()
  value: any;

  constructor(private el:ElementRef) {
  }

  // how to get to native Element of component
  // http://stackoverflow.com/questions/30623825/how-to-use-jquery-with-angular2
  ngAfterViewInit() {
    if(typeof hljs != 'undefined'){
      if(this.el.nativeElement) {
        hljs.highlightBlock(this.el.nativeElement);
      }
    }
  }

}
