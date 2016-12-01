var app = angular.module('AngularLab',['ui.router','ngAnimate','ui.materialize','angularUtils.directives.uiBreadcrumbs','factories','ui.tree','LocalStorageModule']);
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

	$stateProvider.state('login',{
		url:'/login',
		templateUrl:'templates/login.html',
		params:{
			name: 'login'
		},
		controller:'AuthCtrl',
		data: {
			displayName: 'Connexion',
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

app.controller('ManageCtrl', [
	'$scope',
	'$state',
	'$rootScope',
	'$filter',
	'localStorageService',
	,function($scope,$state,$rootScope,$filter,localStorageService){
	
	}]);

	app.controller('ReportCtrl', ['$q','$scope','$state','$rootScope','reports','sites','branches','users','localStorageService','userRequest',function($q,$scope,$state,$rootScope,reports,sites,branches,users,localStorageService,userRequest){

	}]);

	app.controller('HomeCtrl',['$state','$scope','$rootScope','localStorageService',function ($state,$scope,$rootScope,localStorageService){
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

		$scope.init();
	}]);

	//Test d'affichage des utilisateurs (voir page /test)
	app.controller('UserCtrl',['$scope','$rootScope','$state','localStorageService',function($scope,$rootScope,$state,localStorageService){

	}]);