/*What we are going to do in this lecture:
in this lesson we are going to talk about throttling
in rxjs
we are going to introduce the throttle function and
throttleTime() operator

lets talk about the notion of trottling in general and discuss
how it compares with debounceTime() in our type ahead
These are two closely realted notion that often makes confusion.

lets review the debounce operation
we are going to create here a simple example
instead of making requst to bakend we are going to debounce the
input in to the console by using the subscribe method
if we try now then check on the screen, we will see that
once the user typing is stable then we are only going to get
something, once we have a value that has been stable atleast
for 400 milliseconds
this means, if the users keep typing relatively there will
never be output on the console becuase the value typed by
the user is not stable
so debouncing is about waiting for a value  to become stable

This is different than notion of throttling
throttling is somewhat similar to debouncing( where are also
trying to reduce the value in our stream  but the way we are
doing it is very different)

Throttle is used for limiting the output by limiting the no.
of values that can be emitted in a certain interval.
the throttle operator allows us to implement that
it uses an auxiliary timer observable that is going to determine
when should we emit the value from the input stream

the values are going to emit, then we will count for 1 sec
and after it lapse, we will take the current value and move it
to output and then again wait for 1 sec and then again catch
the recent value
we can increase or decrese the throttling time according to our
condition.

lets see if we use the throttling observable below
throttle() received a function and a function needs to return
a observable () => observable,
lets do the simple case where we are throttling and limiting
the rate of this observable to the amount maximum of 1 value per
half second, so for that we are going to periodically emit a
new value, we will see that each value is goint to emitted once in a  half second
lets have a look in the console, when we start typing we will
see that we are getting the value half each second output
rate limited in a time
but dont have the gaurate that our output is the latest value
of the stream
so when you type hello, the first value will be emiited immediately h
only containing the first letter then i stopped typing here
while the throttling interval was still going,
so now i stopped typing that the after h all the value got
throttled out and since i stopped typing the last value was not
caught, then we will type lette o then we will see the output
is emitted =>Hello

so in thie type ahead we really want to use deboucing
instead of throttling to sure that we are using the latest
search that was type

now look an easier way to implement the logic

we have used the generic throttle() operator and we
have created here the observable that is triggering the
throttling manually by using here the interval function

an alternative way to acheive the same result and easier to
read is

the trottleTime(ms) operator so this will create internally
interval





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
    this.course$ = createHttpObservable(`/api/courses/${this.courseId}`);
  }

  ngAfterViewInit() {
    this.lessons$ = fromEvent<any>(this.input.nativeElement, "keyup")
      .pipe(
        map(event => event.target.value),
        // debounceTime(400)
        throttle(() => interval(500))
      )
      .subscribe(console.log);
  }

  loadLessons(search = ""): Observable<Lesson[]> {
    return createHttpObservable(
      `/api/lessons?courseId=${this.courseId}&pageSize=100&filter=${search}`
    ).pipe(map(res => res["payload"]));
  }
}
