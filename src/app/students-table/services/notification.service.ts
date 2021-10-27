import { Injectable } from "@angular/core";
import { BehaviorSubject, EMPTY, OperatorFunction, Subject } from "rxjs";
import { catchError, switchAll, tap } from "rxjs/operators";
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { Notification } from '../models/notification.dto';

@Injectable()
export class NotificationService extends BehaviorSubject<any> {
  public notification: Notification | undefined;
  private socket: WebSocketSubject<any> | undefined;
  private messageSubject = new Subject();
  public message = this.messageSubject.pipe(switchAll() as OperatorFunction<unknown, unknown>, catchError(e => {throw e}));
  
  public connect(): void {
    if ( !this.socket || this.socket.closed ) {
      this.socket = this.getNewWebSocket();
      const messages = this.socket.pipe(
        tap({
          error: (error: any) => console.log(error),
        }), catchError( _ => EMPTY)
      );
      this.messageSubject.next(messages);
    }
  }

  private getNewWebSocket() {
    return webSocket('localhost:3001');
  }

  close() {
    if(this.socket)
      this.socket.complete();
  }
}