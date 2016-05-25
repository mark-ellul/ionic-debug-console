import {Injectable} from '@angular/core';
import {Device} from 'ionic-native';
import {Platform} from 'ionic-angular';

@Injectable()
export class SystemInfoProvider {
  data: any;
  uuid: any = "2313-46541-2222"; //testing

  constructor(private platform: Platform) {}

  load() {
    if (this.data) {
      // already loaded data
      return Promise.resolve(this.data);
    }

    // don't have the data yet
    return new Promise(resolve => {

      var data = [];

      for (var DeviceProp in Device.device) {
          var item = {title: DeviceProp, value: Device.device[DeviceProp]};
          data.push(item);
      }

      // // for test in browser
      //   data.push({title: "platform", value: "testplaform"});
      //   data.push({title: "version", value: "5.2"});

      this.data = this.processData(data);
      resolve(this.data);
    });
  }

  processData(data) {
    return data;
  }

  getDetails() {
    return this.load().then(data => {
      return data;
    });
  }

  getUUID() {
    if(this.uuid) {
      return Promise.resolve(this.uuid);
    }

    return this.platform.ready().then(() => this.uuid = Device.device.uuid);
  }

}
