/*What we are going to do in this lecture:
In the last section, we have gone through with imperative design with http
observable in home component ,that in more complex component would result
in nested subscribe calls.

what we want to do is to refactor our comonent with reactive design.
Lets revist the implementation of our component.
we dont want to define one stream of data(courses$) courses observable
and manually subscribing to it and extracting data under it.

what we are going to do is to define two sets of observable
one is beginnerCourse observable and another would be advancedCourse observable and then we are going to derive using rxjs operators and going
to pass them directly to the template, our subscribe method is going tobe
essentially empty
Lets compare what the new version of our problem looks like and compare it
with the old version
begginerCourses$: Observable<Course[]>;
When we define here observable at level of our component, it also means,
the data itself is not available here for direct muation in this component,
we only have definations of streams of data. we will the advantages of it in
a moment. lets see how can we derive the begginerCourses$ observable from
courses$ observable

async pipe will automatically unsubscribe the observable once the component
gets destroyed

now we have Reactive design apporach but the issue is we are making two
http requests to backend which needs to be fixed by using another Rxjs operator
*/

import { Course } from "./../model/course";
import { Component, OnInit } from "@angular/core";
import { createHttpObservable } from "../common/utils_basic";
import { noop, Observable } from "rxjs";
import { map } from "rxjs/operators";

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
    const courses$ = http$.pipe(map(res => Object.values(res["payload"])));

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
