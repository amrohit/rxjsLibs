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
  filterByCategory(category: string) {
    return this.courses$.pipe(
      map(courses => courses.filter(course => course.category == category))
    );
  }
}
