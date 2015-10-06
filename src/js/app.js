(function(){
    'use strict';

    var dep = [
        'ng',
        'ngRoute',
        'ngResource',
        'ngSanitize',
        'angular-navigation',
        'viewhead',
        'templates-modules',
        'templates-components'

    ];

    angular.module('AngularSeo', dep)
        .config(['$locationProvider', 'manifestProvider',
            function ($locationProvider, manifestProvider) {
                manifestProvider.generateRoutes();
                //setup HTML5 history API navigation
                $locationProvider.html5Mode(true);
            }
        ])
        .run(["nav", function (nav) {
            nav.init();
        }]);
})();

