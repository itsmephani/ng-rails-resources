//Resources
var railsResources = angular.module('railsResources', []);
Resources = function(entries){
 var resources = {}, controllers = [], defaultParams, url = "" ,appRoot = "", index;
 index = window.location.href.indexOf('#/') > -1 ? window.location.href.indexOf('#/') : window.location.href.length;
 appRoot = window.location.href.substring(0, index);
 appRoot[appRoot.length - 1] == '/' ? angular.noop : appRoot = appRoot + '/';
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
 
 function camelize(str){
    if(!str) 
      return '';
    return str[0].toUpperCase() + str.replace(/_([a-z])/g, function(a, b) {
        return b.toUpperCase();
    }).slice(1);
  }
  function singularize(str){
    var exceptions = ["mice", "sheep", "knowledge", "jewelery", "information"];
    if(exceptions.indexOf(str.toLowerCase()) > -1 || str[str.length-1] == 'a') 
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
   railsResources.factory( camelize(singularize(value)), ['$resource', function($resource) {
     defaultParams = {id: '@id'};
     //defaultParams[singularize(value)+ '_id'] = '@id';
     url = resources[value].hasOwnProperty('url') ? resources[value]['url'] : appRoot + setParentPath(key) + value + "/:id";
     defaultParams = resources[value].hasOwnProperty('defaultParams') ? resources[value]['defaultParams'] : defaultParams;
     methods = resources[value].hasOwnProperty('methods') ? resources[value]['methods'] : {};
     
     return $resource(url, defaultParams,methods);

   }]);

 });
 
}
// 
