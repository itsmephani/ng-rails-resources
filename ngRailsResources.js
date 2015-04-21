//Resources
var ngRailsResources = angular.module('ngRailsResources', []);
ngRailsResources.config(['$controllerProvider',
  '$compileProvider', '$filterProvider', '$provide',
  function($controllerProvider,
    $compileProvider, $filterProvider, $provide) {

    ngRailsResources.register = {
      controller: $controllerProvider.register,
      directive: $compileProvider.directive,
      filter: $filterProvider.register,
      factory: $provide.factory,
      service: $provide.service
    };
  }
]);
Resources = function(entries){
  var resources = {}, controllers = [], defaultParams, url = "";
  function buildResources(){
   if(typeof entries === "string"){
    resources[entries] = {};
   }else if(Array.isArray(entries)) {
    angular.forEach(entries, function(val){
      resources[val] = {};
    });
   }else{
    resources = angular.copy(entries);
   }   
  }
  buildResources();

  controllers = Object.keys(resources);

  function humanize(str){
    return str[0].toUpperCase() + str.replace(/_([a-z])/g, function(a, b) {
        return " "+b;
    }).slice(1);
  }
  function singularize(str){
    var exceptions = ["mice", "sheep", "knowledge", "jewelery", "information"];
    if(exceptions.indexOf(str.toLowerCase()) > -1) 
      return str;
    var singular = str;
    if (str.substr(str.length - 3) == 'ies') {
      singular = singular.substr(0, singular.length - 3) + 'y';
    } else {
        singular = str.substr(0, str.length - 1);
    }
    return singular;
  }

  function setParentPath (level){
   var i, s = "";
   for(i=0; i < level; i++){
    s = s + controllers[i] + '/:'+ singularize(controllers[i]) + '_id';
    defaultParams[singularize(controllers[i]) + '_id'] = '@'+singularize(controllers[i]) + '_id';
   }
   return s != "" ? (s + "/") : s;
  }

  angular.forEach(controllers, function(value, key){
    ngRailsResources.register.factory( humanize(singularize(value)), ['$resource', function($resource) {
      defaultParams = {id: '@id'};
      //defaultParams[singularize(value)+ '_id'] = '@id';
      url = resources[value].hasOwnProperty('url') ? resources[value]['url'] : "api/"+ setParentPath(key) + value + "/:id";
      defaultParams = resources[value].hasOwnProperty('defaultParams') ? resources[value]['defaultParams'] : defaultParams;
      methods = resources[value].hasOwnProperty('methods') ? resources[value]['methods'] : {};

      return $resource(url, defaultParams, methods);

    }]);

 });
 
}
//
