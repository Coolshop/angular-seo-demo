'use strict';

angular.module('AngularSeo')
    .directive('metaTags', ['manifest', 'nav',
        function (manifest, nav) {
            return {
                restrict: 'EA',
                transclude: true,
                scope: {},
                template: '<view-title>{{meta.title}}</view-title><meta view-head name="description" content="{{meta.description}}">',
                link: function(scope){
                    var moduleName = nav.getCurrentModuleName();
                    var m = manifest.getManifest(moduleName);
                    scope.meta = m.meta;
                }
            }
        }
    ]);