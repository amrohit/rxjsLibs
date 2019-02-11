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
    //making search works
    //fromEvent provides keyup event stream, using pipe and then map operator
    //we can derieve the content of the input box
    const searchLessons$ = fromEvent<any>(
      this.input.nativeElement,
      "keyup"
    ).pipe(
      map(event => event.target.value),
      debounceTime(400),
      distinctUntilChanged(),
      //concatMap(search => this.loadLessons(search)) //not good option since it will create multiple http request
      //here want to cancel the old request and switch to new http request
      switchMap(search => this.loadLessons(search))
    );
    // .subscribe(console.log); //a ab abc
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
     *
     * lets use switchMap()
     * we will create a loadLesson() method
     *  */
    const initialLessons$ = this.loadLessons();
    //Here we have concatenated the first intital default search list and user search list
    this.lessons$ = concat(initialLessons$, searchLessons$);
  }

  loadLessons(search = ""): Observable<Lesson[]> {
    return createHttpObservable(
      `/api/lessons?courseId=${this.courseId}&pageSize=100&filter=${search}`
    ).pipe(map(res => res["payload"]));
  }
}
