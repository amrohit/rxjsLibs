import { Course } from "./../model/course";
import { Observable } from "rxjs";

/* The fetch api has support for cancellation
we can use AborController() to instantiate which will provide us a signal
as a property. if it emit the value of true, then the fetch result is going
tobe cancel by the broweser, so we can provide it as a second arg
and then below we can call .abort() method on the controller to cancel
the request but we  dont want todo in body defination

=> we want to call abort() only if we unsubscribe

notice that when we pass a function to object.craete we are not returning any value, we do have option of returning a value out of this function
this value returned should be function and this is the cancellation function
which will be executed by application by our unsubscribe() method



 */
export function createHttpObservable(url: string) {
  return Observable.create(observer => {
    const controller = new AbortController(); //AbortController is part of fetch api
    const signal = controller.signal;
    fetch(url, { signal })
      .then(response => {
        return response.json(); //.json() will return promise
      })
      .then(body => {
        //getting json data form promise
        observer.next(body);
        observer.complete(); //we terminated our http stream since no value gonna emit after body
      }) // Respecting observable contract with Either we are completing the observable or calling error
      .catch(err => {
        observer.error(err);
      });

    //controller.abort();
    //so unsubscribe is going to trigger a function which is returned which is result of creating our observable
    return () => controller.abort();
  });
}
