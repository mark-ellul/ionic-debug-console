import {Injectable, Inject} from '@angular/core';
import {Http, Headers, RequestOptions} from '@angular/http';
import {ConfProvider} from '../providers/conf.provider';
import {SystemInfoProvider} from './../providers/systemInfo.provider';
import {Observable} from 'rxjs/Observable';
import {ConsoleItem} from '../providers/consoleItem';
import {ConsoleDataProvider} from '../providers/consoleData.provider';
import 'rxjs/Rx';

@Injectable()
export class AppConsoleService {
  remoteConsoleId: any;
  errorFound: boolean = false;

    constructor (private http: Http, private systemInfoProvider: SystemInfoProvider, private config: ConfProvider) {
    }

    delay(ms) {
      return new Promise(function(resolve, reject){
         setTimeout(function(){
           resolve();
         }, ms)
       });
    };

    getConfig() {
       return this.http.get(this.config.get('apiUrl') + 'apps/' + this.config.get('apiToken'))
       .toPromise()
       .then(res => res.json().data).catch(()=> {
         return this.delay(5000).then(() => this.getConfig());
       });
    }

    setErrorFoundTrue(){
      this.errorFound = true;
    }

    createNewRemoteConsole() {

      if (this.remoteConsoleId) {
        return Promise.resolve(this.remoteConsoleId);
      }

        return this.systemInfoProvider.getDetails().then(deviceInfo => {

          let deviceInfoObj = {};

          for (let key in deviceInfo) {
              deviceInfoObj[deviceInfo[key].title] = deviceInfo[key].value;
          }

          let data = {
            "dateTimeCreated": Date.now(),
            "deviceInfo": deviceInfoObj,
          }

          let body = JSON.stringify(data);
          let headers = new Headers({ 'Content-Type': 'application/json' });
          let options = new RequestOptions({ headers: headers });

            return this.http.post(this.config.get('apiUrl') + 'apps/' + this.config.get('apiToken') + '/logs', body, options)
            .toPromise()
            .then((res) => {
              var instance = res.json().data;
              return this.remoteConsoleId = instance._id;
            }).catch(()=> {
              return this.delay(5000).then(() => this.createNewRemoteConsole());
            });


        })



    }


    sendConsoleItems(data) {

      var filteredData = this.filterData(data);

      if(!filteredData ||
        this.config.get("sendNoData") ||
        (this.config.get("sendOnlyOnError") && this.errorFound == false) ||
        (!this.config.get("logErrors") && !this.config.get("logWarnings") && !this.config.get("logLogs"))) {
        console.log("Will not send anything to server.");
      } else {

        this.createNewRemoteConsole().then(()=>{

            let body = JSON.stringify(filteredData);
            let headers = new Headers({ 'Content-Type': 'application/json' });
            let options = new RequestOptions({ headers: headers });

           return this.http.post(this.config.get('apiUrl') + 'logs/' + this.remoteConsoleId + '/items', body, options)
               .toPromise()
               .then(res => {

                 for (var i in data) {
                       data[i].synced = true;
                 }

                 return true;
               })
               .catch(err=>console.log(err));

        });

      }





    }

    filterData(data){
      var dataNew = [];


      for(var n in data) {
        if(!data[n].synced){
          dataNew.push(data[n]);
        }
      }

      if(!this.config.get("logErrors")) {
        for(var n in dataNew) {
          if(dataNew[n].method == "error"){
            dataNew.splice(parseInt(n), 1);
          }
        }
      }

      if(!this.config.get("logWarnings")) {
        for(var n in dataNew) {
          if(dataNew[n].method == "warn"){
            dataNew.splice(parseInt(n), 1);
          }
        }
      }

      if(!this.config.get("logLogs")) {
        for(var n in dataNew) {
          if(dataNew[n].method == "log"){
            dataNew.splice(parseInt(n), 1);
          }
        }
      }

      return dataNew;

    }


}
