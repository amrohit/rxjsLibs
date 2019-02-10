/*What we are going to do in this lecture:
Observable concatenation
New ways of combining observable together using concatMap()
in the next lesson we will see the practical lesson

only if the first observable get completes, next observable will be subscribed
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
  AsyncSubject,
  ReplaySubject
} from "rxjs";
import { delayWhen, filter, map, take, timeout } from "rxjs/operators";
import { createHttpObservable } from "../common/utils_basic";

@Component({
  selector: "about",
  templateUrl: "./about.component.html",
  styleUrls: ["./about.component.css"]
})
export class AboutComponent implements OnInit {
  ngOnInit() {
    const source1$ = of(1, 2, 3);

    const source2$ = of(4, 5, 6);

    const source3$ = of(7, 8, 9);

    //this is just blueprint for a stream of value which is combined observables()
    //these observables would not resolve inthe creation of stream

    const result$ = concat(source1$, source2$, source3$);

    //we dont need to call subscribe on any of the source observable
    //it is the concat operator which is going to call subscribe to each observable
    //when previous observable is completed
    result$.subscribe(val => console.log(val)); //about.component.ts
    //above output: 1 2 3 4 5 6 7 8 9
    result$.subscribe(console.log); //Subscriber.js
    //above output: 1 2 3 4 5 6 7 8 9
    //we can also pass function which is defined else where
  }
}
