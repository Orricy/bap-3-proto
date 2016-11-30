<!DOCTYPE html>
<html ng-app="AngularLab"  ng-controller="MainCtrl" ng-cloak>
  <head>
    <title>Prototype</title>
    <link rel="stylesheet" type="text/css" href="css/materialize.min.css">
    <link href="css/material-icons.css" rel="stylesheet">
    <link href="css/angular-ui-tree.min.css" rel="stylesheet">

    <link rel="stylesheet" type="text/css" href="css/style.css">
    <meta charset="utf-8">
  </head>
	<body>
    <header>
      
    </header>
    <main>
      <div class="ui-view-container">
        <ui-view></ui-view>
      </div>
    </main>
    <footer>
      
    </footer>
    <!--SCRIPTS-->

    <!--Core scripts-->
    <script type="text/javascript" src="js/jquery.min.js"></script>
    <script type="text/javascript" src="js/materialize.min.js"></script>
    <script type="text/javascript" src="js/angular-153.min.js"></script>

    <!--Angular Plugins-->
    <script type="text/javascript" src="js/angular-animate-153.min.js"></script>
    <script type="text/javascript" src="js/angular-ui-router.min.js"></script>
    <script type="text/javascript" src="js/angular-materialize.min.js"></script>
    <script type="text/javascript" src="js/uiBreadcrumbs.min.js"></script>
    <script type="text/javascript" src="js/angular-ui-tree.min.js"></script>
    <script type="text/javascript" src="js/angular-local-storage.min.js"></script>
    <script type="text/javascript" src="js/vfs_fonts.min.js"></script>

    <!--App scripts-->
    <script type="text/javascript" src="js/factories.js"></script>
    <script type="text/javascript" src="js/angularlab.js"></script>
    <!--Materialize init scripts-->
    <script>
      $(document).ready(function(){
        $(".button-collapse").sideNav();
        $('.modal-trigger').leanModal();
      });
    </script>
	</body>
</html>