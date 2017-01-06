var app = angular.module('AngularLab',['ui.router','ngAnimate','ui.materialize','angularUtils.directives.uiBreadcrumbs','factories','ui.tree','LocalStorageModule','ui.calendar']);
var serverPort = 8080;
var serverUrl = 'http://localhost:'+serverPort;

//uglifyjs angularlab.js -o angularlab.min.js

//GESTION DE LA DATE (PERIODE)

Date.prototype.getYearDay = function() { //1 - 366
	var year  = this.getFullYear();
	var month = this.getMonth();
	var day   = this.getDate();

	var offset = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];

	//l'année bissextile n'est utile qu'à partir de mars
	var bissextile = (month < 2) ? 0 : (year % 400 == 0 || (year % 4 == 0 && year % 100 != 0));

	return parseInt(day + offset[month] + bissextile);
}
Date.prototype.getMonday = function() {
	var offset = (this.getDay() + 6) % 7;
	return new Date(this.getFullYear(), this.getMonth(), this.getDate()-offset);
}
Date.prototype.getWeek = function() { //1 - 53
	var year = this.getFullYear();
	var week;

	//dernier lundi de l'année
	var lastMonday = new Date(year, 11, 31).getMonday();

	//la date est dans la dernière semaine de l'année
	//mais cette semaine fait partie de l'année suivante
	if(this >= lastMonday && lastMonday.getDate() > 28) {
		week = 1;
	}
	else {
		//premier lundi de l'année
		var firstMonday = new Date(year, 0, 1).getMonday();

		//correction si nécessaire (le lundi se situe l'année précédente)
		if(firstMonday.getFullYear() < year) firstMonday = new Date(year, 0, 8).getMonday();

		//nombre de jours écoulés depuis le premier lundi
		var days = this.getYearDay() - firstMonday.getYearDay();

		//window.alert(days);

		//si le nombre de jours est négatif on va chercher
		//la dernière semaine de l'année précédente (52 ou 53)
		if(days < 0) {
			week = new Date(year, this.getMonth(), this.getDate()+days).getWeek();
		}
		else {
			//numéro de la semaine
			week = 1 + parseInt(days / 7);

			//on ajoute une semaine si la première semaine
			//de l'année ne fait pas partie de l'année précédente
			week += (new Date(year-1, 11, 31).getMonday().getDate() > 28);
		}
	}

	return parseInt(week);
}

//Configuration des états de l'application
app.config(['$stateProvider','$urlRouterProvider',function($stateProvider,$urlRouterProvider){
	$stateProvider.state('home',{
		url:'/home',
		templateUrl:'templates/home.html',
		params:{
			name: 'home'
		},
		controller:'HomeCtrl',
		data: {
			displayName: 'Accueil',
		},
		module:'public'
	});

	$stateProvider.state('calendar',{
		url:'/calendar',
		templateUrl:'templates/calendarentreprise.html',
		params:{
			name: 'calendar'
		},
		controller:'CalendarCtrl',
		data: {
			displayName: 'Calendrier',
		},
		module:'public'
	});
	$urlRouterProvider.otherwise('home');
}]);
app.config(function (localStorageServiceProvider) {
	localStorageServiceProvider
	.setPrefix('bap_3_proto')
	.setNotify(true, true)
});

app.directive('vSpace',function(){
	return{
		template:'<div class="row"><p class="flow-text"></p></div>',
		restrict: 'E'
	}
});
//focus directive
app.directive('myFocus', function () {
	return {
		restrict: 'A',
		link: function (scope, element, attr) {
			scope.$watch(attr.myFocus, function (n, o) {
				if (n != 0 && n) {
					element[0].focus();
				}
			});
		}
	};
});
//blur directive
app.directive('myBlur', function () {
	return {
		restrict: 'A',
		link: function (scope, element, attr) {
			element.bind('blur', function () {
				//apply scope (attributes)
				scope.$apply(attr.myBlur);
				//return scope value for focusing to false
				scope.$eval(attr.myFocus + '=false');
			});
		}
	};
});

app.filter('inArray', function($filter){
    return function(list, arrayFilter, element){    	
        if(arrayFilter){
            return $filter("filter")(list, function(listItem){
                return arrayFilter.indexOf(listItem[element]) != -1;
            });
        }
    };
});
//Enregistre une clé avec une valeur attribué dans le locale storage /!\ Ne pas modifier localStorageService
function submit(localStorageService, key, val){
	return localStorageService.set(key, val);
}
//Récupère la valeur d'une clé du locale storage /!\ Ne pas modifier localStorageService
function getItem(localStorageService, key){
	return localStorageService.get(key);
}

//TEST - Charge en locale toute les tables nécessaires au stockage des informations
//Ne pas éditer localStorageService
//keys [array] : attribuer le nom des clé que vous désirez utiliser
//values [array] : attribue la valeur des clé que vous désirez utiliser
function checkLocalStorage(localStorageService, keys, values){
	for (var i = 0; i < keys.length; i++){
		//Vérification si la clé existe et si elle n'est pas vide
		if(getItem(localStorageService,keys[i]) !== null) console.log('no table to add');
		else{
			//console.log('load table ' + keys[i]);
			submit(localStorageService, keys[i], values[i]);
		}
	}
	//Optionnel : affichage des table dans la console
	/*var lsKeys = localStorageService.keys();
	//console.log(lsKeys);*/
}

