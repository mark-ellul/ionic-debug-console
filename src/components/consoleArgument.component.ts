import {Component, Input} from 'angular2/core';
import {ConsoleArgumentCodeComponent} from './consoleArgumentCode.component';

@Component({
  selector: 'console-argument',
  template: `<span (click)="toggleExpand()">{{arg.type}}</span>
  <div class="console-output-code" [class.expanded]="isExpanded">
    <console-argument-code (click)="toggleExpand()" [value]="arg.value"></console-argument-code>
  </div>`,
   directives: [ConsoleArgumentCodeComponent]
})
export class ConsoleArgumentComponent {
  @Input()
  arg: any;

  isExpanded: boolean;

  constructor() {
    this.isExpanded = false;
  }

  toggleExpand() {
    if(this.isExpanded){
      this.isExpanded = false;
    }else{
      this.isExpanded = true;
    }
  }
}
