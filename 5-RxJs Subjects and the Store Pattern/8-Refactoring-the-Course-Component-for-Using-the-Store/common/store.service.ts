import { Injectable } from "@angular/core";
import { Course } from "../model/course";
import { createHttpObservable } from "./utils_basic";
import {
  interval,
  noop,
  Observable,
  of,
  throwError,
  timer,
  Subject,
  BehaviorSubject
} from "rxjs";
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
import { fromPromise } from "rxjs/internal-compatibility";
/*
after coursecomponent -------
Let's then define this new selector.

We are going to add that here just below.

Ever see Lechter of my efforts.

We're going to hear the argument of course id of type number and we're going to hear a filtering operation

this is going to be very similar to the filtering that we have here.

So we are going to copy this logic.

We are going to paste it here and we are going to modify it.

So first we don't really want to search here by the cost category.

Instead we want to search for the course with a given course.

The next thing that we want change is we don't want to use the filter operator because this is going
to get us black energy.

Instead we want to use the array find Mefford because that is going to give us back any unique coarse
value.
And with this we have finished implementing our selector.
Let's now switch here to the cost component and fix here a small compilation problem. courseId to type number

We are now getting the course information from the in-memory store but we are still fetching the cert

data from the back end which makes sense we want the search to contain the most up to date values possible

while the course we already know that it's data that it's not likely to change very often.

So we want to keep it in memory on the client side.

Let's then try out this new version of the course component.

We're going to refresh the application and we're going to navigate here to the course screen.

So as you can see our course data an hour from mail is being displayed here correctly is expected.

What we're going to do next is we're going to present a couple of extra Rx G-S operators that are useful

in handling observables that are deprived from stores.

So what is particular about these observable Here course derived from the store.

It's that these observable and like all the HTP observables that we have been using so far these observable

here there's not complete and this is because our store to service observable here at these courses

Auray where all the data is getting the right from using the selector Mefford.

These observable here never completes.

So we are doing here multiple backend requests for example while saving of course.

But if these requests fail then it's the observable that is returned here to the caller of safe course
that is going to error out.

But the observable of our service itself that course is observable that will not error out.

Let's then introduce a couple of new Erich's operators that are going to help us to handle these particular
type of observable.
*/

@Injectable({
  providedIn: "root"
})
export class Store {
  // private subject = new Subject()
  private subject = new BehaviorSubject<Course[]>([]);
  courses$: Observable<Course[]> = this.subject.asObservable();
  init() {
    const http$ = createHttpObservable("/api/courses");

    const courses$: Observable<Course[]> = http$
      .pipe(
        tap(() => console.log("HTTP request executed")),
        map(res => Object.values(res["payload"]))
        // shareReplay(),
        // retryWhen(errors => errors.pipe(delayWhen(() => timer(2000))))
      )
      .subscribe(courses => this.subject.next(courses));
  }
  selectBeginnerCourses() {
    return this.filterByCategory("BEGINNER");
  }

  selectAdvancedCourses() {
    return this.filterByCategory("ADVANCED");
  }
  selectCourseById(courseId: number) {
    return this.courses$.pipe(
      map(courses => courses.find(course => course.id == courseId))
    );
  }
  filterByCategory(category: string) {
    return this.courses$.pipe(
      map(courses => courses.filter(course => course.category == category))
    );
  }
  saveCourse(courseId: number, changes): Observable<any> {
    const courses = this.subject.getValue();
    const courseIndex = courses.findIndex(course => course.id == courseId);
    const newCourses = courses.slice(0);
    newCourses[courseIndex] = {
      ...courses[courseIndex],
      ...changes
    };
    this.subject.next(newCourses);
    return fromPromise(
      fetch(`/api/courses/${courseId}`, {
        method: "PUT",
        body: JSON.stringify(changes),
        headers: {
          "content-type": "application/json"
        }
      })
    );
  }
}
