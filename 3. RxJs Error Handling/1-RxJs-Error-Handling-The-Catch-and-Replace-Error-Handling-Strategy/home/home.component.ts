import { Observable, of } from "rxjs";
/*What we are going to do in this lecture:
How rxjs error works?
Go to the home component and make the http observable fail
we are going to backend pointing to '/api/courses/' and making
error out.
Go to server.ts in server which is having '/api/courses/
and you will find that it is getting by the route getAllCourses
get-courses.route.ts
we have some already present which is going to error out this api
call.
we can simulate the http error, for the moment inroder to
understand the better error

---after--get-course.route-----
*Now we will try to catch the error.
For this we have multiple strategies available.
1. we can either catch the error and retry that means providing
an alternative value from our end
2. we can also log the error on the console and rethrow it  another observable that is consuming this observable(shareReplay)
and can try the operation that failed.
3. we can catch the Http Error using catchError
4. This operator is going to take the first argument which is
err and err => this function is going to return an observable
which is used to continue the observable that is errored out
5. So what we know according to the observable contract, either
this observable http$...shareReplay is going to emit value then
it is going to either complete or error out.
6. in our case, it will error out (500) as it is configured at
backend , so this observable will no longer emit any futher value
then catchError will trigger the function err=>err and the goal
of this function is to provide an alterantive observable, so the
user of this observable which is here courses$ in this case component can use in replacement of the observable that has just
 failed, so the output of the function is (err => ) is the alternative observable which is going to be consumed by the
 component only if the http observable errors out.
 7. Another alternative is that the function (err => ) throws
 an error again the courses observable is going to re-errored out
 just like happened to the http observable.
 8. lets implement the first stratgey to recover from the error
 by providing some alternative value to the component.
 9. so, we can use of() operator to return an observable that
 emits single value and that value needs to be array of Course.
 so we could return an empty array [] that means empty set of value.
10. we can also take an defualt course value from db-data.ts
and we are going to use it in a catchError caluse. so this
observable is only going to contain an array of only one course.
11.if you reload the page you will find the error and alternative
observable has kicked it and catchError operator subscribed to alternative error observable. The error observable was subsribed to and its value started showing.

12. instead of showing the defualt data, you could also fetch
the data from you local database when the network is offline

13. When this recovery observable of(...) thats created by the
catchError function errors out, the outer observable coursees$
will also error out.
in the same way when the error observable emits its first value
and completes, the courses$ observable also gets completes.
...
So this is the replacement observable that replaces the observable errored out.

=> The error handling strategy we covered is the error handling
recovery strategy. we will look other couple error handling
strategy in the next one.


*/

import { Course } from "./../model/course";
import { Component, OnInit } from "@angular/core";
import { createHttpObservable } from "../common/utils_basic";
import { noop } from "rxjs";
import { map, shareReplay, tap, catchError } from "rxjs/operators";

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
      catchError(err =>
        of([
          {
            id: 2,
            description: "Angular Security Course - Web Security Fundamentals",
            longDescription:
              "Learn Web Security Fundamentals and apply them to defend an Angular / Node Application from multiple types of attacks.",
            iconUrl:
              "https://s3-us-west-1.amazonaws.com/angular-university/course-images/security-cover-small-v2.png",
            courseListIcon:
              "https://s3-us-west-1.amazonaws.com/angular-university/course-images/lock-v2.png",
            category: "ADVANCED",
            lessonsCount: 11
          }
        ])
      )
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
