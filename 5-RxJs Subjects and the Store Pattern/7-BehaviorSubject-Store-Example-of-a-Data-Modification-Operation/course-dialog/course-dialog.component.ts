import { Store } from "./../common/store.service_defualt";
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
import { fromEvent } from "rxjs";
import {
  concatMap,
  distinctUntilChanged,
  exhaustMap,
  filter,
  mergeMap,
  tap
} from "rxjs/operators";
import { fromPromise } from "rxjs/internal-compatibility";
/*
It's here that we are going to trigger the back saver request.

We're going to do that in response to the user clicking here on the save button.
Let's hear a click handler that is going to trigger a save Mefford here in our course dialog component
What it's going to do is it's going to call the store.

We are going to need the store here.

So let's inject it in our component as usual.

Now that we have here the store we are going to trigger here a modification may fail.

We are going to call these adult store adult save course DS is going to be the new Mefford that we are
The first argument is the course ID that uniquely Evony Fayez which of course we are modifying.

And the second argument are the modified properties of the course that we can obtain from these for

them here that we can see on the screen by calling these dot for Dot value by calling these dot form

dot value.

This is going to return a javascript object that contains all the values that have been modified here

by the user.

These Mefford safe course is then going to return this and observable.

These are observable here returned by the safe course.

Cole is going to provide the same information about the backend saver request.

So DS observable is going to complete successfully if the save request went through without a problem

but it's also going to flow an error in case something goes wrong.

So if the save happens successfully what we want to do is we want to close this dialogue.

And if it never occurs we want to handle that error here locally at the level of the course.

They all of a component in this case we are going out of here a logging message and we are going to

print to the console.

That never occurred saving the course and we are also going to add the error to the console log.
Let's not implement this save course Mefford here in our store.
 */
@Component({
  selector: "course-dialog",
  templateUrl: "./course-dialog.component.html",
  styleUrls: ["./course-dialog.component.css"]
})
export class CourseDialogComponent implements AfterViewInit {
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

  ngAfterViewInit() {}
  save() {
    this.store
      .saveCourse(this.course.id, this.form.value)
      .subscribe(() => this.close(), err => console.log(err));
  }

  close() {
    this.dialogRef.close();
  }
}
