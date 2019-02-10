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
import { createHttpObservable } from "../common/util";

@Component({
  selector: "about",
  templateUrl: "./about.component.html",
  styleUrls: ["./about.component.css"]
})
export class AboutComponent implements OnInit {
  ngOnInit() {
    //Problem with callback(hell) with combining multiple streams
    /* callback api is not convinent for combining mult streams.
    document.addEventListener("click", evt => {
      console.log(evt);
      setTimeout(() => {
        console.log("finished");
        let counter = 0;
        setInterval(() => {
          console.log(counter);
          counter++;
        }, 1000);
      }, 3000);
    });
    */
    //Using RXJS Library for combining multiple streams(optimized way)
    //$ means a variable with rxjs observable
    //const interval$ = interval(1000);
    //interval$.subscribe(val => console.log('stream 1 => ' + val));
    //interval$.subscribe(val => console.log('stream 2 => ' + val));

    const interval$ = timer(3000, 1000); //waiting for 3 sec before emititnig our first value
    const sub = interval$.subscribe(val => console.log("stream 1 => ", val));
    setTimeout(() => {
      sub.unsubscribe();
    }, 5000);
    const click$ = fromEvent(document, "click");
    //click$ is a blueprint of streams
    click$.subscribe(
      evt => console.log(evt),
      err => console.log(err),
      () => console.log("completed")
    );
  }
}
