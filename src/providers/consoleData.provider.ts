import {Injectable} from '@angular/core';
import {Platform} from 'ionic-angular';
import {Device} from 'ionic-native';
import {ConsoleItem} from './consoleItem';
import {ConfProvider} from './conf.provider';
import {SystemInfoProvider} from './systemInfo.provider';
import {AppConsoleService} from './../services/appConsole.service';


@Injectable()
export class ConsoleDataProvider {
  data: ConsoleItem[] = [];
  timer: any;
  uuid: any = 12541;
  counts: number[] = [];

  constructor(private _appConsoleService: AppConsoleService,
              private platform: Platform,
              private systemInfoProvider: SystemInfoProvider,
              private config: ConfProvider) {}

  init(userConfig) {
    this.catchConsoleMethods();
    this.config.initConfig(userConfig).then( () => {
      this.config.initServerConfig(userConfig, this._appConsoleService).then( () => {
        this.setSendingInterval();

        // TODO: parse the pouchDbDocument structure so that we know where to put the console logs
        /*let pouchDbReporting = this.config.get("pouchDbReporting");
        if (pouchDbReporting) {

        }
        */
      });
    });
  }

  setSendingInterval(){
      this.timer = setInterval(() => this.sendDataToServer(), this.config.get("communicationInterval"));
  }

  sendDataToServer(){
        this._appConsoleService.sendConsoleItems(this.data);
  }

  // source: http://tobyho.com/2012/07/27/taking-over-console-log/
  catchConsoleMethods(){

    var console = window.console
    if (!console) return
    function intercept(method, that){
        var original = console[method]
        console[method] = function(){

        that.pushItem(method, arguments);
            if (original.apply){
                // Do this for normal browsers
                if(!that.config.get("production")) {
                  original.apply(console, arguments)
                }

            }else{
                // Do this for IE
                if(!that.config.get("production")) {
                  var message = Array.prototype.slice.apply(arguments).join(' ')
                  original(message)
                }
            }
        }
    }
    var methods = ['error', 'log', 'warn']
    for (var i = 0; i < methods.length; i++)
        intercept(methods[i], this);
  }

  pushItem(method, args) {
    this.increaseCount(method);
    var processedArgs = this.processArguments(args);
    var dateTime = Date.now();
    var item = {method: method, arguments: processedArgs, dateTime: dateTime, synced: false};
    this.data.push(item);
  }

  increaseCount(method) {

    if(method == 'error') {
      this._appConsoleService.setErrorFoundTrue();
    }

    if(this.counts[method] !== undefined){
      this.counts[method] += 1;
    } else {
      this.counts[method] = 1;
    }
  }

  getItemTypeCount(method) {
    return (this.counts[method] !== undefined) ? this.counts[method] : 0;
  }

  processArguments(args){
    var newArgs = [];
    for (var arg of args) {
      var type = this.varType(arg);

      var newArg = {};

      if (type == "Error") {
        newArg = {type: "String", value: arg.message, selected: false};
        newArgs.push(newArg);
        newArg = {type: "Stack", value: arg.stack, selected: false};
        newArgs.push(newArg);
      }else if(type == "String" || type == "Number") {
        newArg = {type: type, value: arg, selected: false};
        newArgs.push(newArg);
      }else {
        newArg = {type: type, value: JSON.stringify(arg, null, ' '), selected: false};
        newArgs.push(newArg);
      }

    }
    return newArgs;
  }

  varType(obj){
    return Object.prototype.toString.call(obj).slice(8, -1);
  }

  getConsoleDebugItems() {
    // if(this.data){
    //   for (var debugItem of this.data) {
    //       var item = {name: debugItem.prototype.name,
    //                   stack: debugItem.stack,
    //                   message: debugItem.message};
    //       this.data.push(item);
    //   }
    // }
    return Promise.resolve(this.data);
  }

  countLogMessages() {
    return this.data.length;
  }


}
