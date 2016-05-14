import {ExceptionHandler, Injectable} from 'angular2/core';

@Injectable()
export class ConsoleExceptionHandler extends ExceptionHandler {
    call(error, stackTrace = null, reason = null) {
       console.error(error.originalException);
    }
}
