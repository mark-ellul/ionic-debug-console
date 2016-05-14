import {Injectable} from 'angular2/core';
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

      this.data = this.processData(data);
      resolve(data);
    });
  }

  processData(data) {
    return data;
  }

  getDetails() {

    return this.load().then(data => {
      // return data.sort((a, b) => {
      //   let aName = a.name.split(' ').pop();
      //   let bName = b.name.split(' ').pop();
      //   return aName.localeCompare(bName);
      // });
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
