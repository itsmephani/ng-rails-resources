ng-rails-resources
==================

automating building Rails resources in Angular

1. include ngRailsResources module into app.

2. In app config set add update method to resource provider defaults.
  app.config([ "$resourceProvider", function($resourceProvider) {
   
   	$resourceProvider.defaults.actions['update'] = {
        method: 'PUT',
        params: {
          id: '@id'
        },
        isArray: false
    }

  }]);

3. outside of angular call
   Resources('tests')
   gives Test factory with 
   routes of get, put, query, post 
   as api/tests/:id

4. for nested routes
    Resources(['tests', 'comments'])
    gives Test factory with api/tests/:id 
    and Comment factory with api/tests/:test_id/comments/:id

5. Override behaviour by passing url, defaultParams, extraMethods as methods hash
   Resources({'tests': {'url': 'api/abcd/:abcd_id/tests/:id', 
  'defaultParams': {
       'abcd_id': '@project_id',
       'id': '@id'
    }, 'methods': {
       GetTestById: {
        method: 'GET',
        url: "api/abcd/:abcd_id/tests/:id", //your url
        isArray: true
       }
    } 
	}
	});
6. Inject factory into controller for using it.
