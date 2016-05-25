import {Component,ElementRef, Renderer, OnDestroy, OnInit, ViewEncapsulation, ViewChild, Input} from '@angular/core';
import {TabsPage} from './../../pages/tabs/tabs';
import {Button, IonicApp, Events, Modal, Icon, Nav} from 'ionic-angular';
import {ConsoleButtonDraggable} from './consoleButtonDraggable.directive';
import {ConsoleDataProvider} from '../../providers/consoleData.provider';

@Component({
  selector: 'console-button',
  template: `<button button-draggable [hidden]="isConsoleOpen" (click)="consoleOpen()" dark outline><ion-icon name="move"></ion-icon> &nbsp;
  <span class="errors">{{getErrors()}}E</span> &nbsp;
  <span class="warnings">{{getWarnings()}}W</span> &nbsp;
  <span class="logs">{{getLogs()}}L</span> &nbsp; | &nbsp;
  Console &nbsp;
  <ion-icon name="open"></ion-icon>
  </button>`,
  styles: [`console-button .button {
    position: fixed;
    bottom: 10px;
    left: 10px;
    z-index: 9999;
    background: #FFFFFF;
  }
  console-button .button .errors {
    color: #ee3426;
  }
  console-button .button .warnings {
    color: #7c6e2c;
  }
  console-button .button .logs {
    color: #41af0f;
  }
`],
  encapsulation: ViewEncapsulation.None,
  directives: [Button, ConsoleButtonDraggable, Icon]
})
export class ConsoleButtonComponent {
  @Input('content') nav: Nav;

  isConsoleOpen: boolean;

 constructor(private events: Events, private _consoleDataProvider: ConsoleDataProvider) {
   this.isConsoleOpen = false;


   this.events.subscribe('console:closed', () => {
     this.isConsoleOpen = false;
   });
 }

 consoleOpen() {

  let modal = Modal.create(TabsPage);

  modal.onDismiss(data => {
       this.isConsoleOpen = false;
  });

  this.isConsoleOpen = true;
  this.nav.present(modal);
}

getErrors() {
  return this._consoleDataProvider.getItemTypeCount('error');
}

getWarnings() {
  return this._consoleDataProvider.getItemTypeCount('warn');
}

getLogs() {
  return this._consoleDataProvider.getItemTypeCount('log');
}

}
