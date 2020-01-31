import {Injectable} from '@angular/core';

@Injectable()
export class LoggingService {
  constructor() {
  }

  debug(message: string) {
    const logEntry = this.createLogStatement('debug', message);
    console.info(logEntry);
    return logEntry;
  }

  error(message: string) {
    const logEntry = this.createLogStatement('error', message);
    console.error(logEntry);
    return logEntry;
  }

  warn(message: string) {
    const logEntry = this.createLogStatement('warning', message);
    console.warn(logEntry);
    return logEntry;
  }

  info(message: string) {
    const logEntry = this.createLogStatement('info', message);
    console.info(logEntry);
    return logEntry;
  }

  createLogStatement(level, message) {
    const SEPARATOR = ' ';
    const date = this.getCurrentDate();
    return '[' + level + ']' + SEPARATOR + date + SEPARATOR + message;
  }

  getCurrentDate() {
    const now = new Date();
    return '[' + now.toLocaleString() + ']';
  }
}
