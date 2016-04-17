(function () {
  'use strict';

  angular
    .module('articles')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addMenuItem('topbar', {
      title: 'Your TimeTable',
      state: 'final',
      roles: ['user']
    });

    // Add the dropdown list item
  
  }
}());
