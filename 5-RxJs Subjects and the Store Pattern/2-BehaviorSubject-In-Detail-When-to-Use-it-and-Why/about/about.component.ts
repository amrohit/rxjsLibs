/*
* What we are going to discuss here?
=> BehaviourSubject
in the last one, we have seen how the Subject is mix between an observable and observer.
=>BehaviourSubject is similar to the Subject but it is also similar to the Subject but it also allow late subscription.
like we did define our Subject and derieved an observable from it
and we did subscription, the subscription comes along before we do emit any values.

*after creating a late subscription, you will find no value printed in the console.
So the default behaviour of the plain subject will emit the new values but it wont allow you to catch the previous emitted
values if you have subscribed lately
because those values doesnt stay in the memory.
but if you emit value later then the both subscriber will catch that value.

In the async programming, we want our late subscriber to receive  the lates value emitted by observable

lets assume this corresponds to http request and we have late
subscriber to that http request
even though the subscription happened and we received the response from backend,
we still want to receive that value
we want to write our program in a that our logic still works
idependetly of the timing of each subscription
in order to support that we have different type of subject that is called BehaviourSubject

The goal of BehvaiourSubject is to always provide something to the subscriber if the subscription happens late
we still want to get the latest value emitted by the observable
before the subscription
so the goal is to always provide a value to subscriber we also need to pass an initial value
to behavour subject
now with this we get the something here in late subscription
we will be going to receiving
 the last emitted value which is value 3 for the last subscriber

 now if the value received after late subscription will be
 received by the both subscription
 How does SubjectBehaviour handles completion
  if the completion happens before the late subscriber then
  the late subscriber wont receive any value
Complete means the late subscriber will no longer recived the emitted value

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
  BehaviorSubject
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
    const subject = new BehaviorSubject(1);
    const series$ = subject.asObservable();
    series$.subscribe(val => console.log("early sub: " + val));
    subject.next(1);
    subject.next(2);
    subject.next(3);
    //subject.complete();

    //at this point our program is running and emitting value
    //now we are going to make other subscription which is late.
    //after 3 secs of first subscription

    setTimeout(() => {
      series$.subscribe(val => console.log("late sub:" + val));
      //subject.next(4); //both early and late subscribe gets value
    }, 3000);
  }
}
