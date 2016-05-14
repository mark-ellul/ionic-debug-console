import {Component,ElementRef, Renderer, OnDestroy, OnInit, ViewEncapsulation} from 'angular2/core';
import {TabsPage} from './../../pages/tabs/tabs';
import {Button, IonicApp, Events, Modal, Icon} from 'ionic-angular';
//import {Draggable} from './consoleButtonDraggable.directive';
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
  directives: [Button, ConsoleButtonDraggable, Icon],
})
export class ConsoleButtonComponent {
  isConsoleOpen: boolean;

 constructor(private app: IonicApp, private events: Events, private _consoleDataProvider: ConsoleDataProvider) {
   this.isConsoleOpen = false;


   this.events.subscribe('console:closed', () => {
     this.isConsoleOpen = false;
   });
 }

  // itemTapped(event) {
  //    this.nav.push(TabsPage);
  // }

 //  ngAfterViewInit() {
 //   var nav = this.app.getComponent('my-nav');
 //   // Let's navigate from TabsPage to Page1
 //   nav.push(TabsPage);
 // }

 consoleOpen() {
  var nav = this.app.getComponent('nav');
  // Let's navigate from TabsPage to Page1

  let modal = Modal.create(TabsPage);

  modal.onDismiss(data => {
       console.log("close modal");
       this.isConsoleOpen = false;
  });

  this.isConsoleOpen = true;
  nav.present(modal);


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
