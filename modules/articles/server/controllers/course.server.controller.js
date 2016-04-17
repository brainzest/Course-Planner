'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Course = mongoose.model('Course'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create course
 */
exports.create = function (req, res) {
	console.log(req.body);
/*
  courseId:{
  	type:Schema.ObjectId,
  	ref:'Course',
  },*/
  var data =req.body.data;
  var t =data.timeSlot.split("-");
  var course = new Course();
  course.title= data.title;
  course.classStartTime=t[0];
  course.classEndTime=t[1];
  course.dayOfWeek=req.body.day;
  console.log(course);
  course.user = req.user;

  course.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(course);
    }
  });
};

/**
 * Show the current course
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var course = req.course ? req.course.toJSON() : {};

  // Add a custom field to the course, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the course model.
  course.isCurrentUserOwner = !!(req.user && course.user && course.user._id.toString() === req.user._id.toString());

  res.json(course);
};

/**
 * Update an course
 */
exports.update = function (req, res) {
  var course = req.course;

  course.title = req.body.title;
  course.content = req.body.content;

  Course.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(course);
    }
  });
};

/**
 * Delete an course
 */
exports.delete = function (req, res) {
  var course = req.course;

  Course.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(course);
    }
  });
};

/**
 * List of Articles
 */
exports.list = function (req, res) {
  Course.find().exec(function (err, articles) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(articles);
    }
  });
};


