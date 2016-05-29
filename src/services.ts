// Import all Providers
import {ConsoleDataProvider} from './providers/consoleData.provider';
import {SystemInfoProvider} from './providers/systemInfo.provider';
import {ConfProvider} from './providers/conf.provider';
// Import all Services
import {AppConsoleService} from './services/appConsole.service';
import {ConsoleExceptionHandler} from './services/consoleExceptionHandler.service';

// Export all providers
export * from './providers/consoleData.provider';
export * from './providers/systemInfo.provider';
export * from './providers/conf.provider';
// Export all services
export * from './services/appConsole.service';
export * from './services/consoleExceptionHandler.service';

// Export convenience property
export const PROVIDERS: any[] = [
  ConfProvider,
  ConsoleDataProvider,
  AppConsoleService,
  SystemInfoProvider,
  ConsoleExceptionHandler
];
