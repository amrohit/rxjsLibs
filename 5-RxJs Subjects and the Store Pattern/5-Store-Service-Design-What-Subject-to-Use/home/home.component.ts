
import { Store } from "./../common/store.service";
/*
* We are now going to put subjects to practical use by implementing a very common design pattern in our

application.

We are going to be implementing a centralized store to understand what are the benefits of this approach.
Have a look here at our home component that is displayed here.

As you can see with the current design of the home component every time that we never get into it by

using here the navigation menu we are going to trigger here in New HTP requests so we will be fetching

our course data from the back end again and again let's now confirm that that is indeed the case.

We're going to switch to a larger window and we're going to trigger here our home component by navigating

for example to the About page and then back here to the home component.
So as you can see we have three year here one API request to slash EPA slash courses.

We now head over here to the view course page and we click back to the home component where you can

see that again.

We do a duplicate HTB request which is fetching the data from the server.

Once again so this data did not change.

We are just fetching it back because we have not kept it in memory on the client so whenever we navigate

between two routes and we discarded and recreated our home component we lost these data that we had
here.
We would like to avoid that we have to make these requests constantly to the server.

Instead we would like to be able to store the data here on the client side independently of the home

component so whenever the home component gets discarded our data should not get discarded with it.

We need a central place in memory on the client to store our data whenever our home component needs the data.
It simply needs to subscribe to it and it's going to receive the latest version of the data.

So we have here an indication of what our design will be.

We are going to design a centralized service that is going to contain our data and that service is going

to expose a couple of observables that service is going to be responsible for fetching the data from
the back and at the appropriate moment.

And also it's going to be responsible for storing that data in memory providing it to the rest of the
application and then the form of an observable.

Let's then see what the share of the observable Service will look like.
We're going to start creating it by going here to the common directory we're going to create here a

file We're going to call it store dot service Dot ts.

====continue from store.service.ts===
We are going to create a constructor for the home component and we're going to have the store injected here.

So as you can see we now can access the store service the star service is going to contain our data

and we will be able to consume the data and of the form of an observable.
**swith to store.servie.ts
*/

import { Component, OnInit } from "@angular/core";
import { Course } from "../model/course";
import { interval, noop, Observable, of, throwError, timer } from "rxjs";
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
import { createHttpObservable } from "../common/util";

@Component({
  selector: "home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"]
})
export class HomeComponent implements OnInit {
  beginnerCourses$: Observable<Course[]>;

  advancedCourses$: Observable<Course[]>;
  constructor(private store: Store) {}

  ngOnInit() {
    const http$ = createHttpObservable("/api/courses");

    const courses$: Observable<Course[]> = http$.pipe(
      tap(() => console.log("HTTP request executed")),
      map(res => Object.values(res["payload"])),
      shareReplay(),
      retryWhen(errors => errors.pipe(delayWhen(() => timer(2000))))
    );

    this.beginnerCourses$ = courses$.pipe(
      map(courses => courses.filter(course => course.category == "BEGINNER"))
    );

    this.advancedCourses$ = courses$.pipe(
      map(courses => courses.filter(course => course.category == "ADVANCED"))
    );
  }
}
