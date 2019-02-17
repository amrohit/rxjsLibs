/**
 * Lets filter here at the value of the course let's make sure that these value is correctly defined so

if we transform the course of oil to a boolean we should have here the value true.

This is going to filter out and the final results that we will get initially due to the store being

initially empty and not containing any courses with is in place we are now ready to try this new version

of the code.
 */
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
  tap,
  filter
} from "rxjs/operators";
import { fromPromise } from "rxjs/internal-compatibility";
/*

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
      map(courses => courses.find(course => course.id == courseId)),
      filter(course => !!course)
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
