/*What we are going to do in this lecture:
cancelling observable or Unsubscription

* How can we make our http request observable unsubsribable
the user of http observable will able to cancel the infly request
*very useful feature for search
if search http request is on going and end user typed something new
different search we would be able to cancel the previous search request


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
  ReplaySubject,
  Subscription
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
    //lets test the abort() function

    const http$ = createHttpObservable("/api/courses");
    const sub = http$.subscribe(console.log);
    setTimeout(() => sub.unsubscribe(), 0);

    //you can see in the network tab where http request has been cancelled
  }
}
