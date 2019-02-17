import { Store } from "./../common/store.service";
/*
---after store.service line not 59----

So we could for example define here at courses observable local variable that corresponds to the observable
provided by the store.
We would then apply here a filtering operation and fetch the beginning courses and the advanced courses
directly from the store.

These logic that we have here that selects the beginning and the advanced courses is something that

maybe other parts of the application other than the home component might also want to do.
So let's take these.

And we want to refactor these into the store by creating a selector method.

We are going to create here in the store and new Meffert that we are going to call select beginner courses.

This is going to return as an observable that gives us only to begin their courses and filters out any
other course category.

Let's create here these Mefford here.

These Method going to contain the logic that we have just removed from the home component.

*/

import { Component, OnInit } from "@angular/core";
import { Course } from "../model/course";
import { interval, noop, Observable, of, throwError, timer } from "rxjs";
import {
  catchError,
  delay,
  delayWhen,
  finalize,
  map,
  retryWhen,
  shareReplay,
  tap
} from "rxjs/operators";
import { createHttpObservable } from "../common/util";

@Component({
  selector: "home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"]
})
export class HomeComponent implements OnInit {
  beginnerCourses$: Observable<Course[]>;

  advancedCourses$: Observable<Course[]>;
  constructor(private store: Store) {}

  ngOnInit() {
    const courses$ = this.store.courses$;
    this.beginnerCourses$ = this.store.selectBeginnerCourses();

    this.advancedCourses$ = this.store.selectAdvancedCourses();
  }
}
