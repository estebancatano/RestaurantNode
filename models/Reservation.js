var db = require("../config/database");
var ClientService = require('../services/ClientService');
var TableService = require('../services/TableService');

module.exports = {
	createReservation: function (req, res, next){
		var user_restaurant = parseInt(req.body.client);
		var table_restaurant = parseInt(req.body.table_restaurant);
		var date_init = req.body.date_init;
		var date_end = req.body.date_end;
		var amount_people = parseInt(req.body.amount_people);
		var state = req.body.state;

		if (!ClientService.validateClient(user_restaurant)){
    res.status(400)
        .json({
          status: 'Error',
          message: 'Error de validacion con el cliente'
        });
  	}
		if(!TableService.validateTable(table,amount)){
      res.status(400)
        .json({
          status: 'Error',
          message: 'Error de validacion con la mesa'
        });
    }
	  	db.none('insert into reservation(user_restaurant, table_restaurant, date_init, date_end, amount_people, state)' +
	      'values($1, $2, $3, $4, $5, $6)',
	    [user_restaurant, table_restaurant, date_init, date_end, amount_people, state])
	    .then(function () {
	      res.status(200)
	        .json({
	          	status: 'Exitoso',
	          	message: 'Insertado una reservación'
	        });
	    })
	    .catch(function (err) {
	      return next(err);
	    });
	}

};
