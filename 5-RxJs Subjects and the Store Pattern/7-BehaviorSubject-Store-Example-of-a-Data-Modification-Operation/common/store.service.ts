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
import { fromPromise } from "rxjs/internal-compatibility";
/*
Hello everyone and welcome back in this lesson we're going to complete the implementation of our store.

We're going to add that modification operation.

So far we have only ever here really only operations that have a home component consuming the data from

the store using selector methods.

We are now going to add to the store data modification operation that is going to be used here in our

course dialogue component.

So in this component we are going to be able to edit the course and we would like when we hit save for

a request to be sent to the back end to save the new data of the course but we will also like that new

value of the IS observable to be emitted so that the changes that we made to the course in memory are

also immediately reflective in an optimistic way in the remainder of the application.
While the backend save request is still ongoing.
Let's then start implementing our safe course logic.

We're going to switch here to the course dialouge.
 component which corresponds to this dialogue that we can see now on the screen.
 --after coure-dialog ln 70 ---
 Let's not implement this save course Mefford here in our store.
First let's define here the Mefford signature.

Going to here the first argument which is going to be the core ID of type number and the second argument

is going to contain our course modifications that we did here in the edit course they look for them.

So now what we're going to do is we're going to first start by modifying the course in memory.

We are going to change the course with these changes and we will broadcast the changes to the rest of

the application using our subject.
The first thing that we need is to get a reference here to the course with this particular I.D. So let's

first start by getting a reference to the complete array of courses we can get directly from the subject

by calling get value.

So now we have here an array of courses.

Now we want to find the Course with this particular levees so let's do that.

Using the find index may.

We're going to loop through all the courses and we're going to search for the course with the identical

to the course of the argument we're going to take this index and we're going to store it here in the

course index variable.

Now we know where the Course is.

In theory we could directly modify it.

What we should avoid to do that instead of modifying the in-memory volume delicately we should think

is that create here a new value of the Course's array and emit that value using the subject.

Yea the is that the consumers of the courses date that will get notified that a new value is available

if we would mutate the data directly in memory the components would not know that that data has been

modified.

And they would not be able to react to that modification.

So let's then create here in New Carse's array that we are going to be broadcasting as the new courses
value.

We're going to start by taking the existing courses array and we are going to create a copy of the array

using this slice operated in these array copy that we have here.

We are going to look now for the course with our cost index and we're going to assign it a completely

new javascript object so the idea here is to avoid mutating any data that was already passed to the

components.

Instead we are going to create a new course object.

Let's fill in this course objects by creating a copy of the course that we are trying to modify so we

can obtain that object here from the original Garces array using the index.

So at this point we are simply creating a copy of the Course object itself in order to create a copy

of the Course object we are using the javascript spreadsheet operated.

Now what we want to do is we want to modify this copy here with the changes that we have received here.

So let's use again here the spread operator to apply the changes on top of the copy.

At this point we have here a new coerces array that is in everything identical to the previous courses

array that we have here with the exception that the course that we are modifying has been replaced with

a new object that reflects the changes.

So we now can take these new courses values and we can broadcast it to our application using the subject

lets call subject the next and broadcast the new coerces object containing the changes that we made

here in the forum and with these we have optimistically modified in memory.

The course object with the changes but we also want to save these to the back end.

So in order to do a request to the back end we are going to be using the From promise may 5th and we're
going to be returning this observable here as the result of calling safe course.
Let's hear it.

Type notation we're going to say that we are going to return here the observable of type any Let's then

fill in here our ACTC promise we are going to be using is usual to fetch EPA and we're going to be hitting

the following.

Well we are going to be looking for the course with the L slash EPA slash courses and then we are looking

for this particular course ivy as we know fecche by default is going to create a nice big get Mefford.

So let's pass in here a couple more arguments.

We don't specify that 80 DPMI for that we are looking for ease in HTP put.

We're going to fill in the body of the HTP request we had went to Passim.

The change is object that we received here that contains the new value for the courts.

We're going to transform this into a string by using Jayson dot string ify and we're going to fill in

here our headers.

We need just only one head for our server to recognize that this is a Jayson payload.

We're going to fill in Content-Type with application slash Jayson and these we have completed implementation

of our Save course Mefford.

So let's remember that there are two parts of it.

First we are optimistically modifying the in-memory data in the store.

And next we are doing a request to the back end and we are returning this promise here to the course

dialog here.

We are going to close the dialog.

If the safe happens successfully or we're going to log out the error in case something goes wrong.

Let's then try this new version of our store we have here the new version already running.

And we're going to go ahead and open the core screen.

Let's change here a bit.

The title of the course.

Let's also switch here the cathedral from beginning to balanced and notice that when we click Save the

new value with the new category is going to be immediately broadcasted to the rest of the application.

And this course here is going to be moved to the advanced.

So we save the request is ongoing in the back.

And meanwhile the UI has already been optimistically updated with the new in memory changes.

If we switch to the advanced type we can see that we have here the new title of the course free edit

the course again and we select the kitty here to begin.

We are going to see that again these value has been moved here to the beginners tab.

As expected these changes are also getting reflective in the back and so the name of the course is now

our SJS course as opposed to our X just in practice course.

And if we reloader application we're going to see that we're getting the new title from the back end.

So these shows that our to save course request was executed successfully as expected Ltd's we have completed

the implementation of the home component using the new centralized store design.

Let's now do a similar refactoring to the cost component that displays a single course.

Where do we see how can we change it in order to use the store as well.


Autoscroll inactive
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
  saveCourse(courseId: number, changes) {
    const courses = this.subject.getValue();
    const courseIndex = courses.findIndex(course => course.id == courseId);
    const newCourses = courses.slice(0);
    newCourses[courseIndex] = {
      ...courses[courseIndex],
      ...changes
    };
    this.subject.next(newCourses);
    return fromPromise(
      fetch(`/api/courses/${courseId}`, {
        method: "PUT",
        body: JSON.stringify(changes),
        headers: {
          "content-type": "application/json"
        }
      })
    );
  }
}
