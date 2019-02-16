import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
/*
Here we are going to define our new operator
lets see what arguments this operator need.
in our program, instead of tap we would apply debug and we would start defining a logging level which wold be a constand and from
here would able to shows serveral options such as debug, trace,
info, lets say Info, means this perticular message we would like
to log at info level. the second argument would be the string that we would like to add to the log.
The text in this argument is going to show up on the console followed by the value, emitted by the observable.

lets see how we are going to implement the debug operator

* first we are going to do is to define a const debug which will the operator itself and we are assigning this to is a function

it is going to be a very special kind of function, a higher ordered function and we wil have two arguments, first one will be
the logging level which is going to be a number and the
second argument is going to be a message which is gtbe a string

this debug function that we are defining here needs to return another function and this is why this is called as higher ordered function
its a function that returns a functions

*so the debug is higher level function that takes as a input an observable and that gets us back another observable
so lets annotate the input of this observable as type any
The output of this function is going to be the output of the debug operator , inorder to understand that this is a source
observable, lets rename this to a source
now this output of this function needs to be an observable that logs a message that we have passed in here and that return us
back the original observable unchanged
so we are going to take the source observable and then pipe it
then we are going to be using the tap operator for implementing
our logging logic
in the tap operator we are going to call our value  the emitted
stream value we are going it to call a val, inside {we have logging logic}
we dont only want to login the message that we have received in the call to the debug operator  we also want to take the
observable value and concatenate it with value emitted by observable.
What we have at this stage is a skelton of a debug operator

*/

export const debug = (level: number, message: string) => (
  source: Observable<any>
) =>
  source.pipe(
    tap(val => {
      console.log(message + ": " + val);
    })
  );
