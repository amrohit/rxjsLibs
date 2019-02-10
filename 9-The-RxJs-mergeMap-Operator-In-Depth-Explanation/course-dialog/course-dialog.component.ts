/*What we are going to do in this lecture:
mergeMap()
in the last lesson we have covered the merge strategy for combining the
observables

merge is idle for performing the http request in parallel
as we have seen before
use of concatMap() method is ensuring that our first call got saved before ensuring the second one.
This is the logic we want here for the save operation

But you would like perform multiple calls to backend  in parallel and
fetch the results of each call as they arrive over time and in that case
we can use mergeMap() insted of concatMap()

mergeMap() is similar to concatMap()
The principle is same, we are going to take the value of the source
observable and then we are going to apply a mapping function
mergeMap(i => 10*num) that will take value and will produce new observable
lets say we have source observable emitted value 1,2,5
so map will take value 1 and then running the function it will create
a new observable which takes the value multiply by 10 and then terminates
the observable, the observable gets completed

we will only complete the result observable when our source observable gets
completed

Conclusion:

If the order of the value is important then we should use concatMap
if we want perform our observables in parallel, we may use mergeMap

*/

import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
  ViewEncapsulation
} from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { Course } from "../model/course";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import * as moment from "moment";
import { fromEvent, noop } from "rxjs";
import {
  concatMap,
  distinctUntilChanged,
  exhaustMap,
  filter,
  mergeMap,
  tap
} from "rxjs/operators";
import { fromPromise } from "rxjs/internal-compatibility";
import { Store } from "../common/store.service";

@Component({
  selector: "course-dialog",
  templateUrl: "./course-dialog.component.html",
  styleUrls: ["./course-dialog.component.css"]
})
export class CourseDialogComponent implements AfterViewInit, OnInit {
  form: FormGroup;

  course: Course;

  @ViewChild("saveButton") saveButton: ElementRef;

  @ViewChild("searchInput") searchInput: ElementRef;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CourseDialogComponent>,
    @Inject(MAT_DIALOG_DATA) course: any, //Course
    private store: Store
  ) {
    this.course = course;

    this.form = fb.group({
      description: [course.description, Validators.required],
      category: [course.category, Validators.required],
      releasedAt: [moment(), Validators.required],
      longDescription: [course.longDescription, Validators.required]
    });
  }

  ngOnInit() {
    //listening to form changes and then filtering out the valid one
    //converting fetch() promise api to observable using rxjs fromPromse()

    // this.form.valueChanges
    //   .pipe(filter(() => this.form.valid))
    //   .subscribe(changes => {
    //     const saveCourse$ = this.saveCourse(changes);
    //     saveCourse$.subscribe();
    //   });

    //Refactored code
    //if you see all the operation are happening in sequence(one by one) despite of
    //emitting lots of new value
    this.form.valueChanges
      .pipe(
        filter(() => this.form.valid),
        mergeMap(changes => this.saveCourse(changes))
      )
      .subscribe();
  }

  saveCourse(changes) {
    return fromPromise(
      fetch(`/api/courses/${this.course.id}`, {
        method: "PUT",
        body: JSON.stringify(changes),
        headers: {
          "content-type": "application/json"
        }
      })
    );
  }

  ngAfterViewInit() {}

  save() {
    this.store
      .saveCourse(this.course.id, this.form.value)
      .subscribe(
        () => this.close(),
        err => console.log("Error saving course", err)
      );
  }

  close() {
    this.dialogRef.close();
  }
}
