import { Observable } from "rxjs";

//we need a function to create() method which will implement the behvaiour of our observable
/*Transforming promise based fetch call to Observable , The advantage,
    is we can now use all the rxjs operators to combine our http stream with
    other stream like  click handler, timeou,t other http requests, we have
    whole world of operators that make it simple to combine stream and values*/
export function createHttpObservable(url: string) {
  return Observable.create(observer => {
    fetch(url)
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
  });
}
