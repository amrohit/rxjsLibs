/*What we are going to do in this lecture:
=> own rxjs custom operator
the  operator we are going to write is debug operator
that is going out to help us a lot to debug our rxjs programs
*sometime it is not easy to understand what is going on
when we are applying multiple operator, it is not going
to understand what is going on just by reading the observable
chain,
so in order to understand the program and to troubleshoot the
program we often use the tab() operator for producing the
debugging logging statement.
* for example, we can use the tap operator to logging the searched value on the console.

* As the program gets longer and complex, we would get lot of tap operator in the rxjs chain and lot of output on the console.

* in order to avoid the large volume of information on the console we would end up the problem that we were solving investigating
going back and commenting or deleting all the statement that
we all added
we would like to have this multiple logging operators but we want something that it could trun off these logging information

*So, we are going to create a new opearator that we are going to call a debug operator
This is going to allow us to turn on and off the logging statements according to predefined logging level error info, debug or trace.

lets get started defining our custom rxjs operator in the common folder and will create debug.ts file. see you there now.

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
  throttle
} from "rxjs/operators";
import { merge, fromEvent, Observable, concat, interval } from "rxjs";
import { Lesson } from "../model/lesson";
import { createHttpObservable } from "../common/utils_basic";
import { Store } from "../common/store.service";
import { searchLessons } from "../../../server/search-lessons.route";

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
    this.course$ = createHttpObservable(`/api/courses/${this.courseId}`).pipe(
      tap(course => console.log(course))
    );
  }

  ngAfterViewInit() {
    this.lessons$ = fromEvent<any>(this.input.nativeElement, "keyup")
      .pipe(
        map(event => event.target.value),
        startWith(""),
        tap(search => console.log(search)),
        debounceTime(400),
        distinctUntilChanged(),
        switchMap(search => this.loadLessons(search))
      )
      .subscribe(console.log);
  }

  loadLessons(search = ""): Observable<Lesson[]> {
    return createHttpObservable(
      `/api/lessons?courseId=${this.courseId}&pageSize=100&filter=${search}`
    ).pipe(map(res => res["payload"]));
  }
}
