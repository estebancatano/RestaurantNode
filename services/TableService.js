var db = require("../config/database");
module.exports = {
  validateTable: function(table,amount){
  db.any('SELECT * FROM table_restaurant as tr WHERE tr.id_table_restaurant = $1', table)
  	.then(function(data){
  		if(data.length==0){
  			return false;
  		}else {
  			return true;
  		}
  	}).catch(function (err){
  		return false;
  	});
  }
};
