import { Observable, of, throwError, timer } from "rxjs";
/*What we are going to do in this lecture:
=>cover a new rxjs error handling error strategy
=> retry()

1. Lets remove the previous error handling which was done to
rethrow erros
2. what we are going to do is whenever we attend a backend
request that request might sometmes gets fail lets say
execessive load on the server  but sometimes it might succeed
if we retry it after lets say a couple of seconds.

3.  Lets simulate the situation first by heading out the
get coursesroute.ts in the server folder

4. now retry the request after two secs of failure
5. so after our request got failed once we are going to wait
for 2 secs and then again we will retry again
if fails again then we will wait for 2 more secs and retry..etc

**6 we can try this logic using the rexjs retryWhen() operator
this operator receives its first argument as an error observable
this observable going to emit error each time when our request
that are retrying throws an errors

when the http stream throws an error, this stream will finish
so it will not complete successfully it will error out,
so retry is going to create a brand new http stream and it
is going to subscribe that stream and it will do that untill the
stream doesnot error out.

7. so retryWhen(error => observable) function will emit error each time when that http
streams get failed and this retry functino accepts one argument
erro and this function needs to return an observable

so retryWhen expects a observable, this observable going to
tell retryWhen, when to re-try

if we do an immediate retry, if thats the case we can return
here to retryWhen an erros observables itself
retryWhen(errors => errors) is going to re-try immediately when
getting any error but however in practive we dont want to do that

becuase many of the http requests failed due to intermediate
problem so we want to wait for 2 secs before trying the http
request again

8. so in order to do that, we just need to modify the observable
we are returing
so we are going to use pipe and going to use delayWhen operator
to say that we want to delay the values emiited by this
retryWhen() operator the observable lets say 2 secs and we can
do that by using the timer function
so we are saying, whenever the error observable emits the value
we are going to reurn here an observable that we are going to
build using the timer operator that is going to emit the
value after two seconds, so this way, when there is a each
time error we are going to wait for 2 secs before emitting
the value to retryWhen , this is the logic what we are looking
for. 2secs after the occurrence of error

if we simply apply the delay(2000) opertor instead, then we
will delay the whole error stream by the
 total of 2 secs and these is not what we are
looking for
we want wait for 2 secs after each error occurence.for that
we will use the delay when and return after the error gets
emitted, the observable is going to emit the value after two
secs and only after that time is left, retryWhen() is going
to subscribe again these observable https$...shareReplay and
it is going to trigger a new http request
lets try this logic...
we know our reqest is going to fail randomly

we get the first request, it failed..afeter 2secs it retry
then it fails.. it again wait and then it get successful
*/

import { Course } from "./../model/course";
import { Component, OnInit } from "@angular/core";
import { createHttpObservable } from "../common/utils_basic";
import { noop } from "rxjs";
import {
  map,
  shareReplay,
  tap,
  catchError,
  finalize,
  retryWhen,
  delayWhen
} from "rxjs/operators";

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
      tap(() => console.log("Http Request Executed")),
      map(res => Object.values(res["payload"])),
      shareReplay(),
      retryWhen(errors => errors.pipe(delayWhen(() => timer(2000))))
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
