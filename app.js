var express = require('express');
var app = express();

app.get('/', function(request, response){
  response.json({message: 'API Home Page'});

});


app.listen(process.env.PORT || 8000, function(request, response){
  console.log('server running');
});
