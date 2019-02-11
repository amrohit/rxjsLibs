/*What we are going to do in this lecture:
mergeMap()
we will learn a new strategy to combine observable together using mergeMap()

merge should be used if we want to take multiple observable
subscribe to all of them and at a same time take the values of each observable
we can use merge to perform asynchornous operation in parallel
and it result will be only completed when all the merged observable that means
the inner observable gets completed
but if any of the observable gets failed then the resulting observable will
throw error immediately

lets check the example
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
    const interval1$ = interval(1000);

    const interval2$ = interval1$.pipe(map(val => 10 * val));

    const result$ = merge(interval1$, interval2$);
    // result$.subscribe(console.log);
    /*
     * output: 0 0 , 1 10, 2 20, 3 30 ...
     * Both observables are having their value outputted to the result observable due to use of merge
     * We can see the merge strategy is ideal for performing a long running
     * operations in paralled and getting the results of each operations combined
     *
     */
  }
}
