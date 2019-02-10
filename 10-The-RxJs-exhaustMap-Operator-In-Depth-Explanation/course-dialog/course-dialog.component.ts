/*What we are going to do in this lecture:
exhaustMap()
ignoring all the clicks made on save buttons while the save is already
going by using the exhaust map operator

Conclusion
The new value from source observable will be ignored as along as the current running inner observable
gets completed
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

  ngAfterViewInit() {
    //using exhaustMap() method to ingore the later clicks done while save on progress
    fromEvent(this.saveButton.nativeElement, "click")
      .pipe(
        exhaustMap(() => {
          console.log("clicked");
          return this.saveCourse(this.form.value);
        })
      )
      .subscribe();
  }

  save() {
    // this.store
    //   .saveCourse(this.course.id, this.form.value)
    //   .subscribe(
    //     () => this.close(),
    //     err => console.log("Error saving course", err)
    //   );
  }

  close() {
    this.dialogRef.close();
  }
}
