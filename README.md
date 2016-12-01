## Fichiers de développement
* Le fichier contenant toutes les fonctionnalités (Routing, Controller, ...) est angularlab.js
* Le serveur se nomme express.js (à priori pas utilisé pour l'instant)
* Les factories pour la génération d'objet

## Routing

##### App Config Router exemple:
```javascript
$stateProvider.state('nameState',{
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
```

### Propriétés
* **nameState**: Le nom que vous donnée à cette route
* **url**: L'url qui s'affichera dans la barre de navigation de votre navigateur
* **template**: Le chemin d'accès vers le fichier que vous souhaiter afficher pour cette route
* **controller**: Le controller à utiliser pour cette route

## Local Storage
On utilise le local storage pour enregistrer les éléments utilisé dans l'application.

##### Enregistrer une valeur:
```javascript
submit(localStorageService, key, val)
```

##### Récupérer une valeur:
```javascript
getItem(localStorageService, key)
```

### Propriétés
* **localStorageService**: Constante à ne pas toucher (vérifier l'appel dans le controller)
* **key**: `String` La clé identifiant l'élément dans le local storage
* **val**: La valeur à enregister (String, Object, Array)