var db = require("../config/database");
module.exports = {
  validateClient: function(client){
    db.any('SELECT * FROM client WHERE client.username = $1', client)
      .then(function(data){
        if(data.length == 0){
          return false;
        }else {return true;}
      }).catch(function (err){
        return false;
      });
  }
};
