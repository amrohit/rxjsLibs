import { Course } from "./../model/course";
import { Component, OnInit } from "@angular/core";
import { createHttpObservable } from "../common/utils_basic";
import { noop } from "rxjs";
import { map } from "rxjs/operators";

@Component({
  selector: "home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"]
})
export class HomeComponent implements OnInit {
  begginerCourses: Course[];
  advancedCourses: Course[];

  constructor() {}

  ngOnInit() {
    const http$ = createHttpObservable("/api/courses");
    const courses$ = http$.pipe(map(res => Object.values(res["payload"])));

    //subscribing our observable (adding multiple callback to this)
    /*RXJS was meant to be used to avoid a lot of logic inside a subscribe call and should not definately nest subscribe calls together, that is
    rxjs type pattern   */
    courses$.subscribe(
      courses => {
        console.log(courses);
        this.begginerCourses = courses.filter(
          course => course.category == "BEGINNER"
        );
        this.advancedCourses = courses.filter(
          course => course.category == "ADVANCED"
        );
      },

      noop,
      () => console.log("completed")
    );
  }
}
