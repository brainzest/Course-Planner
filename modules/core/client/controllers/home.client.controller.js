var events=[];
(function () {
  'use strict';

  angular
    .module('core')
    .controller('HomeController', HomeController);
HomeController.$inject = ['$scope','$location', '$state','$uibModal','$rootScope', 'Authentication','$http'];
  function HomeController($scope,$location, $state,$uibModal,$rootScope, Authentication,$http) {
    var vm = this;
  $scope.authentication=Authentication;
    var modalScope = $rootScope.$new();
    
    function getCourses(){
    	$http.get('/api/course',{cache:true}).success(function(res){
   			console.log(res);
   			vm.courses=res;
        vm.timetable=getTimeTable();
   		});
    }
    getCourses();
    

    vm.daysOfweek=["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
   	vm.addToTimeTable=addToTimeTable;
   	function addToTimeTable(data,day,courseId){
   		var count=0; 
    
      for(var i=0;i<vm.timetable.length;i++){
         if(vm.timetable[i].courseId._id ==courseId){
                 count++;
                 if(count>=vm.timetable[i].courseId.numberOfClasses){
                   console.log("numberOfClasses limit"+ count);
                   $scope.error=true;
                   $scope.errorText="Can't add more class limit";
                 }
                 if(count ==vm.timetable[i].courseId.numberOfClasses){
                   $scope.showGreen =true;
                   //vm.courses[i]
                 }
               }  
        }
      if($scope.error==false){
        $http.post('/api/timetable',{data: data, day:day,user:Authentication.user.id}).success(function(res){
     			console.log(res);
          $scope.showsuccess= true;
          $scope.error=false;

          getTimeTable();

       $scope.modalInstance.dismiss('cancel');
     		});

      }


   	} 
    $scope.totalCredits=0;
   var start=[], end=[];
   	function getTimeTable(){
   		
   		$http.get('/api/timetable').success(function(res){
   		
   			vm.timetable= res;
        console.log(res);
        if(vm.timetable.length>0){
         $scope.totalCredits=vm.timetable[0].user.totalCredits;

          angular.forEach(vm.timetable, function(tt,idx){
           start[idx]=tt.classStartTime;
              end[idx]=tt.classEndTime;
              var dwn=[0];
              for(var j=0;j<5;j++){
                if(tt.dayOfWeek== vm.daysOfweek[j]){
                  dwn=[j];
                }
              }  
      
                  events[idx]={title:tt.title, start:getTime(start[idx]), end:getTime(end[idx]),dow:dwn,allDay : false};

                        
             console.log(events[idx]);
               });
        var numOfRequiredClasses=0;
       angular.forEach(vm.courses, function(course,index){
          if(course.required==true ){
            numOfRequiredClasses=numOfRequiredClasses+course.numberOfClasses;
          }
          var num_class=0, num_reqd=0;
          angular.forEach(vm.timetable, function(tt,idx){
            if(course.required==true){
                 if(tt.courseId.title!= course.title){ 
                  vm.courses[index].showWarning=true;
                 }
                 else{ 
                  ++num_reqd;

                 }
              }    
            if (tt.courseId.title == course.title) {
                ++num_class;
              console.log(course.title + num_class);
              if(course.numberOfClasses==num_class){
                  vm.courses[index].complete=true;
                  vm.courses[index].showWarning=false;
                  console.log("MATCHED The nuber of class required by class A");
              }
              else{
                  /*if(course.required==true){
                  vm.courses[index].showWarning=true;
                }*/
                 vm.courses[index].complete=false;
                 $scope.showIncomplete=true;

              }
            }
            
                 

          });
          if($scope.totalCredits>=15 && num_reqd==numOfRequiredClasses ){
              $scope.showComplete= true;
            } 
        
        });
       //1200

       //1400
      

    
       
    }
   		});
      
      //vm.courses
     

   	}
    function getTime(start){
   /*   start: '00:00:00+02:00',
        end: '08:00:00+02:00',
        color: 'gray',
        rendering: 'background',
        dow: [1,2,3,4,5]*/
       var c=start/100;
       var h = Math.floor(c);
       var m =Math.floor((c-h)*100);
       //var dt =new Date(2016,4,15,h,m);
        return '00:00:00+'+h+':'+m;
    }
 $scope.generateFinalTimeTable=function(){
     if($scope.showComplete){
       $scope.status="Published";
       var user=Authentication.user;
       user.status="Published";
      $http.put('/api/users',user).success(function (response) {
        
        vm.success = true;
        Authentication.user = response;
        getTimeTable();
      }).error( function (response) {
        vm.error = response.data.message;
      });
       $location.path('final');
     }

      
      
    }

   	$scope.availableSlots=function(timeSlot,day,courseId){
   		var available=true;
   		var t = timeSlot.split("-");
   		console.log(t, day);
    	var startTime = t[0];
    	var endTime =t[1];
      if(vm.timetable){
        if(vm.timetable.length>0){
     		for(var i=0;i<vm.timetable.length;i++){
                  if(day==vm.timetable[i].dayOfWeek){
                     if(vm.timetable[i].courseId._id== courseId){
                       return available=false;
                     }
                  	else if (startTime>=vm.timetable[i].classStartTime && startTime<vm.timetable[i].classEndTime) {

                      	return available = false;
                  	}
                  	else if (startTime<vm.timetable[i].classStartTime && startTime<vm.timetable[i].classEndTime && endTime>vm.timetable[i].classStartTime) {

                      	return available = false;
                  	}

                  	else{
                  		available=true;
                  	}
                  }
                }
                  
                 

                  	  return available;
              
            }
            return available=true;
         }
        
            
   	}
   	 $scope.open = function (course) {
      $scope.course=course;
      $scope.showsuccess=false;
      $scope.error=false;
      $scope.modalInstance = $uibModal
          .open({

             templateUrl: '/modules/core/client/views/modal.html',
             controller: 'HomeController',
             scope: $scope,
            /*
              keyboard: true,
              dialogFade: true,*/
              /*size: 'lg',*/
              backdrop: 'static',
              resolve: {
                  img: function () {
                      console
                          .log('Inside Upload control resolve..');
                      return $scope.course;
                  }
              }
          });
      $scope.modalInstance.opened.then(function() {
          //console.log($scope.changed);
          //console.log()
       });

      $scope.modalInstance.result.then(function (img) {

      }, function () {

      });
   
  };

  
   $scope.ok = function () {
      $scope.modalInstance.close();
    };

    $scope.cancel = function () {
     $scope.modalInstance.dismiss('cancel');

    };
  
  $scope.deleteTimetable= function(tt){
    console.log(tt);
    $http.delete('api/timetable/'+tt._id,{timetable:tt}).success(function(res){
      console.log(res);
      getTimeTable();
    })
  };
  
     var date = new Date();
    var d = date.getDate();
    var m = date.getMonth();
    var y = date.getFullYear();
    
  
    /* event source that contains custom events on the scope */
     
    /* event source that calls a function on every view switch */
    $scope.eventsF = function (start, end, timezone, callback) {
      var s = new Date(start).getTime() / 1000;
      var e = new Date(end).getTime() / 1000;
      var m = new Date(start).getMonth();
     /* var start=[];
      var end=[];
      for(var i=0;i<vm.timetable.length;i++){
        start[i]= vm.timetable[i].classStartTime;
        end[i]=vm.timetable[i].classEndTime;
      }*/
      var events = [{title: 'Feed Me ' + m,start: s ,end: s ,allDay: false}];
      callback(events);
    };

    
    /* alert on eventClick */
    $scope.alertOnEventClick = function( date, jsEvent, view){
        $scope.alertMessage = (date.title + ' was clicked ');
    };
    /* alert on Drop */
     $scope.alertOnDrop = function(event, delta, revertFunc, jsEvent, ui, view){
       $scope.alertMessage = ('Event Droped to make dayDelta ' + delta);
    };
    /* alert on Resize */
    $scope.alertOnResize = function(event, delta, revertFunc, jsEvent, ui, view ){
       $scope.alertMessage = ('Event Resized to make dayDelta ' + delta);
    };
    /* add and removes an event source of choice */
   
    /* Change View */
    $scope.renderCalender = function(calendar) {
      if(uiCalendarConfig.calendars[calendar]){
        uiCalendarConfig.calendars[calendar].fullCalendar('render');
      }
    };
     /* Render Tooltip */
    $scope.eventRender = function( event, element, view ) { 
        element.attr({'tooltip': event.title,
                     'tooltip-append-to-body': true});
        $compile(element)($scope);
    };
    /* config object */
    $scope.uiConfig = {

      calendar:{
        height: 450,
        header:{
          center: 'TimeTable',
        },
        views: {
        settimana: {
             type: 'agenda',
            duration: { days: 5 },
            buttonText: '5 day',
           
            columnFormat: 'dddd', // Format the day to only show like 'Monday'
            hiddenDays: [5,6] ,
          firstHour: 8,
          slotMinutes: "00:30",
          minTime:"8:00",
          maxTime:"18:00",
          
          allDaySlot:false,
          // Hide Sunday and Saturday?
        
        },
        timeFormat: 'HH:mm',
      },
        

        eventRender: $scope.eventRender,
        defaultView: 'settimana',
        dayNames :[ "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
         events:events, 
        eventClick: $scope.alertOnEventClick,
      }
    };

    $scope.changeLang = function() {
      
        $scope.uiConfig.calendar.dayNames = [ "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
       
    };
    /* event sources array*/
  }
}());