function loadTable(localStorageService,table){
	//console.log("table mise à jour " + table);
	return getItem(localStorageService,table);
}

app.controller('MainCtrl',['$scope','$rootScope','db','$interval','$state','$stateParams','localStorageService',function($scope,$rootScope,db,$interval,$state,$stateParams,localStorageService){
	console.log('Main');

}]);

app.controller('HomeCtrl',['$state','$scope','$rootScope','localStorageService','$interval',function ($state,$scope,$rootScope,localStorageService,$interval){
	//$scope permet de stocker une variable accessible dans la vue par {{}} pour l'affichage
	$scope.test = "test"; //s'affichera dans la vue comme ça {{test}}
	//Le scope peut contenir tout type de variables, de la function à l'undefined.
	//Le rootScope est une variable accessible dans tous les controller et qui est appelé de la sorte
	$rootScope.test = "test"; //s'affichera dans la vue comme ça {{test}} mais il y aura un conflit avec le scope de ce controller
	//Le $state permet de changer de controller
	//$state.go('leNomDuController');

	//Le localStorageService permet d'enregistrer une variable en local voir fonction submit et getItem

	$scope.init = function(){
		console.log('init');
		console.log(new Date().getWeek());
	}

	$interval(function () {
        console.log('timeout now');
    }, 60000);

	//Geolocalisation
	if(navigator.geolocation) {
    	navigator.geolocation.getCurrentPosition(function(position){
      		$scope.$apply(function(){
        		$scope.position = position;
        		//Envoie dans la console la position
        		console.log(position.coords);
        		var mymap = L.map('myPos').setView([position.coords.latitude, position.coords.longitude], 20);
        		var OpenStreetMap_Mapnik = L.tileLayer(mapToken).addTo(mymap);
        		var marker = L.marker([position.coords.latitude, position.coords.longitude]).addTo(mymap);
        		console.log(marker);
      		});
    	});
  	}

	$scope.init();
}]);

app.controller('CalendarCtrl',['$state','$scope','$rootScope','$compile','uiCalendarConfig',function ($state,$scope,$rootScope,$compile,uiCalendarConfig){
	$scope.boolean = true;

	/* config object */

    var date = new Date();
    var min = date.getMinutes();
    var h = date.getHours();
    var d = date.getDate();
    var m = date.getMonth();
    var y = date.getFullYear();
    
    /* event source that pulls from google.com */

    /* event source that contains custom events on the scope */
    $scope.events = [
      	{title: 'All Day Event',start: new Date(y, m, 1, 13, 20)},
    ];
    /* event source that calls a function on every view switch */

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
    $scope.addRemoveEventSource = function(sources,source) {
      	var canAdd = 0;
      	angular.forEach(sources,function(value, key){
	        if(sources[key] === source){
	          sources.splice(key,1);
	          canAdd = 1;
	        }
      	});
      	if(canAdd === 0){
        	sources.push(source);
      	}
    };
    /* add custom event*/
    $scope.addEvent = function() {
    	var start = new Date($scope.timeBegin);
    	var end = new Date($scope.timeEnd);
    	//Ajouter une variable end qui génére un new Date avec la valeur du champ de fin
    	var date = new Date($scope.date);
    	console.log([date.getFullYear(), date.getMonth(), date.getDay(), start.getHours(), start.getMinutes(), end.getHours(), end.getMinutes()]);
      	$scope.events.push({
	        title: $scope.title,
	        start: new Date(date.getFullYear(), date.getMonth(), date.getDate(), start.getHours(), start.getMinutes(), end.getHours(), end.getMinutes()),
	        //Remplacer la variable start par la variable end
	        end: new Date(date.getFullYear(), date.getMonth(), date.getDate(), end.getHours(), end.getMinutes()),
	        className: [$scope.title]
      	});
    };

    $scope.submit = function(){
    	$scope.events.push({
	        title: $scope.title,
	        start: new Date($scope.date),
	        end: new Date($scope.date)
      	});
    }
    /* remove event */
    $scope.remove = function(index) {
      	$scope.events.splice(index,1);
    };
    /* Change View */
    $scope.changeView = function(view,calendar) {
      	uiCalendarConfig.calendars[calendar].fullCalendar('changeView',view);
    };
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
	        monthNames: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet','Août', 'Spetembre', 'Octobre', 'Novembre', 'Décembre'],
	        monthNamesShort: ['janv', 'févr', 'mars', 'avr', 'mai', 'juin', 'juil', 'août', 'sept', 'oct', 'nov', 'déc'],
	        dayNames: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
	        dayNamesShort: ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'],
	        timeFormat:'HH:mm',
	        selectable: true,
	        unselectAuto: true,
	        header:{
	          	left: 'month agendaWeek agendaDay',
	          	center: 'title',
	          	right: 'today prev,next'
	        },
	        eventClick: $scope.alertOnEventClick,
	        eventDrop: $scope.alertOnDrop,
	        eventResize: $scope.alertOnResize,
	        eventRender: $scope.eventRender,
	        
      	}
    };

    /* event sources array*/
    $scope.eventSources = [$scope.events];

	//calendrier();
}]);