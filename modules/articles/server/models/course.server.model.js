'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Course Schema
 */
var CourseSchema = new Schema({
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
  code:{
     type: String,
    default: '',
  },
  credit: {
    type: Number,
    default: '',
    trim: true
  },
  numberOfClasses:{
    type:Number,
  },
  duration:{
    type:String,
  },
  timeSlot:{
    type:String,
  },
  required:{
    type:Boolean
  }
});

mongoose.model('Course', CourseSchema);
