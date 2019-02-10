import { Observable } from "rxjs";
/*What we are going to do in this lecture:
Using shareReplay Operator:
often used with rxjs,

here with async pipe we are making two http requests
we can see the two http requests in the network tab in devs console.
if you subscribe again courses$.subscribe() it will create 3rd http req call
its not good for having three http call for same data.

To fix this, we have shareReplay() rxjs operator
we somehow have take the http observable (courses$) the http observable and some how we can share this particular stream (line no 32) across multiple
subscriber. So we want to replace the default Observable behaviour which
is to create a complete stream by subscription. Instead of that we
want to the stream(ln no 32) to be executed only one and then the result of
that stream to replay into each new subscriber.
So inorder to obtain that behaviour we are going to use shareReplay() operator

------------------------------
lets log to the console that the http request was executed.
for that we are going to use tap() operator
tap() operator that is meant to be used to produce side effects in our
observable stream, such as for example updating variable uplevel of component
 or in our case to loggin a statement

 and if you reload the app and check the network console.
  you will find that, this time only one http request was called

  Even also if you subscribe that course observable again, you will again
 make only one http req call and this was the behaviour we were looking for.

 shareReplay() operator is essential important to handle our http request
*/

import { Course } from "./../model/course";
import { Component, OnInit } from "@angular/core";
import { createHttpObservable } from "../common/utils_basic";
import { noop } from "rxjs";
import { map, shareReplay, tap } from "rxjs/operators";

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
      shareReplay()
    );

    this.begginerCourses$ = courses$.pipe(
      map(courses =>
        courses.filter(course => {
          console.log(course);
          return course.category == "BEGINNER";
        })
      )
    );
    this.advancedCourses$ = courses$.pipe(
      map(courses => courses.filter(course => course.category == "ADVANCED"))
    );
    /*
    courses$.subscribe(
      courses => {
        console.log(courses);
        this.begginerCourses = courses.filter(
          course => course.category == "BEGINNER"
        );
        this.advancedCourses = courses.filter(
          course => course.category == "ADVANCED"
        );
      },

      noop,
      () => console.log("completed")
    );
    */
  }
}
