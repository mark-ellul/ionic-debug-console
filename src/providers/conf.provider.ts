import {Injectable} from '@angular/core';
import {AppConsoleService} from './../services/appConsole.service';

@Injectable()
export class ConfProvider {
  config: any = {
    communicationInterval: 10000, // 10 seconds
    apiUrl: 'http://localhost:3000/',
    apiToken: undefined,
    reporting: false
  };

  constructor() {}

  initConfig(userConfig) {
    return new Promise(resolve => {
      this.config = this.mergeConfigs(this.config, userConfig); // update default config with user settings
      resolve();
    });
  }

  initServerConfig(userConfig, appConsoleService: AppConsoleService){
    return new Promise(resolve => {
         if(this.config.reporting == true){
           appConsoleService.getConfig().then((serverConfig) => {
             var newConfig = this.mergeConfigs(this.config, serverConfig); // first rewrite with server config
             this.config = this.mergeConfigs(newConfig, userConfig); // first rewrite with server config
             resolve();
           });
         }else{
           resolve();
         }
     });
  }

  mergeConfigs(conf1,conf2){
    var conf3 = {};
    for (var attrname in conf1) { conf3[attrname] = conf1[attrname]; }
    for (var attrname in conf2) { conf3[attrname] = conf2[attrname]; }
    return conf3;
}

  get(configKey){
      if(configKey in this.config){
        return this.config[configKey];
      }
      return undefined;
  }

}
