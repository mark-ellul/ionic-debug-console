import {Injectable, Inject} from 'angular2/core';
import {SERVER_URL, APP_ID} from './config';
import {Http, Headers, RequestOptions} from 'angular2/http';
import {SystemInfoProvider} from './../providers/systemInfo.provider';
import {Observable} from 'rxjs/Observable';
import {ConsoleItem} from '../providers/consoleItem';
import {Config} from 'ionic-angular';
import {ConsoleDataProvider} from '../providers/consoleData.provider'
import 'rxjs/Rx';

let APP_INSTANCE_URL = SERVER_URL + 'appInstance/',
    CONSOLE_ITEM_URL = SERVER_URL + 'consoleItem/',
    CONSOLE_ITEM_ARG_URL = SERVER_URL + 'consoleItemArg/';
    // likesURL = propertiesURL + 'likes/';

@Injectable()
export class AppConsoleService {
  configRemote: any;
  remoteConsoleId: any;
  errorFound: boolean = false;

    constructor (private http: Http, private systemInfoProvider: SystemInfoProvider, private config: Config) {
        // this.http = http;
    }

    delay(ms) {
      return new Promise(function(resolve, reject){
         setTimeout(function(){
           resolve();
         }, ms)
       });
    };

    getConfig() {
      if (this.configRemote) {
        return Promise.resolve(this.configRemote);
      }

       return this.http.get(this.config.get('consoleApiUrl') + 'apps/' + this.config.get('consoleApiToken'))
       .toPromise()
       .then(res => this.configRemote = res.json().data).catch(()=> {
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

          console.log("device info", deviceInfo);

          for (let key in deviceInfo) {
              deviceInfoObj[deviceInfo[key].title] = deviceInfo[key].value;
          }

          let data = {
            "dateTimeCreated": Date.now(),
            "deviceInfo": deviceInfoObj,
          }

          console.log("device info", data);

          let body = JSON.stringify(data);
          let headers = new Headers({ 'Content-Type': 'application/json' });
          let options = new RequestOptions({ headers: headers });

            return this.http.post(this.config.get('consoleApiUrl') + 'apps/' + this.config.get('consoleApiToken') + '/logs', body, options)
            .toPromise()
            .then((res) => {
              var instance = res.json().data;
              console.log(instance);
              return this.remoteConsoleId = instance._id;
            }).catch(()=> {
              return this.delay(5000).then(() => this.createNewRemoteConsole());
            });


        })



    }


    sendConsoleItems(data) {

      var filteredData = this.filterData(data);

      if(!filteredData ||
        this.configRemote.sendNoData ||
        (this.configRemote.sendOnlyOnError && this.errorFound == false) ||
        (!this.configRemote.logErrors && !this.configRemote.logWarnings && !this.configRemote.logLogs)) {
        console.log("zakazane posilani dat na server");
      } else {

        this.createNewRemoteConsole().then(()=>{

            let body = JSON.stringify(filteredData);
            let headers = new Headers({ 'Content-Type': 'application/json' });
            let options = new RequestOptions({ headers: headers });

           return this.http.post(this.config.get('consoleApiUrl') + 'logs/' + this.remoteConsoleId + '/items', body, options)
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

      if(!this.configRemote.logErrors) {
        for(var n in dataNew) {
          if(dataNew[n].method == "error"){
            dataNew.splice(parseInt(n), 1);
          }
        }
      }

      if(!this.configRemote.logWarnings) {
        for(var n in dataNew) {
          if(dataNew[n].method == "warn"){
            dataNew.splice(parseInt(n), 1);
          }
        }
      }

      if(!this.configRemote.logLogs) {
        for(var n in dataNew) {
          if(dataNew[n].method == "log"){
            dataNew.splice(parseInt(n), 1);
          }
        }
      }

      return dataNew;

    }


}
