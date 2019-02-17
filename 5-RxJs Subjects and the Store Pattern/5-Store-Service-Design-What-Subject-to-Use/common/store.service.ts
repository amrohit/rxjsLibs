import { Observable, Subject, BehaviorSubject } from "rxjs";
import { Injectable } from "@angular/core";
import { Course } from "../model/course";

/*
Yes this is going to contain our centralized observable store.

We are going to write this under the form of a class.

So we are going to call the class store and we are going to make it an angular service Sing's this application
here is an application.
There will be minimal angular related code in this class.

We're only going to need here the injectable decorated.

Also we need to configure the service in our application so that we can easily inject it in their services

and components such as for example here the home component.

So we are going to make the service injectable in the rest of the application by specifying here the

Revive in property and we're going to assign the value of route these configuration here simply means

that there is only one store for the whole application.

We're going to go ahead and injected here directly in our home component.

----------
Let's then define that observable.

We're going to switch to the store class and we're going to define the public API of our store.
We're going to be fine here in the observable cold courses which is going to be of type observable of

course array.

So these is where we are going to store these least of course is that we see here on the screen both

the beginner courses and the advanced courses they will all be available here to the remainder of the
application by subscribing to these courses observable.
The question now is how are you going to find these observable.

This is one of those situations where it's really not convenient to use observable create or one of

the existing methods in the Erich's just Library.

So this is a good situation for using a subject to create these observable.

Let's then define here a private member variable which is going to be our subject.

We're going to make this private to this class so that only this class has the ability for emitting

violence for these observable.

We want to keep that power constrained here inside this class.

We wouldn't want parts of the applications such as for example the home component to be able to emit

a list of courses on behalf of the store itself only the store has the power of emitting nivalis for

these observable.

The subject is just a private implementation detail that we are using to essentially create these courses

observable.

So let's start by defining here a plane are ex-GI a subject and we are going to build these observable

here by depriving it from the subject just like we did before using that as observable Mefford we the

subject we are going to be able to emit values here for the course is observable which can then be consumed

in other parts of the application such as for example the home component.

Let's now discuss what type of subject do we want to use for this store implementation.

It's important for our application.

The late subscribers to these observable to also get the latest emitted value.

So whenever we navigate throughout the application going to the About screen for example and back to

the courses screen we will have each time new instances of the home component created each time the

component gets destroyed and recreated as we navigate back to the Course's route.

So we wanted the later instances of this component to also get the Course's data.

This means that the subject that we are looking for is the behavior of subject.

This is the subject implementation that is going to ensure that the late subscribers always get the

latest version of the Course array.

So we are going to provide here an initial value for that array which is going to be the empty.

So initially there are no courses loaded in the store.

Notice also that we have specified here the parametric type coarse array in our behavior subject is

going to help us to write our code in a type safe way.

This essentially means that we can only pass to the subject via the next Meffert instances of course

arrays so if we try to in for example an array of numbers we will get a compilation error.

Now that we have designed our store service let's then start implementing it.

We are going to load some data from the back end and we're going to emit it in these observable.

This is coming right up in the next lesson.
*/

@Injectable({
  providedIn: "root"
})
export class Store {
  // private subject = new Subject()
  private subject = new BehaviorSubject<Course[]>([]);
  course$: Observable<Course[]> = this.subject.asObservable();
}
