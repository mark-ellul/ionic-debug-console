import {Page, Modal, NavController, ViewController} from 'ionic-angular';
import {Console} from '../console/console';
import {SystemInfo} from '../systemInfo/systemInfo';


@Page({
  template: `<button small (click)="close()" style="position: absolute; top: 0px; right: 7px; z-index: 999;">
    <ion-icon name="close"></ion-icon>
  </button>

  <ion-tabs id="tabs">
    <ion-tab [root]="consoleRoot" tabTitle="Console" tabIcon="list"></ion-tab>
    <ion-tab [root]="systemInfoRoot" tabTitle="SystemInfo" tabIcon="information"></ion-tab>
  </ion-tabs>`
})
export class TabsPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  consoleRoot: any = Console;
  systemInfoRoot: any = SystemInfo;

  constructor(private viewCtrl: ViewController) {
    this.viewCtrl = viewCtrl;
  }

  close() {
    this.viewCtrl.dismiss();
  }
}
