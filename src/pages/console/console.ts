import {OnInit, ViewEncapsulation} from '@angular/core';
import {Page, NavController, IonicApp, Events, ViewController} from 'ionic-angular';
import {ConsoleDataProvider} from './../../providers/consoleData.provider';
import {ConsoleItem} from './../../providers/consoleItem';
import {ConsoleArgumentComponent} from './../../components/consoleArgument.component';


@Page({
  template: `<ion-navbar *navbar>
    <ion-title>Console</ion-title>
  </ion-navbar>

  <ion-toolbar [attr.primary]="isAndroid ? '' : null" >
    <ion-segment [(ngModel)]="itemType" [attr.light]="isAndroid ? '' : null">
      <ion-segment-button value="all">
        All
      </ion-segment-button>
      <ion-segment-button value="error">
        Errors
      </ion-segment-button>
      <ion-segment-button value="warn">
        Warnings
      </ion-segment-button>
      <ion-segment-button value="log">
        Logs
      </ion-segment-button>
    </ion-segment>
  </ion-toolbar>

  <ion-content padding class="console" console>
    <div class="list console-output">
      <div class="no-items">
        No items found.
      </div>
      <div *ngFor="let item of items">
        <div [hidden]="isItemHidden(item.method)" class="console-item">
          <span class="{{item.method}}">[{{item.method}}]</span>
          <span *ngFor="let arg of item.arguments">
            <span *ngIf="arg.type == 'String' || arg.type == 'Number'">{{arg.value}}</span>
            <console-argument *ngIf="arg.type != 'String' && arg.type != 'Number'" [arg]="arg"></console-argument>
          </span>
        </div>
      </div>
    </div>
  </ion-content>
`,

  styles: [`.console {
    font-size: 13px;
  }
  .console .console-output {
    font-family: monospace;
    position: relative;
  }
  .console .console-output .no-items {
    position: absolute;
    width: 100%;
    text-align: center;
    top: 0;
    z-index: -1;
  }
  .console .console-output .console-item {
    padding-top: 5px;
    padding-bottom: 10px;
    border-bottom: 1px solid #e3e3e3;
    background: #ffffff;
  }
  .console .console-output .console-item .name {
    text-transform: uppercase;
  }
  .console .console-output .console-item .stack {
    white-space: pre;
  }
  .console .console-output .console-item .warn {
    color: #7c6e2c;
  }
  .console .console-output .console-item .error {
    color: #ee3426;
  }
  .console .console-output .console-item .log {
    color: #41af0f;
  }
  .console .console-output .console-item console-argument > span {
    cursor: pointer;
    color: #387ef5;
    text-decoration: underline;
  }
  .console .console-output .console-item .console-output-code {
    height: 0;
    visibility: hidden;
    opacity: 0;
    transition: visibility 0s, opacity 0.5s linear;
  }
  .console .console-output .console-item .console-output-code.expanded {
    margin: 5px 0px 10px 7px;
    height: auto;
    visibility: visible;
    opacity: 1;
  }
  .console .console-output .console-item .console-output-code code {
    white-space: pre;
    overflow: auto;
  }
`],
  encapsulation: ViewEncapsulation.None,
  directives: [ConsoleArgumentComponent]
//  providers: [ConsoleDataProvider]
})
export class Console {
  items: ConsoleItem[] = [];
  provider: any;
  itemType: any = "all";

  constructor(private _consoleDataProvider: ConsoleDataProvider,
              private app: IonicApp,
              private nav: NavController,
              private events: Events,
              private viewController: ViewController)
  {
    this.provider = _consoleDataProvider;
  //  this.nav = nav;
  }

onPageWillEnter() {
  this._consoleDataProvider.getConsoleDebugItems().then(data => {
    this.items = data;
  });
}

testButton() {
  console.log('testrdfg', {name: 'test'});
  console.log("itemtype", this.itemType)
}

testFn() {
  console.log('testFn');

}

isItemHidden(currentItemType){
  return this.itemType != currentItemType && this.itemType != 'all'
}

}
