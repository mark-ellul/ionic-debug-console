import {ExceptionHandler, Injectable} from '@angular/core';

@Injectable()
export class ConsoleExceptionHandler extends ExceptionHandler {
    call(error, stackTrace = null, reason = null) {
       console.error(error.originalException);
    }
}
