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

--For The catch and Rethrow---- explanation---
we are going to conver the catch and Rethrow error handling strategies
1. first we are going to imporove the defination of http observable
2. in the createHttpObservable function to crate http observable
we can see although we are supporting the http cancellation and
our error handling logic is not good as it could be.
3. This is due to behaviour of fetch api, so the fetch api is
going to call here, the backend is going to respond us a response
and there we have catch error block if something fails.
4. But the problem is that this catch error block is going to
trigger only in case of fatal error such as incase of netowrk
failure or dns error something browser that can not recover from.
5. However, there are other situations, such as for example,
getAllCourse api where we are returning 500 server internal error
from the client that we would also like to use to error out our
observable, so we are going to error out our observable not only
in the case of fatal error but also we are going to error out
our observable if the resposne from the server was returned but
it was an error response
6. so, inorder to check inwhich case we are, we are going to use
the ok flag from the response object
7. so, we are going to consider that the response is successful,
if the response is true
8. if the resonse is true we will return a json payload or else
we will return an erro observable by calling error method on
observable
10. so we have imporoved the error handling of our http observable
9. Go to home.component.ts


 */
export function createHttpObservable(url: string) {
  return Observable.create(observer => {
    const controller = new AbortController(); //AbortController is part of fetch api
    const signal = controller.signal;
    fetch(url, { signal })
      .then(response => {
        //ok property on response to chek if resposne is set to true
        if (response.ok) {
          return response.json();
        } else {
          observer.error("Request failed with status code: " + response.status);
        }
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
