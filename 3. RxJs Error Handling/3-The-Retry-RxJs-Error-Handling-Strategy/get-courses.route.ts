/*
=>For retry lecture

chaging our error logic a bit
1. instead of failing the request each time
we are going the above code uncomment and will throw random
error using math.random and somtimes correct response
2. as we can see there will be fifty percentage change that
error will be true or false and we are going to get the error
and result , lets apply this logic
now we can switch back to home component
 */

import { Request, Response } from "express";
import { COURSES } from "./db-data";

export function getAllCourses(req: Request, res: Response) {
  //this is going to simulate


    const error = (Math.random() >= 0.5);
  //uncommented below if conditions for testing
    if (error) {
        console.log("ERROR loading courses!");
        res.status(500).json({message: 'random error occurred.'});
    }
    else {

  //we are going to error out using the status code using 500
  //later on we will use above code
  setTimeout(() => {
    // res.status(500).json({ payload: Object.values(COURSES) });
    res.status(500).json({ message: "message error out" });
  }, 200);

  //  }
}

export function getCourseById(req: Request, res: Response) {
  const courseId = req.params["id"];

  const courses: any = Object.values(COURSES);

  const course = courses.find(course => course.id == courseId);

  res.status(200).json(course);
}
