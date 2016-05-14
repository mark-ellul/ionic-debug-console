import {Injectable} from 'angular2/core';
import {Platform} from 'ionic-angular';
import {Device} from 'ionic-native';
import {ConsoleItem} from './consoleItem';
import {SystemInfoProvider} from './systemInfo.provider';
import {AppConsoleService} from './../services/appConsole.service';


@Injectable()
export class ConsoleDataProvider {
  data: ConsoleItem[] = [];
  consoleConfig: any;
  timer: any;
  // uuid: any;
  uuid: any = 12541;
  counts: number[] = [];

  constructor(private _appConsoleService: AppConsoleService,
              private platform: Platform,
              private systemInfoProvider: SystemInfoProvider) {}

  init() {
    this.catchConsoleMethods();
    this.setSendingInterval();
  }

  getConfig() {
    return this._appConsoleService.getConfig().then(data => this.consoleConfig = data);
  }

  setSendingInterval(){
    this.getConfig().then(() => {

      console.log("config object",this.consoleConfig);

      if(!this.consoleConfig.communicationInterval){
        this.consoleConfig.communicationInterval = 20;
      }
      this.timer = setInterval(() => this.sendDataToServer(), this.consoleConfig.communicationInterval * 1000);
      console.log("communication interval",this.consoleConfig.communicationInterval);
    });
  }

  sendDataToServer(){

    this.systemInfoProvider.getUUID().then((uuid)=>{
      if(uuid){
        this._appConsoleService.sendConsoleItems(this.data);
      }else{
        console.error("No uuid found.")
      }

    });

    //this._appConsoleService.sendData().then(data => this.consoleConfig = data)

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
                original.apply(console, arguments)
            }else{
                // Do this for IE
                var message = Array.prototype.slice.apply(arguments).join(' ')
                original(message)
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
    var dateTime = new Date().toISOString();
    var item = {method: method, arguments: processedArgs, dateTime: dateTime, synced: false};
    this.data.push(item);
  }

  increaseCount(method) {
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
