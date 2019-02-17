/*

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
    this.course$ = this.store.selectCourseById(this.courseId);
    this.loadLessons()
      .pipe(withLatestFrom(this.course$))
      .subscribe(([lessons, course]) => {
        console.log("lessons", lessons);
        console.log("course", course);
      });
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

/*
Hello everyone and welcome back in the lesson we're going to present in new Eric's geus operator with

latest from Operator these operator is especially useful when dealing with long running observables

such as for example the Course's observable in our store.

Let's give a concrete example where with latest from Will come in handy let's say that for example we

are doing here a back and request and we are calling here to the lower left since May 5th is going to

trigger here a request and it's going to get us back and observable.

These are observable is going to emit its first volley which contains a lesson array.

Now let's say that we would like to take the output of these observable and somehow combine it with

the result here.

Over the course observable so we would like we have here the Meffert that gets only triggered after

we get results back here from lothe lessons.

But we would like to apply some logic that also uses the course.

So this means that here in our subscriber Mefford we would need not only the license itself which is

what we get here as the result of calling Lowood license but we would also need he had access to the

course variable.

The problem is that in this component we don't have a course very well defined.

We only have a course observable variable which is a longer ending observable as we saw before.

These observable here is derived from the store courses observable that we have declared here and these

observable here never completes one way that we will have to implement these would be to manually subscribe

here to this course observable and extract the data emitted by it.

So we would take the course observable we would subscribe to it.

We will receive back here the course and we will sign it here to work.

Course very well that we will and right next year to this course observable observables so we would

do something like this.

We would define here an extra variable of course.

So as you can see this is really not very convenient.

We're adding here and next her subscription and we are sort of duplicating here these declaration of

data for our component we are declaring here both coarse and the observable.

Of course we would prefer to keep our components using a more reactive design where we're not doing

all these manual subscriptions.

So one better way of training the course data would be to use the with latest from operated.

This operator allows to combine multiple observables together long running or not by taking the latest

value emitted from each observable and providing that to the next operator in the chain or to the subscribe

Mefford as a tuple value.

So we will be emitting here that duple that will contain as the first value the lessons array.

And as the second value the course.

So the two values emitted by these two observables to better understand how the with latest from operator

works.

Let's have a look here at the marble diagram.

So we have here a couple of streams of values that are being combined using the with the latest from

operated the first stream that we have here is the source observable Dizzy's the observable that is

getting combined with several other observable so in this case we are only combining it with this second

observable.

So let's see how we the latest from what works let's start here at the beginning we have here to the

source observable that emitted its first value a value.

Now the goal of with latest from is to meet the same value as the source but emitted together with the

latest value of these observable here.

Notice that when the value was emitted we did not get any fig in the output.

And that is because the second observable has not yet emitted any value.

Now the time line is going to continue.

And our second observer is going to emit its first value.

So with the latest from he's going to capture this value and he's going to remember it this is the latest

value that was emitted so far by this particular observable.

Now when the source observable emits again then we are going to emit here a combined output that combines

the current value of the source observable B we the latest volley from these other observables So in

this case one notice that now is the second observable continues to emit values to free.

And for a while the source of Zervos did not emit anything with the latest from is going to take notice

that these value the latest Velho is evolving over time.

So the latest volley emitted by these absorbable is no longer one but it becomes too free.

And for now when the source observable emits again another value we're going to have here in the output

the latest volley here of the source observable C combined with the latest volume emitted by these other

observable for.

So we have here the output C4.

So you can see with latest from is all about combining the current value of an observer with the latest

Valo emitted by one or more other observables.

So let's have a look here in our program how these will help result we're getting here the lessons value

that is the result from calling lothe lessons and we are combining it here with the latest volume emitted

by the coarse the observable.

So this means that what we are going to get here in our subscribe Meffert is no longer only the lessons.

Instead we are going to get here at cuple type that is going to combine the lessons which is the value

emitted by the first observable with the corpse which is the value emitted by the second observable.

Let's now lug these two values to the console to see if this is indeed working as expected.

Let's now have a look at this in action.

We're going to open the console and we're going to reload our application so we can see we are going

to get here in the console.

Both the lessons array containing the output of load lessons but we will also have here available in

the console the course with the latest volume emitted by the course observable as expected.

And with these we have over a couple of operators that are commonly needed whenever we are using the

store pattern either by implementing it ourselves using behavior or subject or if using a third party

library such as Ngaire X Ltds.

We have reached the end of the Course.

Congratulations for completing the Erich's J.S. in practice course in the next lesson which will be

the conclusion lesson we are we to summarize everything that we have learned throughout the course and

highlight some key takeaways.
 */
