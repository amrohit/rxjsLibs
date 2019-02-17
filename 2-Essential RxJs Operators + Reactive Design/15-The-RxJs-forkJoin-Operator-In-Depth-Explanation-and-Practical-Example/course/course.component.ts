/*What we are going to do in this lecture:
we going to introduce rxjs forkJoin operator
The forkJoin operator allows us to launch serveral test in parallel, wait for the test to complete,
 then we can get back
the result of each task and use those combine results together

we are going to use the course component to give how the forkJoin works, it might be used with http request .
we re going to launch one course observable const course$ that is going to fetch the course from the http url
then we are going to create a second observable which is going tobe a lesson observable
These observable is going to be fetched from backend a list of lessons const lesson$ for loadLesson()
lets say we want to trigger the both method at a same time, send them both at the backend same time, have the
backend serve
the each request parallel and  then wait for the result of the
both course observable and lesson observable to return from the
backend and only at that moment we would live to trigger some
extra logic when we have the course$ and the lesson$

This type of logic can be easily implemented using the forkJoin operator
So the name of the opeator come from facts, like we are forking two streams and then we are joining the results
of streams of
together when both request are completed
so as usual we need to subscribe the forkJoin or otherwise nothing will happen or neither any of these two http requests
will be triggered
now we get back in the subscribe is the tuple value contains both the output of the course observable and the lesson observable
lets have look on this what tuple value looks like
lets pipe and use the tap operator to see the logged output
in the tap operator the tuples value we get is a typescript
type and looks like an array which is very similar to the array with two elements one will be course(first) and another would be lesson(second)

so these two http requests are performed in paralled but this tuple value is only emitted when the both observables get completed
if any of the two observable doesnt complete the no tuple value will ever emitted
if for some reason one of this tuple value emit multiple  values
then completes,the value
then what we are going to get here is the last value emitted before completion

*so forkJoin is ideal for handling parallel http request or performing the long running calculation in parallel that
might emits multiple values then eventually emits the final value
and then they complete
*/

import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Course } from "../model/course";
import {
  debounceTime,
  distinctUntilChanged,
  startWith,
  tap,
  delay,
  map,
  concatMap,
  switchMap,
  withLatestFrom,
  concatAll,
  shareReplay,
  throttle,
  throttleTime
} from "rxjs/operators";
import { merge, fromEvent, Observable, concat, interval, forkJoin } from "rxjs";
import { Lesson } from "../model/lesson";
import { createHttpObservable } from "../common/utils_basic";
import { Store } from "../common/store.service";
import { searchLessons } from "../../../server/search-lessons.route";
import { debug, setRxjsLoggingLevel, RxjsLoggingLevel } from "../common/debug";
import { RxJsLoggingLevel } from "../common/debug_original";

@Component({
  selector: "course",
  templateUrl: "./course.component.html",
  styleUrls: ["./course.component.css"]
})
export class CourseComponent implements OnInit, AfterViewInit {
  courseId: number;

  course$: Observable<Course>;

  lessons$: Observable<Lesson[]>;

  @ViewChild("searchInput") input: ElementRef;

  constructor(private route: ActivatedRoute, private store: Store) {}

  ngOnInit() {
    this.courseId = this.route.snapshot.params["id"];

    // this.course$ = this.store.selectCourseById(this.courseId);
    const course$ = createHttpObservable(`/api/courses/${this.courseId}`);

    const lessons$ = this.loadLessons();

    forkJoin(course$, lessons$)
      .pipe(
        tap(([course, lessons]) => {
          console.log("course ", course);
          console.log("lesson ", lessons);
        })
      )
      .subscribe();
  }

  ngAfterViewInit() {
    this.lessons$ = fromEvent<any>(this.input.nativeElement, "keyup")
      .pipe(
        map(event => event.target.value),
        throttleTime(500)
      )
      .subscribe(console.log);
  }

  loadLessons(search = ""): Observable<Lesson[]> {
    return createHttpObservable(
      `/api/lessons?courseId=${this.courseId}&pageSize=100&filter=${search}`
    ).pipe(map(res => res["payload"]));
  }
}
