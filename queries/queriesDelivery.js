var promise = require('bluebird');

var options = {
  promiseLib: promise
};

var pgp = require('pg-promise')(options);
//NUESTRA TEST
//var connectionString = 'postgres://ervocumi:b-Btk-9bg5tNtMU41eOnbstc8pd_J5No@elmer.db.elephantsql.com:5432/ervocumi';
//BD DE RESTAURANT
//var connectionString = 'postgres://bqnkffou:qkuC7uBLuCmnH8WAXYIXrYHeFrlSVjs5@elmer.db.elephantsql.com:5432/bqnkffou';
//var db = pgp(connectionString);
var cn = {
  host: '138.197.15.163',
  port: 5454,
  database: 'restaurant',
  user: 'postgres',
  password: '94cbd72b4e4133f3417a61adf9a418b1'
};
var db = pgp(cn);

function confirmationDelivery(req, res, next) {

  var delivery = parseInt(req.params.delivery);
  var client = req.body.client;

  // se revisa que el usuario existe
  var isClient = validateClient(client);

  if (!isClient){
    res.status(400)
        .json({
          status: 'Error',
          message: isClient+ ' Error de validacion con el cliente: '+client
        });
        return false;
  }

  // se revisa que el domicilio pertenezca al cliente
  if (!validateDelivery(client,delivery)){
    res.status(400)
        .json({
          status: 'Error',
          message: 'Error en la validacion del domicilio'
        });
        return false;
  }

  db.none('UPDATE delivery SET delivery_status=true where id_delivery=$1',
    delivery)
    .then(function () {
      res.status(200)
        .json({
          status: 'Exitoso',
          message: 'Comfirmacion Realizada'
        });
    })
    .catch(function (err) {
      return next(err);
    });



};

function qualification(req, res, next){
  var delivery = parseInt(req.params.delivery);
  var client = req.body.client;
  var score = req.body.score;
  var comment = req.body.comment;

  // se revisa que el usuario existe
  if (!validateClient(client)){
    res.status(400)
        .json({
          status: 'Error',
          message: isClient+ ' Error de validacion con el cliente: '+client
        });
        return false;
  }

  // se revisa que el domicilio pertenezca al cliente
  if (!validateDelivery(client,delivery)){
    res.status(400)
        .json({
          status: 'Error',
          message: 'Error en la validacion del domicilio'
        });
        return false;
  }

  if (!(score>=1&&score<=5))  {
      res.status(400)
        .json({
          status: 'Error',
          message: 'Error el score debe estar entre 1 y 5'
        });
        return false;
  }

  db.none('UPDATE delivery SET score=$1, comment=$2 where id_delivery=$3',
    [score,comment,delivery])
    .then(function () {
      res.status(200)
        .json({
          status: 'Exitoso',
          message: 'Calificacion realizada'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}


function validateClient(client){
  return true;
  db.any('SELECT * FROM user_restaurant WHERE user_restaurant.username = $1', client)
    .then(function(data){
      if(data.length==0){
        return false;
      }else {return true;}
    }).catch(function (err){
      return false;
    });
};

function validateDelivery(client,delivery){
  return true;
  db.any('SELECT * FROM delivery d inner join user_restaurant usr on usr.id_user = d.delivery_user WHERE usr.username = $1 and d.id_delivery = $2', [client, delivery] )
    .then(function(data){
      if(data.length==0){
        return false;
      }else {return true;}
    }).catch(function (err){
      return false;
    });
};



module.exports={
  confirmationDelivery: confirmationDelivery,
  qualification: qualification
};
