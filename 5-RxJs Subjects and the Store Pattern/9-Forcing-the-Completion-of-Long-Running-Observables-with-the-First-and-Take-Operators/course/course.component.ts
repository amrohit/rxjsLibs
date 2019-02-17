/*
Hello everyone and welcome back in this lesson we're going to show how to force completion of long running

observable such as for example the store God is observable.

We're going to be learning about the first and the take operators.

Let's give a concrete example that is going to help us to understand when these operators become useful

as we have discussed in the previous lesson.

These observable here that we have available via the store the course is observable.

It does emit here of course veray as its value.

And one of the main features of these absorbable is that it will never complete.

It will continuously emit over time.

New versions of the Course's array as we edit each course and the same will happen to any observable

that is directly derived here from the Course is observable.

For example these observable here the course observable is obtained by taking the Course's array observable

and applying a filter to it trying to find the Course we think even maybe these depraved observable

here the course observable will also never complete.

Let's see a potential consequence for that.

Let's say that for example we were trying to combine these observable here with another observable using

our SJS fork join operator.

Let's say that we are trying to combine the course observable with for example a cold to load lessons.

It is going to return this and the observable of lesson array.

Let's see what happens if we subscribed to this observable and try to output the result of the fourth.

Join the console.

If we try this version of the program we are going to see that we don't get anything here in the console.

So when the application finishes refreshing We don't have here the output of this for join.

And this is because the fork joint operator waits for the completion of each of the four observables

before producing the combined joint result.

This is just an example there are many other situations where we would prefer to have our course observable

to complete after emitting the first value.

If you find yourself in the situation where you would like to by some reason try to force the completion

of an existing observable you can do so using the Erich's G-S first operator.

Let's have a look at its marble diagram.

So here in the input we have a stream of values emitting the vowels A B C and D.

If we take the stream and we apply that are extreme as first operator.

What we're going to get as a result is a derived stream that emits only the first value of the source

stream and then it immediately completes.

So that is exactly what we are looking for here.

In order to make these four join work let's then go back to our program enforce here the completion

of the Course observable.

We are going to apply pipe here and we're going to apply here that are SJS first operated.

So this is going to wait for the mission of the first volley which will contain the course and then

this is going to complete the course observable before trying this out.

Let's quickly first fix here a small issue in the implementation of select course by Eddy.

Notice that here we are initialising our courses observable within M-theory.

So the first time that these silly course by the selected function gets cold this fine May 5th is going

to return and the fines.

So we will have here a value first of undefined emitted by the returning observable and then only then

we will have the course with these given ID.

So we want to filter out these initial undefined Dady by applying here that Erich's just filter operator.

Lets filter here at the value of the course let's make sure that these value is correctly defined so

if we transform the course of oil to a boolean we should have here the value true.

This is going to filter out and the final results that we will get initially due to the store being

initially empty and not containing any courses with is in place we are now ready to try this new version

of the code.

Let's then see if for join this time around we'll work as expected.

So we fully load the application we are going to see that these days.

We do get here in the console the result of calling for join in these two observables.

Before we didn't get anything.

Now we do get here the expected result and this is because have for the completion of the Course observable

by applying here the first operator there could also be other situations where for some reason you want

to force the completion of an observable not after the first value gets emitted but let's say after

the second or four the fourth value gets emitted.
So if that's the case if you want to limit the number of values emitted by a given absorbable you can
do so using the are ex-chief stake.
Operator Let's have a look at the marble diagram of the take.
Operator So we have here a source observable that is emitting here.
Novalis a b c and d.
And here we have a derived observable that was calculated by applying take two to the original observable.
So as expected what happens is that these derive the observable is going to emit only the first two
values.
And then once the second valve gets emitted the observable will also get immediately completed.
Let's then see the take operator in.
If we switch right here to our program we can refactor this to obtain the same result that we got here
by using the DESC operator instead of we are going to say that we only want to take the first value
if we now try this out.
We're going to see that we still get here in the console.
Our fourth joint output.
So here it is.
This is still working as expected.
And this is equivalent to applying the first operator.
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
  first,
  take
} from "rxjs/operators";
import { merge, fromEvent, Observable, concat, forkJoin } from "rxjs";
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
    this.course$ = this.store.selectCourseById(this.courseId).pipe(
      // first()
      take(1)
    );
    forkJoin(this.course$, this.loadLessons).subscribe(console.log);
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
