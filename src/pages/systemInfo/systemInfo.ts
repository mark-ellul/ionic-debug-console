import {ViewEncapsulation} from '@angular/core'
import {Page} from 'ionic-angular';
import {Device} from 'ionic-native';
import {SystemInfoProvider} from './../../providers/systemInfo.provider';

@Page({
  template: `
  <ion-navbar *navbar>
    <ion-title>
      System info
    </ion-title>
  </ion-navbar>

  <ion-content class="systeminfo">

  <div class="list-container">
    <div class="no-items">
     Hardware info access failed.
    </div>
    <ion-list class="list">
      <ion-item *ngFor="let item of items" (click)="itemSelected(item)">
        {{item.title}} <span class="list-value">{{item.value}}</span>
      </ion-item>
    </ion-list>
  </div>

  </ion-content>
`,

  styles: [`.systeminfo .list-container {
    position: relative;
  }
  .systeminfo .list-container .no-items {
    position: absolute;
    width: 100%;
    text-align: center;
  }
  .systeminfo .item {
    background: #ffffff;
    font-size: 1.5rem;
  }
  .systeminfo .list-value {
    float: right;
    color: #808080;
  }
`],
  encapsulation: ViewEncapsulation.None,
  providers: [SystemInfoProvider]
})
export class SystemInfo {
  items = [];

  constructor(private _systemInfoProvider: SystemInfoProvider) {

    _systemInfoProvider.getDetails().then(data => {
      this.items = data;
    });

  }

  onPageWillEnter() {
    try {
      throw new Error("test");
    }
    catch(err) {
      console.error(err);
    }
  }
}
