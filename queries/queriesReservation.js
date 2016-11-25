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

function changeReservationFranchise(req, res, next){
  var id_reservation = parseInt(req.params.reservation);
  var id_franchise = parseInt(req.params.franchise);
  var reservationToChange;
  validateFranchise(id_franchise, function(franchise){
        //console.log(franchise);
  }, res);
  validateReservation(id_reservation, id_franchise, function(reservation){
        reservationToChange = reservation;
        //console.log(reservationToChange);
  }, res);
  
  
  setTimeout(function() {
    
    var date_init = reservationToChange['date_init'];
  	var date_end = reservationToChange['date_end'];
  	var capacity = reservationToChange['amount_people'];
  	var idToChange = reservationToChange['id_reservation'];
  	/*
  	console.log(date_init);
  	console.log(date_end);
  	console.log(capacity);
  	console.log(idToChange); 
  	*/

    db.any('SELECT tr.id_table_restaurant, tr.franchise, tr.capacity FROM table_restaurant AS tr LEFT OUTER JOIN reservation AS r ON (tr.id_table_restaurant = r.table_restaurant AND (r.date_end <= $2 OR r.date_init >= $3)) WHERE tr.available = true AND tr.franchise = $1 AND tr.capacity >= $4',
     [id_franchise, date_init, date_end, capacity])
    .then(function(data){
      console.log(data);
      if (data.length==0){
        res.status(500)
      	.json({
        status: 'Error',
        message: 'No se encontraron mesas disponibles en la franquicia dada, con cantidad de personas y horario seleccionado'
      	});
      }else{
      	//res.status(200)
        //.json(data);
	        db.none('UPDATE reservation SET table_restaurant=$1 WHERE id_reservation =$2', [data[0]['id_table_restaurant'], idToChange])
		    .then(function () {
		      res.status(200)
		        .json({
		          status: 'Exitoso',
		          message: 'Modificación de franquicia en la Reserva realizada'
		        });
		    })
		    .catch(function (err) {
		      return next(err);
		    });
    	}      
    }).catch(function (err){
      return next(err);
    });


  }, 5000);
  
}
