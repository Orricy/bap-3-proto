var app=angular.module('factories',[]);

app.factory('db',['$http',function($http){
	return{
		ping : function(){
			return $http.get(serverUrl+'/api/ping');
		},
		deleteAll : function(){
			return $http.post(serverUrl+'/api/delete');
		},
		resetReports : function(){
			return $http.post(serverUrl+'/api/reports/rebase');
		},
		resetBranches : function(){
			return $http.post(serverUrl+'/api/branches/rebase');
		},
		getBranches : function(){
			return $http.get(serverUrl+'/api/branches');
		},
		getUsers : function(){
			return $http.get(serverUrl+'/api/users');
		},
		addBranch : function(input){
			return $http.post(serverUrl+'/api/branches/create',input);
		},
		addUser: function(input){
			return $http.post(serverUrl+'/api/users/create',input);
		},
		addSite : function(input){
			return $http.post(serverUrl+'/api/sites',input);
		},
		getSites : function(){
			return $http.get(serverUrl+'/api/sites');
		},
		updateSite : function(input){
			return $http.post(serverUrl+'/api/sites/edit',input);
		},
		updateBranch : function(input){
			return $http.post(serverUrl+'/api/branches/edit',input);
		},
		updateUser : function(input){
			return $http.post(serverUrl+'/api/users/edition',input);
		},
		deleteSite : function(input){
			return $http.post(serverUrl+'/api/sites/delete',input);
		},
		deleteBranch : function(input){
			return $http.post(serverUrl+'/api/branches/delete',input);
		},
		deleteUser : function(input){
			return $http.post(serverUrl+'/api/users/delete',input);
		},
		resetSites : function(){
			return $http.post(serverurl+'/api/sites/rebase');
		}
	}
}]);

app.factory('locations',function(){
	var l = ['Accueil']
	return l;
});