/*
Hello everyone and welcome back in this lesson we are going to refactor the course component in order
to use the store solution and we are also going to present a couple of extra Erich's GSA operators that
they're usually useful in the context of store solutions.

So first let's refactor here our cost component to fetch the cost data directly from the store instead
of making these extra HTP request.

We're going to start by injecting here the store in the constructor with the store.

We are going to search for the course using a new selector Meffert that we are about to write.

We are going to call these new selector Mefford select course by id and we are going to pass the course
identifier that we have defined here.


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
  shareReplay
} from "rxjs/operators";
import { merge, fromEvent, Observable, concat } from "rxjs";
import { Lesson } from "../model/lesson";
import { createHttpObservable } from "../common/util";
import { Store } from "../common/store.service";

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
    this.courseId = +this.route.snapshot.params["id"];

    // this.course$ = createHttpObservable(`/api/courses/${this.courseId}`);
    this.course$ = this.store.selectCourseById(this.courseId);
  }

  ngAfterViewInit() {
    const searchLessons$ = fromEvent<any>(
      this.input.nativeElement,
      "keyup"
    ).pipe(
      map(event => event.target.value),
      debounceTime(400),
      distinctUntilChanged(),
      switchMap(search => this.loadLessons(search))
    );

    const initialLessons$ = this.loadLessons();

    this.lessons$ = concat(initialLessons$, searchLessons$);
  }

  loadLessons(search = ""): Observable<Lesson[]> {
    return createHttpObservable(
      `/api/lessons?courseId=${this.courseId}&pageSize=100&filter=${search}`
    ).pipe(map(res => res["payload"]));
  }
}
