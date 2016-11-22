var promise = require('bluebird');

var options = {
	promiseLib: promise
};

var pgp = require('pg-promise')(options);
//NUESTRA BD TEST
var connectionString = 'postgres://ervocumi:b-Btk-9bg5tNtMU41eOnbstc8pd_J5No@elmer.db.elephantsql.com:5432/ervocumi';
//BD DE RESTAURANT
//var connectionString = 'postgres://bqnkffou:qkuC7uBLuCmnH8WAXYIXrYHeFrlSVjs5@elmer.db.elephantsql.com:5432/bqnkffou';
//BD del grupo
/*var cn = {
  host: '138.197.15.163',
  port: 5454,
  database: 'restaurant',
  user: 'postgres',
  password: '94cbd72b4e4133f3417a61adf9a418b1'
};*/
var db = pgp(connectionString);
//var db = pgp(cn);
/**
* Obtiene un reporte de todos los menus reservados en un rango de tiempo
*/
function getByDateRangeReservation(req, res) {
  console.log(req.params.date_init, req.params.date_end);
  var date_init = req.params.date_init;
  var date_end = req.params.date_end;
	var restaurant = parseInt(req.params.restaurant);
	validateRestaurant(restaurant, function(restaurant){
			console.log(restaurant);
	}, res);
  if(date_init == 'undefined' || date_init == null){
    res.status(500)
      .json({
        status: 'Error',
        message: 'Debe ingresar correctamente la fecha inicial'
      });
  }
  if(date_end == undefined || date_end == null){
    res.status(500)
      .json({
        status: 'Error',
        message: 'Debe ingresar correctamente la fecha final'
      });
  }
  db.any('SELECT DISTINCT ON (name_dish) id_dish, name_dish, name_restaurant, amount FROM dish INNER JOIN restaurant as res ON' +
	'(res.id_restaurant = dish.restaurant and res.id_restaurant=$1)  INNER JOIN order_restaurant as ord ON (ord.dish = dish.id_dish and ord.type = 1)' +
	'INNER JOIN reservation as rsvt ON (ord.reservation=rsvt.id_reservation) where rsvt.date_init BETWEEN $2 AND $3;',[restaurant, date_init, date_end])
  .then(function(orders){
    res.status(200)
      .json(orders);
  })
  .catch(function (err) {
    res.status(400)
    .json({
      status: 'Error',
      message: 'Error al buscar los menus reservados',
      description: err
    });
  });
}

function validateRestaurant(restaurant, func, res){
  db.one('SELECT * FROM restaurant WHERE restaurant.id_restaurant = $1', restaurant)
  .then(function(restaurant){
    func(restaurant);
  })
  .catch(function(err){
    res.status(400)
    .json({
      status: 'Error',
      message: 'Error al encontrar el restaurant'
    });
  });
}

module.exports = {
  getByDateRangeReservation: getByDateRangeReservation
}
