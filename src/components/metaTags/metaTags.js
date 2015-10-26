'use strict';

angular.module('AngularSeo')
    .directive('metaTags', ['manifest', 'nav', '$rootScope', '$templateCache', '$compile', "$animate", "$http",
        function (manifest, nav, $rootScope, $templateCache, $compile, $animate, $http) {
            return {
                restrict: 'EA',
                transclude: "element",
                scope: {},
                controller: function($scope, $element, $attrs, $transclude){
                    var fieldTemplate = "components/metaTags/metaTags.html";

                    $http.get(fieldTemplate, {cache: $templateCache}).then(function (response) {
                        var field = $compile(response.data)($scope);
                        $animate.enter(field, null, $element, function(){
                            injectMetaTags();
                        });
                    }, function () {
                        console.error("not found");
                    });

                    var injectMetaTags = function(){
                        var moduleName = nav.getCurrentModuleName();
                        var m = manifest.getManifest(moduleName);
                        $scope.metaTitle = (m.meta && m.meta.title) ? m.meta.title : "";
                        $scope.meta = m.meta;
                        //delete $scope.meta.title;
                    };

                    $rootScope.$on("$locationChangeSuccess", function($event, newUrl){
                        injectMetaTags();
                    });
                }
            }
        }
    ]);