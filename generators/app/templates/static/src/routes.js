import route from 'can-route';
// import 'can-route-pushstate';
import DefineMap from 'can-define/map/';

const RouteMap = DefineMap.extend({
  page: 'string'
});

const routeMap = new RouteMap({
  page: 'home'
});

route.data = routeMap;

route('{page}', {page: 'home'});