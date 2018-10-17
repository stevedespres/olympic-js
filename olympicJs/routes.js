// Routes des pages
module.exports = function(app) {

    app.get('/', function(req,res){
        res.sendfile('./views/helloworld.html');
    }); 

}