var promise = require('bluebird');

var options = {
  promiseLib: promise
};

var pgp = require('pg-promise')(options);
//NUESTRA TEST
var connectionString = 'postgres://ervocumi:b-Btk-9bg5tNtMU41eOnbstc8pd_J5No@elmer.db.elephantsql.com:5432/ervocumi';
//BD DE RESTAURANT
//var connectionString = 'postgres://bqnkffou:qkuC7uBLuCmnH8WAXYIXrYHeFrlSVjs5@elmer.db.elephantsql.com:5432/bqnkffou';
var db = pgp(connectionString);
/*var cn = {
  host: '138.197.15.163',
  port: 5454,
  database: 'restaurant',
  user: 'postgres',
  password: '94cbd72b4e4133f3417a61adf9a418b1'
};
var db = pgp(cn);*/


function reserveTable(req, res, next) {
  // Formato fecha: AAAA-MM-DD HH:MM
  var client = req.body.client;
  var table = parseInt(req.body.table);
  var date = req.body.date;
  var duration = parseInt(req.body.duration);
  var amount = parseInt(req.body.amount_people);
  if (validateClient(client)){
    res.status(400)
        .json({
          status: 'Error',
          message: 'Error de validacion con el cliente'
        });
  }else{
    if(!validateTable(table,amount)){
      res.status(400)
        .json({
          status: 'Error',
          message: 'Error de validacion con la mesa'
        });
    }else{
      db.none('INSERT INTO reservation(client, table_restaurant, reservation_date, reservation_duration,amount_people)' +
      'VALUES($1, $2, TIMESTAMP $3, $4, $5)',
    [client, table, date, duration,amount])
    .then(function () {
      res.status(200)
        .json({
          status: 'Exitoso',
          message: 'Realizada la reserva'
        });
    })
    .catch(function (err) {
      return next(err);
    });
    }
  
  }
  
  /*
  db.none('INSERT INTO reservation(client, table_restaurant, reservation_date, reservation_duration,amount_people)' +
      'VALUES($1, $2, TIMESTAMP $3, $4, $5)',
    [client, table, date, duration,amount])
    .then(function () {
      res.status(200)
        .json({
          status: 'Exitoso',
          message: 'Realizada la reserva'
        });
    })
    .catch(function (err) {
      return next(err);
    });
  */
};

function getTablesByRestaurant(req, res, next){
  var restaurant = req.params.restaurant;
  db.any('SELECT * FROM table_restaurant as tr WHERE tr.restaurant = $1 AND tr.available = true', restaurant)
    .then(function(data){
      res.status(200)
        .json(data);
    }).catch(function (err){
      return next(err);
    });
}


function validateClient(client){
  db.any('SELECT * FROM client WHERE client.username = $1', client)
    .then(function(data){
      if(data.length==0){
        return false;
      }else {return true;}
    }).catch(function (err){
      return false;
    });
};

function validateTable(table,amount){
  db.any('SELECT * FROM table_restaurant as tr WHERE tr.table_restaurant_id = $1', table)
    .then(function(data){
      if(data.length==0){
        return false;
      }else {
        /*if (data[0].available && data[0].capacity >= amount){
          return true;
        }else{
          return false;
        }*/
        return true;
      }
    }).catch(function (err){
      return false;
    });
}

module.exports={
  reserveTable: reserveTable,
  getTablesByRestaurant: getTablesByRestaurant
};
