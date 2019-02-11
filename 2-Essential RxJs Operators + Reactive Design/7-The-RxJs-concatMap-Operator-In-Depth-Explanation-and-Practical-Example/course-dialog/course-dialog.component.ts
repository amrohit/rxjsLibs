/*
What else in the lesson?
Here we will get see Observable concatenation
We will see why observable concatenation is idley suited for save operation
we want to make sure that save operation happens in the same order as
the values are emitted and these implementation here doest not provide the
logic(what we did in the previous lecture)
we are taking the value of our first observable which is the form.valueChange
observable and down below we are converting it to the second saveCourse observable but we are not waiting for the previous save to complete.

Let's see how can we implement that

we are going to take that part which create new observable and will move to
new method called saveCourse() which will return that observable

   //what we really want to do in this situation is to take the values of
   source observable and for each value to create a new save observable and
   then we want to concatenate those observables together to make sure that
   save operation are done in the right order

   so what we have here is the mixture between the mapping operation where
   we are taking the output of the one observable valeChanges() and creating
   from it a second observable and of the concatenation logic

   so these mixture of transforming one observable into another observable
   concatenating the result together is best implemented using the rxjs
   concatMap() operator.
  How this operatior work?

  1. we are going to listen to the value of the first observable untill it
  get complete
  2. and for each value of the source observable we are going to create
  2nd derive observable

  so in our case, our first observable will be the valid form changes emitted
  over time
  and then our derieved observable from the form value would be the save operation
  so in we are going to call http put call to backend and will going to complete the observable immediately
  and those will be emitted in the concatMap()
  so for the first value change another observable will be derived and
  once it completes only then we are going take the next value of the source
  observable and will  create a second observable for that taken source value
  ----------
  Conclusion:
  take the first form value then turn that into http request
  wait for the first http request to complete
  then only create the next http request for the second form value

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
    @Inject(MAT_DIALOG_DATA) course: Course,
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
        concatMap(changes => this.saveCourse(changes))
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
