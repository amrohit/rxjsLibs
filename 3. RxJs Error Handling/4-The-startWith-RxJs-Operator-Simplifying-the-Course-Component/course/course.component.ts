/*What we are going to do in this lecture:
swithMap()
unsubscribe the old observable and subscribe to the newer one
ex search: if you type something, the type will be cancelled and new typed words will
be taken as subscribed
can be used for http request where you will type something to search and
while you are typing if you type next word, the previous word search request will be
subscribed and the next full word will be taken for process subscription
eg: in a sequence of emitted value by observable 1,2,3,4,5
if one is emitted, 1 will be subscribed but if any new value will be emitted, previous
observable 1 will be unsubscribed

debounceTime(millisecond) //This operator will wait for the given millisecond and will check if
the emitted value is stable for the above millisecond time then it will consider that value
as stable otherwise it will discard that value consdering it unstable
time 500 ms
if value 1 is recevied and not further value recevied within a 500ms
1 => confirmed
2 and 3 recevied with in 500ms, 3 will be checked for 500ms by discarding value2

    distinctUntilChanged()  //this below operator will filter the unique value by combining the current and previous emited value from stream
    1,2,2,2,3,4,4,4 => 1,2,3,4


    ------StartWith Operator------- lecture

    in this lecture we are going to refactor our codes
The goal of this operator is to initialize the stream with
a given value
the stream this.lesson$ we built by concatenating the initial
lesson with search lessons
the logic we wrote with the concat works great
but lets see how can we do this with a bit less code
1. what we are going to do is to assign the lesson, the output
of our typed ahead logic
2. this assignment will be true in the most of the cases except
of the inital case where we would like to assign the lessons
the output of the empty search using the empty string,
so what we were doing that logic is to trigger that
initial search , this can also be done wth  startWith()
operator in the uplevel of the chain

2. we are going to take the observable fromEvent...event.target.value which is the typed search
and we are going to apply a startWith operator , so
startWith expects an argument with initial value
for this stream and our initial value for the search stream
value is going to be an empty value of string (to show all search result) to fetch the initial search results

with this we will see that our search is indeed working
but this time with a lot of less code
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
    this.lessons$ = fromEvent<any>(this.input.nativeElement, "keyup").pipe(
      map(event => event.target.value),
	  startWith(''),
      debounceTime(400),
      distinctUntilChanged(),
      //concatMap(search => this.loadLessons(search)) //not good option since it will create multiple http request
      //here want to cancel the old request and switch to new http request
      switchMap(search => this.loadLessons(search))
    );
  }

  loadLessons(search = ""): Observable<Lesson[]> {
    return createHttpObservable(
      `/api/lessons?courseId=${this.courseId}&pageSize=100&filter=${search}`
    ).pipe(map(res => res["payload"]));
  }
}
