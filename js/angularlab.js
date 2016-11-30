var app = angular.module('AngularLab',['ui.router','ngAnimate','ui.materialize','angularUtils.directives.uiBreadcrumbs','factories','ui.tree','LocalStorageModule']);
var serverPort = 8080;
var serverUrl = 'http://localhost:'+serverPort;

//uglifyjs angularlab.js -o angularlab.min.js

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
		}

		$scope.init();
	}]);

	//Test d'affichage des utilisateurs (voir page /test)
	app.controller('UserCtrl',['$scope','$rootScope','$state','localStorageService',function($scope,$rootScope,$state,localStorageService){

	}]);