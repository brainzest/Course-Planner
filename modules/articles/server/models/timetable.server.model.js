'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Timetable Schema
 */
var TimeTableSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  title: {
    type: String,
    default: '',
    trim: true,
    required: 'Title cannot be blank'
  },
  dayOfWeek: {
    type: String,
    default: '',
    enum:["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
   
  },
  classStartTime:{
  	type:Number,
  },
  classEndTime:{
  	type:Number,
  },
  courseId:{
  	type:Schema.ObjectId,
  	ref:'Course',
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  
});

mongoose.model('Timetable', TimeTableSchema);
