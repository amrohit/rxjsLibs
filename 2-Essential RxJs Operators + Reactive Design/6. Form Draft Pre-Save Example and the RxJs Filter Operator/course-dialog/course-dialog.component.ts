/*
What else in the lesson?
here we have used fromPromise() method which will convert the promise
into observable and will not call untill we subscribe it
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
    /*
    if see below this version, we have combined two streams by
    nesting here multiple subscription calls, this is want we have to avoid
    on rxjs, it is anti-pattern we have called subscribe inside subscribe

   Atlast: when you open network tab, you will see this is not working exactly
   how we expected, when you click on edit and type something, it will
   generate new values and these values will be sent to backend same time,
   we can see in waterfall and some of request are exected at same times,
   and these is not the usual logic we want for the save logic,
   what we want is to wait for the operation to complete before issuing another save, if we dont wait for the previous to complete then it is not
   gauranteed that the last value saved to database is the last value of valid
   form

   what we need here is to wait for the first request before triggering the
   next request. best option is to use concatMap operator() here
    */
    this.form.valueChanges
      .pipe(filter(() => this.form.valid))
      .subscribe(changes => {
        const saveCourse$ = fromPromise(
          fetch(`/api/courses/${this.course.id}`, {
            method: "PUT",
            body: JSON.stringify(changes),
            headers: {
              "content-type": "application/json"
            }
          })
        );
        saveCourse$.subscribe();
      });
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
