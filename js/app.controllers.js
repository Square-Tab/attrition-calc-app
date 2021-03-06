// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
(function(window, angular, $) {


  angular.module('SmartCalculatorApp')

    /**
     * Attrition calculator
     *
     * @param Object $scope
     */
    .controller('AttritionCalculatorCtrl', [
        '$scope',
        function ($scope) {
          $scope.rate                   = null;
          $scope.total_retention_month  = 0;
          $scope.total_retention_year   = 0;
          $scope.avg_retention_month    = 0;
          $scope.avg_retention_year     = 0;
          $scope.attritionType          = 'revenue';
          $scope.recentlyEdited         = [];
          $scope.calculated             = false;
          $scope.percent                = 0;
          var tempPercent               = 0;

          $scope.data = { // This is necessary due to child scope of ion-content
            principal:  null,
            loss:       null
          };

          $scope.form = {
            attrition: null
          };

          $scope.selectType = function(type) {
            $scope.attritionType = type;
          };

          $scope.calcRate = function () {
            // if($scope.hasBeenEdited('principal','loss') && $scope.principal !== 0){
              var rate = ($scope.data.loss * 100 / $scope.data.principal).toFixed(2);
              $scope.rate = Math.min(Math.max(rate, 0), 100); // ensure rate is between 0-100
            // }
          };

          $scope.calcLoss = function () {
            // if($scope.hasBeenEdited('principal', 'rate')) {
              var loss = Math.round(($scope.data.principal * $scope.rate) / 100);
              $scope.data.loss = Math.min(Math.max(loss, 0), $scope.data.principal); // ensure the lost amount is not greater than 100%
            // }
          };

          $scope.calcPrincipal = function () {
            // if($scope.hasBeenEdited('rate', 'loss') && $scope.rate !== 0) {
              var principal = Math.round(($scope.data.loss / $scope.rate) * 100);
              $scope.data.principal = isFinite(principal) ? principal : 0;
            // }
          };

          // Add field to recentlyEdited array properly
          $scope.wasEdited = function(field) {
            var index = $scope.recentlyEdited.indexOf(field);
            if(index !== -1)
              $scope.recentlyEdited.splice(index, 1);
            $scope.recentlyEdited.push(field);
          };

          // Determine if the passed in field(s) are dirty
          // accepts multiple arguments
          $scope.hasBeenEdited = function() {
            var hasBeenEdited = true;
            angular.forEach(arguments, function(field, index) {
              if (-1 === $scope.recentlyEdited.indexOf(field))
                hasBeenEdited = false;
            });
            return hasBeenEdited;
          }

          $scope.smartform = function(ev) {
            if ( ev.keyCode == 13 )
              switch ( ev.target.id ) {
                case 'principal':
                  
                  if ( angular.isNumber ( $scope.data.loss ) ) {
                    console.log('try to calculate');
                    $scope.calculate();
                  }
                  else {
                    var lossEl = document.querySelector ( '#loss' );
                    lossEl.focus();
                    lossEl.setSelectionRange && lossEl.setSelectionRange(0, 0);
                  }
                  break;
                case 'loss':

                  if ( angular.isNumber ( $scope.data.principal ) ) {
                    $scope.calculate();
                  }
                  else {
                    var principalEl = document.querySelector ( '#principal' );
                    principalEl.focus();
                    principalEl.setSelectionRange && principalEl.setSelectionRange(0, 0);
                  }
                  break;
              }
          };

          $scope.calculate = function() {
            if ( !$scope.form.AttritionForm.$valid ) {
              $scope.total_retention_month  = 0;
              $scope.total_retention_year   = 0;
              $scope.avg_retention_month    = 0;
              $scope.avg_retention_year     = 0;
              $scope.calculated             = false;
              $scope.percent                = 0;
              return false; // If fields are not filled then do nothing
            }

            $scope.calcRate();
            // $scope.calcLoss();
            // $scope.calcPrincipal();

            // Computations common to all
            $scope.total_retention_month  = (1 / $scope.rate) * 100;
            $scope.total_retention_year   = $scope.total_retention_month / 12;
            $scope.avg_retention_month    = ($scope.total_retention_month + 1) / 2;
            $scope.avg_retention_year     = $scope.avg_retention_month / 12;
            $scope.percent                = $scope.rate.toFixed(1);
            
            // Infinity isn't as nice as 0
            angular.forEach(['total_retention_month','total_retention_year','avg_retention_month','avg_retention_year'], function(variable) {
              if ($scope[variable] === Infinity)
                $scope[variable]  = 0;
            });

            $scope.calculated = true;
          };

          $scope.clear = function() {
            $scope.rate                   = null;
            $scope.total_retention_month  = 0;
            $scope.total_retention_year   = 0;
            $scope.avg_retention_month    = 0;
            $scope.avg_retention_year     = 0;
            $scope.calculated             = false;
            $scope.percent                = 0;

            $scope.data = { // This is necessary due to child scope of ion-content
              principal:  null,
              loss:       null
            };
          };

        }
      ])

  ;

})(window, angular, jQuery);
