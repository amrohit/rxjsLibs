/*
we have some already present which is going to error out this api
call.
we can simulate the http error, for the moment inroder to
understand the better error, this is going to help some
retry logic we will implement later.
now afer changing the status to 500 you will find the request
getting failed in the network console tab with 500 error code
and when you see the response you will see the json error messsage


 */

import { Request, Response } from "express";
import { COURSES } from "./db-data";

export function getAllCourses(req: Request, res: Response) {
  //this is going to simulate
  /*
    const error = (Math.random() >= 0.5);

    if (error) {
        console.log("ERROR loading courses!");
        res.status(500).json({message: 'random error occurred.'});
    }
    else { */

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
