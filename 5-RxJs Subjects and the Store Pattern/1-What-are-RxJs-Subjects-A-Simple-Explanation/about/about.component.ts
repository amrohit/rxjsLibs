import { Subject } from "rxjs";
/*
* we have discussed the Subject in the last to avoid its miss-use
As much as possible create our observable using Observable.create method like we done in our httpObservable
or many methods available in rxjs for exmpale
* fromPromise()
* of()
which allows us to create observable directly from a source
if some of method that are not easily convinent or some source of data which is
not easily transformable into a observable or if we are doing multicasting one value to multiple separate observable consumers
then we might look into the notion of Subject

in our creatHttpObservable method we have very clear separation between observable that is getting return by create method
and the observer which is the parameter in the create() method
which allows us to either emit a value using next() or complete or error out the observable
in this way if we have clear separtion between the observable and the observer
but there are many situation where this is not very convenient
way of creating way of  observable and in those situation
we can use the Subject

*as subject is at the same time an observer and observer-able
lets create a new subject


  //here subject api provides uss same method we had in a case of observable
  //we have .next() method, .error(), .complete() as well

  but we have more method that these free observer specific method
  we can also have pipe to pipe this subject together with any rxjs operator
  so subject it looks like simultaneously an observable and observer
we can directly emit values with it or we can also combine it with other observables
we can also use subject here as public member variable of this component and share it across the other component
of the application but this is not a good idea
The subject is meant to be a private to the part of the application taht is emitting a given set of data.
in that way in our util.ts => createHttpObservable we dont want other part of program to get access to
this observable
only this part of program can emit error or emit the backend response or complete
it will not be a very good idea to share this observable outside of this method

the idea is we have just used Subject to produce a custom
observable
we can see the output on the console 1,2
very convinent way of creating observale using Subject
and using subject.asObservable we can avoid other parts of
application to take control over it by calling .next, complete etc.

we can also use fromPromise() to derive observable directly from promise
or from(document, 'keyup') method to derieve observable directly from browser

These are the preffered way of creating our own observable

for another common use of Subject is multicasting
in the case we have to take one value from one observable stream and re-emit that into multiple separate output streams
Subject will be helpful in creating our own store solution


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
  merge
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
    //`const subject = new Subject();
    //subject.next(1);
    //subject.next(2);
    //the value emitted above will also be emitted to its derived observable
    //so its okay to share the series to other parts of the application
    //becuase unlike subject we dont have .next(),error or complete method on sereies$
    //so other part of application can only subscribe to the value emitted by this observable
    //but it will not able to emit the value on behalf of observable itself
    //inorder to see the series$ observable behaves like any other observable
    //const series$ = subject.asObservable();

    //lets arrange it
    const subject = new Subject();
    const series$ = subject.asObservable();
    series$.subscribe(console.log);
    subject.next(1);
    subject.next(2);
    subject.complete();
  }
}
