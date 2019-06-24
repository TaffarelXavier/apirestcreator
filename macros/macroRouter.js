const config = require("../config/config");

module.exports = {
  criarMacro(apiName) {
    
    let tableSingular = config.removeLastCharacter(apiName);

    let content = `
      var express = require('express');
      const routes = express.Router();\n
      var controller_${apiName} = require('../controllers/controller${config.jsUcfirst(
      apiName
    )}');
    
    // Retrieve all users 
    routes.get('/api/${apiName}', function (req, res) {
        return controller_${apiName}.findAll${config.jsUcfirst(apiName)}(res);
    });
    
    // Retrieve user with id 
    routes.get('/api/${apiName}/:id', function (req, res) {

        let user_id = req.params.id;
        if (!user_id) {
            return res.status(400).send({ error: true, message: 'Please provide user_id' });
        }
        return controller_${apiName}.find${config.jsUcfirst(tableSingular)}Id(res, user_id);    
    });
    
    // Add a new user  
    routes.post('/api/${apiName}', function (req, res) {
        //let user = req.body.user;
        let user = req.body;
        if (!user) {
            return res.status(400).json({ error: true, message: 'Please provide user' });
        }
    
        return controller_${apiName}.create(res, user);
    });
`;
    return content;
  }
};
