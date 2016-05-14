import {Injectable, Inject} from 'angular2/core';
import {SERVER_URL, APP_ID} from './config';
import {Http, Headers, RequestOptions} from 'angular2/http';
import {SystemInfoProvider} from './../providers/systemInfo.provider';
import {Observable} from 'rxjs/Observable';
import {ConsoleItem} from '../providers/consoleItem';
import 'rxjs/Rx';

let APP_URL = SERVER_URL + 'app/' + APP_ID + '/',
    CONFIG_URL = 'consoleConfig/',
    APP_INSTANCE_URL = SERVER_URL + 'appInstance/',
    CONSOLE_ITEM_URL = SERVER_URL + 'consoleItem/',
    CONSOLE_ITEM_ARG_URL = SERVER_URL + 'consoleItemArg/';
    // likesURL = propertiesURL + 'likes/';

@Injectable()
export class AppConsoleService {
  data: any;
  appInstanceId: any;

    constructor (private http: Http, private systemInfoProvider: SystemInfoProvider) {
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
      if (this.data) {
        return Promise.resolve(this.data);
      }

       return this.http.get(APP_URL + CONFIG_URL)
       .toPromise()
       .then(res => this.data = res.json()).catch(()=> {
         return this.delay(5000).then(() => this.getConfig());
       });
    }

    createNewAppInstance() {

      return this.systemInfoProvider.getUUID().then((uuid) => {
        let data = {
          "uuid": uuid,
          "app": APP_ID,
          "deviceInfo": {
            "deviceName": "test"
          }
        }

        let body = JSON.stringify(data);
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });

       return this.http.post(APP_INSTANCE_URL, body, options)
           .toPromise()
           .then(res => {
             var instance = res.json();
             return instance.id;
           })
           .catch(err=>console.log(err));
      })

    }

    getAppInstanceId() {

      if (this.appInstanceId) {
        return Promise.resolve(this.appInstanceId);
      }

      return this.systemInfoProvider.getUUID().then((uuid) => {
        console.log(APP_INSTANCE_URL + "?uuid=" + uuid);
        return this.http.get(APP_INSTANCE_URL + "?uuid=" + uuid )
        .toPromise()
        .then((res) => {
          var instances = res.json();
          if(instances.length > 0){
            return this.appInstanceId = instances[0].id;
          }else{
            return this.appInstanceId = this.createNewAppInstance();
          }
        });
      });

    }

    sendConsoleItemArgs(consoleItem, consoleItemId){
      let body = this.consoleItemProcessItemArgs(consoleItem, consoleItemId);
      let headers = new Headers({ 'Content-Type': 'application/json' });
      let options = new RequestOptions({ headers: headers });

     return this.http.post(CONSOLE_ITEM_ARG_URL, body, options)
         .toPromise().then(() =>{
           return consoleItem;
         })
         .catch(err=>console.log(err));
    }

    sendConsoleItem(consoleItem){
      let body = this.consoleItemProcessItem(consoleItem);
      let headers = new Headers({ 'Content-Type': 'application/json' });
      let options = new RequestOptions({ headers: headers });

     return this.http.post(CONSOLE_ITEM_URL, body, options)
         .toPromise()
         .then(res => {
           var consoleItemRet = res.json();
           return this.sendConsoleItemArgs(consoleItem, consoleItemRet.id);
         })
         .catch(err=>console.log(err));
    }

    consoleItemProcessItemArgs(consoleItem, consoleItemId){
      var newConsoleItemArguments = consoleItem.arguments;

      for (var i in newConsoleItemArguments) {
        newConsoleItemArguments[i].consoleItem = consoleItemId;
      }

      return JSON.stringify(newConsoleItemArguments);
    }

    consoleItemProcessItem(consoleItem){
      var newConsoleItem = consoleItem;

      function replacer(key,value)
      {
          if (key=="arguments") return undefined;
          else return value;
      }

      return JSON.stringify(consoleItem, replacer);
    }

    sendConsoleItems(data) {

    this.getAppInstanceId().then((instanceId)=>{

      for (var i in data) {
        //console.log("sendidng intance", data[i]); // 9,2,5
        if(data[i].synced == false){
          this.sendConsoleItem(data[i]).then((consoleItem: any)=>{

            consoleItem.synced = true;
          });
        }
      }


      // let data = {
      //   "method": "error",
      //   "dateTime": new Date().toISOString(),
      //   "appInstance": instanceId,
      //   "consoleItemArguments": [
      //     {
      //       "type": "String",
      //       "value": "Testovaci string"
      //     },
      //     {
      //       "type": "Object",
      //       "value": "{obj: 15}"
      //     }
      //   ]
      // }





    });


      //  return this.http.get(APP_URL + CONFIG_URL)
      //  .toPromise()
      //  .then(res => this.data = res.json(), err => console.log(err));
    }

    // findAll() {
    //     return this.http.get(propertiesURL)
    //         .map(res => res.json())
    //         .catch(this.handleError);
    // }
    //
    // getFavorites() {
    //     return this.http.get(favoritesURL)
    //         .map(res => res.json())
    //         .catch(this.handleError);
    // }
    //
    // like(property) {
    //     let body = JSON.stringify(property);
    //     let headers = new Headers({ 'Content-Type': 'application/json' });
    //     let options = new RequestOptions({ headers: headers });
    //     return this.http.post(likesURL, body, options)
    //         .map(res => res.json())
    //         .catch(this.handleError);
    // }
    //
    // favorite(property) {
    //     let body = JSON.stringify(property);
    //     let headers = new Headers({ 'Content-Type': 'application/json' });
    //     let options = new RequestOptions({ headers: headers });
    //     return this.http.post(favoritesURL, body, options)
    //         .catch(this.handleError);
    // }
    //
    // unfavorite(property) {
    //     return this.http.delete(favoritesURL + property.id)
    //         .map(res => res.json())
    //         .catch(this.handleError);
    // }

    // handleError(error) {
    //     console.error(error);
    //     return Observable.throw(error.json().error || 'Server error');
    // }

}
