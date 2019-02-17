import { Store } from "./common/store.service";
import { Component, OnInit } from "@angular/core";

/*
We are going to inject here our store and then we are going to call an initialization operation on the
store.

Let's then implement here the on init interface and by implementing the n g on in it we are going to
be able to call the store.
Let's create here a new value in the store we are going to call it the init.
method  this is only when we called once that application startup time.
And the goal is that these method then calls the backend and fetches the list of courses so we are
going to take these HTP observable that we're defining here at the level of the component and we're
going to remove it from the home component the home component will no longer contact the backend directly
using HTP observables.
Instead the home component is going to get all the data that it needs from the store.
*/
@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent implements OnInit {
  title = "app";
  constructor(private store: Store) {}
  ngOnInit() {
    this.store.init();
  }
}
