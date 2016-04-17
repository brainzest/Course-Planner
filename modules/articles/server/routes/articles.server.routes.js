'use strict';

/**
 * Module dependencies
 */
var articlesPolicy = require('../policies/articles.server.policy'),
  articles = require('../controllers/articles.server.controller'),

  course = require('../controllers/course.server.controller'),
  timetable= require('../controllers/timetable.server.controller');

module.exports = function (app) {
  // Articles collection routes
  app.route('/api/articles').all(articlesPolicy.isAllowed)
    .get(articles.list)
    .post(articles.create);

  // Single article routes
  app.route('/api/articles/:articleId').all(articlesPolicy.isAllowed)
    .get(articles.read)
    .put(articles.update)
    .delete(articles.delete);

  app.route('/api/timetable')
    .get(timetable.list)
    .post(timetable.create);

   app.route('/api/timetable/:timetableId').get(timetable.read)
    .put(timetable.update)
    .delete(timetable.delete);

 
  
  app.route('/api/finaltimetable')
    .get(timetable.listFinal)

  app.route('/api/course')
    .get(course.list)
    .post(course.create);
  

  // Finish by binding the article middleware
  app.param('articleId', articles.articleByID);

  app.param('timetableId', timetable.timetableByID);
};
