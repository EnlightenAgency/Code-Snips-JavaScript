/**
 * Get's number of Angular Scopes on the page it is run on
 * 
 * @param  {*} _ 	Requires LoDash or Underscore
 * 
 */
var numWatchers = (function (_) {
	'use strict';
	var numWatchers;

	function _calcWatchers() {
		var rootScope = angular.element(document.querySelectorAll("[ng-app]")).scope();
		var scopes = _getScopes(rootScope);
		var watcherLists = scopes.map(function(s) { return s.$$watchers; });
		numWatchers = _.uniq(_.flatten(watcherLists)).length;
	}

	function _getScopes(root) {
		var scopes = [];
		function traverse(scope) {
			scopes.push(scope);
			if (scope.$$nextSibling)
				traverse(scope.$$nextSibling);
			if (scope.$$childHead)
				traverse(scope.$$childHead);
		}
		traverse(root);
		return scopes;
	}

	function getNumWatchers() {
		_calcWatchers();
		return numWatchers;
	}
	
	_calcWatchers();
	console.log(numWatchers);

	return {
		get: getNumWatchers
	};
}(_));