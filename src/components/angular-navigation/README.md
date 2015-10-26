# Manifest

Manifest service allows developer to maintain `Application Modules` configuration in separate files.

It automatically collects all modules configuration and runs `router` configuration in the Angular application bootstrap process.

## Application module

`Application module` is part of the entire AngularJS Application.

Every module contains logic of a specific application section. 

Every module is accessible with a `route`, it's managed by `controller` and it's displayed by a `view`.

Module configuration is described in a `manifest.json` file, one for each module.

```bash
# Generic module directory structure
.
|─  modules/                        # All modules folder
|   |─  generic_app_module/         # Folder of the single module
|   |   |─  manifest.json           # Module configuration file 
|   |   |─  moduleController.js     # Angular controller file
|   |   |─  partials/               # All views folder
|   |   |   |─  index.html          # Default module view partial file
```

## Service Usage

Follow this steps to add manifest service to an AngularJS application.

* Add package dependency to the `bower.json` file.<br>
  
* Run `bower install` to add package to the project

* Inject `manifestCmp` dependency to the Application main module

* Call `manifestProvider.generateRoutes` method in the Application main module `config` process.

* Run grunt task to create concatenated js file as described below in the `Grunt helper task` section.

```javascript
/*
* bower.json
*/
{
    "dependencies": {
        "manifest-provider" : "git+ssh://gitlab/lib/???#~0.0.1"
    }
}
/*
* app.js
*/
angular.module('appMainModule', ['manifestCmp'])
    .config(['manifestProvider', function(manifestProvider){
        //TODO: implement resolver injection...
        //TODO: implement generateRoutes method and move out from app config....
        manifestProvider.generateRoutes();
    });
```

## Grunt helper task

`Manifest Service` has to iterate configurations files to inject each module settings to the Angular router and run some configurations
steps during Angular bootstrap and main application module config processes. 

Grunt task [grunt-json](https://www.npmjs.com/package/grunt-json) is used to concatenate all manifest.json files in a single `manifests.js`.

This task creates the concatenated file and assigns json data in a global namespace.

```javascript
/*
* Gruntfile.js
*/
module.exports = function (grunt) {
    grunt.initConfig({
        //grunt-json task configuration
        json: {
            manifest: {
                options: {
                    namespace: 'manifests',
                    includePath: true,
                    processName: function (filename) {
                        filename = filename.split("/");
                        return filename[filename.length - 2];
                    }
                },
                src: ['src/modules/**/manifest.json'],
                dest: 'src/resources/manifests.js'
            }
        }
    });
    //Load task
    grunt.loadNpmTasks('grunt-json');
    ....
};
```


## Module Configuration: manifest.json 

`manifest.json` is the configuration file of each application module.

Field           | Type     | Required | Default Value                               | Description
----------------|----------|----------|---------------------------------------------|---------------
name            | String   | Y        | -                                           | Module name. It is used as fallback for url and controller name, when not specified.
url             | String   | N        | name                                        | The url for routing access. $routeProvider configuration.
ctrl            | String   | N        | capitalize(name) + 'Ctrl'                   | The module controller class name
templateUrl     | String   | N        | 'modules/' + name + '/partials/index.html'  | The templateUrl for the view
views           | Object   | N        | {}                                          | Configure second level routing / sub views for the module
params          | Object   | N        | {}                                          | Set route query string mandatory parameters, checked with `navigation` service.
otherwise       | Boolean  | N        | false (`home` module)                       | Set module as default module / routing fallback. 
reloadOnSearch  | Boolean  | N        | true                                        | Set reloadOnSearch property on the router
keepFirstLevel  | Boolean  | N        | false                                       | Create also first level routing for modules with sub views. Always true for module without subviews.

```javascript
/*
* manifest.json
*/
{
  "name": "mymodule",
  "url": "mymodule",
  "ctrl": "MymoduleCtrl",
  "views": {},
  "params" {
    "mandatory-param": {required: true}
  },
  "otherwise": false
}
```

## View Partial

By default modules have a single access route, a controller and a view (partial).

Defining only the module `name` in the `manifest.json` file, `controller` and `templateUrl` are automatically attached.
 
Each module have the `partials/index.html` file as default view.

## Second level sub routing

Modules can need sub routing, different routes can access same module, separating `controller` and `view` from the main one.

`views` object in the `manifest.json` files indicates the second level routing of the module.

Each `views` nodes can define same parameters of the module, using key-value json syntax 

For subviews, HTML partials are retrived by the naming convention: `partials/<subViewName>.html`

```javascript
/*
* manifest.json
*/
{
  ...
  "views": {
    "subView" : {               // This is the key of the node == sub module name, html partial file name. 
        "name": "subView",      // if specified override the key of the json node.
        "url": "subView",       // Same as module configuration. By default it will be: /moduleName/subViewName
        "ctrl": "SubviewCtrl",  // Same as module configuration
        "reloadOnSearch": false // Same as module configuration
    }
  },
  ...
}
```
## Navigation Service

Navigation Service is another service that helps application know module status and validates routes access based on `params` manifest settings.

//TODO: create documentation for navigation service and link it here!!

## Public Methods

### getManifest

This method returns the global `manifests` namespace Object or a single `manifests[ name ]` Object if optional `name` param is passed

`@async`: false
 
`@param`: {String} [name]
 
`@return`: {Object}

### getByUrl

This method returns the manifest Object corresponding to the passed `url` or null if no manifest satisfy the `url`. 

`@async`: false
 
`@param`: {String} url
 
`@return`: {null} || {Object}

### getOtherwise

This method returns the default manifest Object or null if it is not defined. 
By default `otherwise` module is the `home` module, but it can be overridden in the `manifest.json` configuration file.  

`@async`: false
  
`@return`: {null} || {Object}

### generateRoutes

This method runs router configuration, setting `$routeProvider` service with all application modules (routes, controller, views).

If resolvers Object is passed, resolvers are automatically attached to the route.
  
`@async`: false

`@param`: {Object} [resolvers]