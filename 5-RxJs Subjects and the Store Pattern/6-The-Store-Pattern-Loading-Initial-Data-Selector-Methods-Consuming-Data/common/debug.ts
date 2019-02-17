import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
/*
Here we are going to define our new operator
in the last section we have made a skeleton of the debug operator
in the current version of the debug operator, the current message will always be printed out as the observable get executed.
so what we want to do is conditionaly output the message depending upon the logging level of message and logging level of
application.
in order to define our logging logic we are going to define a multiple logging level and we are going to do by using
enum called RxjsLoggingLevel
then we are going to define the most detail logging level first which is going to be a TRACE , the level of debugging we will be
using most often DEBUG, INFO is for imformational message only,
ERROR is for errors only.
Now we need to compare the application logging level with the logging level of this message
we are going to output the logging level to the console only if the loggig level of the message is greater than or equal to
RXJS application logging level which we have not defined yet anywhere
we are going to do that by using a variable that we are going to define at the level of this file but we are not going to
export it, it will be private to this file
we call this var a rxjsLoggingLevel and we are going to initialize with default value of info.
so this is the variable we are going to compare with logging level of the message
notice that this variable is private to this file
we also need to give the way to rest of the application in order increse or decrease the logging level
lets define a function setRxjsLoggingLevel this will allow the rest application to modify the logging level.
this function takes one aregument called level which is of type RxjsLoggingLevel and inside that simple we assing the level to
the global variabl that we defined there

we are done with our debug operator lets implement in our
couse component by importing it
*/

export enum RxjsLoggingLevel {
  TRACE,
  DEBUG,
  INFO,
  ERROR
}

let rxjsLoggingLevel = RxjsLoggingLevel.INFO;

export function setRxjsLoggingLevel(level: RxjsLoggingLevel) {
  rxjsLoggingLevel = level;
}
export const debug = (level: number, message: string) => (
  source: Observable<any>
) =>
  source.pipe(
    tap(val => {
      console.log(level);
      if (level >= rxjsLoggingLevel) {
        console.log(message + ": " + val);
      }
    })
  );
