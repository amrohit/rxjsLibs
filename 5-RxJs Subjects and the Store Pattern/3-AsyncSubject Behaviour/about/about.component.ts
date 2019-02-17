/*
* What we are going to discuss here?
=> ReplaySubject and SyncSubject
The SyncSubject is idle for using with long running calculations
like inthe last one, we had a observable emitting lots of
intermediate calcuated value
lets say calculation is ongoing and we are reporting the latest
calculated value of that calculations
but the calculations has not finished yet
when the calculation gets finished the last value of the subject is going to be emitted
and then the subject is going tobe complete
in that scenario we dont want to received the intermediate value of calculation, we will only receive the last value just emitted
before calculation
for that we can use the AsyncSubject from rxjs
AsyncSubject wait for the observable completion before emitting any value to the multiple subscriber
the value emitted is going to be the last value
lets see how AsyncSubject behaves
Here in this case only 3 will be the output
lets add the second subscriber
in the this case, second subscriber will also get value 3
but what if the second subscriber in interested in getting
all the intermediate emitted data of calculation
Then we have to use the ReplaySubject()

*/

import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import {
  concat,
  fromEvent,
  interval,
  noop,
  observable,
  Observable,
  of,
  timer,
  merge,
  Subject,
  BehaviorSubject,
  AsyncSubject
} from "rxjs";
import { delayWhen, filter, map, take, timeout } from "rxjs/operators";
import { createHttpObservable } from "../common/util";

@Component({
  selector: "about",
  templateUrl: "./about.component.html",
  styleUrls: ["./about.component.css"]
})
export class AboutComponent implements OnInit {
  ngOnInit() {
    const subject = new AsyncSubject();
    const series$ = subject.asObservable();
    series$.subscribe(val => console.log("early sub: " + val));
    subject.next(1);
    subject.next(2);
    subject.next(3);
    subject.complete();
    setTimeout(() => {
      series$.subscribe(val => console.log("second sub:", +val));
    });
  }
}
