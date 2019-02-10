/*What we are going to do in this lecture:
swithMap()

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
import { createHttpObservable } from "../common/utils_basic";
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
    this.courseId = this.route.snapshot.params["id"];

    // this.course$ = this.store.selectCourseById(this.courseId);
    this.course$ = createHttpObservable(`/api/courses/${this.courseId}`);

    this.lessons$ = createHttpObservable(
      `/api/lessons?courseId=${this.courseId}&pageSize=100`
    ).pipe(map(res => res["payload"]));
  }

  ngAfterViewInit() {
    //making search works
    //fromEvent provides keyup event stream, using pipe and then map operator
    //we can derieve the content of the input box
    fromEvent<any>(this.input.nativeElement, "keyup")
      .pipe(
        map(event => event.target.value),
        debounceTime(400),
        distinctUntilChanged()
      )
      .subscribe(console.log); //a ab abc
    //getting each characater we type
    /*
     *we are going to get new value of output stream when we type each charcter
     * if we use concatMap for backend request
     * this will lead to use a huge request
     * so we can wait for user to type and could avoid lot of dublicate search
     * we could use for this is debounceTime(millisecond)
     * we could wait for given millisecond to check if the value get stable for this millisecond
     * if the delayed between the first and next value is less than given millisecond then
     * first value will not be considered as stable and will be discarded
     * considering the next value as stable
     *
     * if two consecutive values are same then we want to consider we only
     * want to emit only one value
     * we can get this functionaliy using distinctUntilChanged() operator
     * it will remove the dublication of values in the stream
     *   */
  }

  loadLessons(search = ""): Observable<Lesson[]> {
    return createHttpObservable(
      `/api/lessons?courseId=${this.courseId}&pageSize=100&filter=${search}`
    ).pipe(map(res => res["payload"]));
  }
}
