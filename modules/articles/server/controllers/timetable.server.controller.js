'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),

  FinalTimetable = mongoose.model('Final'),
  Timetable = mongoose.model('Timetable'),
  User=mongoose.model('User'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create timetable
 */
exports.create = function (req, res) {
	//console.log(req.body);

  var data =req.body.data;
  var t =data.timeSlot.split("-");
  var timetable = new Timetable();
  timetable.title= data.title;
  timetable.classStartTime=t[0];
  timetable.classEndTime=t[1];
  timetable.courseId=data._id;
  timetable.dayOfWeek=req.body.day;
  //console.log(timetable);
  timetable.user = req.user;
  //console.log(req.user);
  User.findOne({
    _id: req.user._id
  }).exec(function (err, user) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }
    else{
      user.totalCredits= user.totalCredits+data.credit
      user.save();
    }
  });

  timetable.save(function (err,data) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      /*var p=data._id;
      delete data._id;

      var final=new FinalTimetable();
      final =data;
      console.log(final);

      final.tid=p;
      final.user=data.user._id;
      console.log("inside FINAL");
      final.save(function(err,result){
        console.log(result);
        console.log(err);
      });*/
      res.json(timetable);
    }
  });
};

/**
 * Show the current timetable
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var timetable = req.timetable ? req.timetable.toJSON() : {};

  // Add a custom field to the timetable, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the timetable model.
  timetable.isCurrentUserOwner = !!(req.user && timetable.user && timetable.user._id.toString() === req.user._id.toString());

  res.json(timetable);
};

/**
 * Update an timetable
 */
exports.update = function (req, res) {
  var timetable = req.timetable;

  timetable.title = req.body.title;
  timetable.content = req.body.content;

  Timetable.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(timetable);
    }
  });
};

/**
 * Delete an timetable
 */
exports.delete = function (req, res) {
  var timetable = req.timetable;
  User.findOne({
    _id: req.user._id
  }).exec(function (err, user) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }
    else{
      user.totalCredits= user.totalCredits-timetable.courseId.credit
      user.save();
    }
  });

  timetable.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(timetable);
    }
  });
};

/**
 * List of Timetable
 */
exports.list = function (req, res) {
	
  Timetable.find({'user':req.user._id}).sort('-created').populate('user', 'displayName  status totalCredits').populate('courseId').exec(function (err, tt) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(tt);
    }
  });
};
exports.listFinal = function (req, res) {
 
  FinalTimetable.find({'user':req.user._id}).sort('-created').populate('user', 'displayName status totalCredits').populate('courseId').exec(function (err, tt) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(tt);
    }
  });
};


/**
 * timetable middleware
 */
exports.timetableByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'timetable is invalid'
    });
  }

  Timetable.findById(id).populate('user', 'displayName status').populate('courseId').exec(function (err, timetable) {
    if (err) {
      return next(err);
    } else if (!timetable) {
      return res.status(404).send({
        message: 'No timetable with that identifier has been found'
      });
    }
    req.timetable = timetable;
    next();
  });
};
