import { Observable, of, throwError } from "rxjs";
/*What we are going to do in this lecture:
=>Catch and reThrow error handling strategy
--after common/utils_basic.ts explanation

1. Lets try out a new error handling strategy which is going
to be a catch and Rethrow error strategy.
2. So, instead of returning  an error observable, we are going to handle the
error locally.
3. in this case, we are going to log the error to the console
that we recevied
This could be also done with the error message service,
which display error on the top of the screen.
either way the error is going to be handle locally on the level
of catch block.
4. catchError function needs to return inside the function or
else you will get compilation error. in our previous case,
it was our recovery observable
5. In this case, we dont want to write a recovery observable
which tries to recover from error situations, instead of that
we want to create one observable that doesnt emit any value and
in this case, it immediately error out with the message we received.
6* so, in order to produce such observable, we have an
utility method throwError
7. This method will create an observable which will error out
immediately without emitting any error value.
Lets see this in action.
if you see in the network tab, the request got failed immeditely
with 500 internal error and on console tab, we will find two
erros mesage, one is handled by Angular internal eror handler and another
one is coming from home component. looged inside the catchError
block as expected
This show catch and rethrow error handling strategy is wroking
correctly.

Lets talk about the some cleanup logic

1*. lets say we have an observable coureses$ that might fail
or it might complete.
and in the both cases we would like to do some sort of clean up
operation, This could be close network connection, release
a memory resource or some other clean up operation

2. in rxjs we can implement that type of clean up logic by using
the finalize() operator
3. This operator is going to take a function which is going
to invoke in one of two cases
 a. This function will get exectued when the observable http$...shareReplay() completed successfully
 b. or when it errors out.
4. let try with loging statement, to check that out if finalize
was indeed executed.
5. we can see it on the console two time error execution
since this observable
was subscribed twice one for beginner and second Advance couses
6. But if you dont want this behaviour and want to execute
the finalize only one time then you need to moove that block
one level up in the chain.
7. instead of putting the catchEror block right after the shareReplay which is sharing the resouce between two different
subscription, we could move the catchError block at the top of
the level in pipe() operatior
This way the whole observable chain is going to be by passed
not going to get to the mapping operation, will not get to
shareReplay operator

lets try this new logic.
now if you see on the console, the finalize()  displayed the
error message two time because of the two subscription
done there which was subscribed then terminated

Again, if we want to see the finalize operator thrown message
we have move the finalize() operator top right after the catchError
This way you will find finalize operator executing only one time on the network console screen

**This is one thing general to the catchError and finalize operator
we dont have to apply only once, per observable chain,
we have multiple steps in the observable chain, that might error
out then we might want to apply different erro handling strategy
at different point in the observable chain.
may be some errors can be recovered and we could use the recovery
observable other errors might be un-recoverable and in that case,
we want to handle them locally and rethrow them.

*So, we should apply the catchError block as close the source
observable

This time on the screen, we can see the cathError was only
invoked only once and fanalize was executed only once as expected.
That means, even though this observable has two subscriptions one
made by the beginners tab and one by the advance tab , even they
are two subscsriptions we are sharing the executions of the
http observable between those two subscriptions using shareReplay

that is why we have only one http request then we may error out or complete


*/

import { Course } from "./../model/course";
import { Component, OnInit } from "@angular/core";
import { createHttpObservable } from "../common/utils_basic";
import { noop } from "rxjs";
import { map, shareReplay, tap, catchError, finalize } from "rxjs/operators";

@Component({
  selector: "home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"]
})
export class HomeComponent implements OnInit {
  begginerCourses$: Observable<Course[]>;
  advancedCourses$: Observable<Course[]>;

  constructor() {}

  ngOnInit() {
    const http$: Observable<Course[]> = createHttpObservable("/api/courses");
    const courses$ = http$.pipe(
      catchError(err => {
        console.log("Error occured", err);
        return throwError(err);
      }),
      finalize(() => {
        console.log("Finalize Executed..");
      }),
      tap(() => console.log("Http Request Executed")),
      map(res => Object.values(res["payload"])),
      shareReplay()
    );

    this.begginerCourses$ = courses$.pipe(
      map(courses =>
        courses.filter(course => {
          return course["category"] == "BEGINNER";
        })
      )
    );
    this.advancedCourses$ = courses$.pipe(
      map(courses => courses.filter(course => course["category"] == "ADVANCED"))
    );
  }
}
