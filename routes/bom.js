var express = require('express'); 
var router 	= new express.Router(); 

router.get('/', function(req, res) { 
    
    //Get Part Type
    res.render("bom", {title: "Bom View", parts: req.session.parts}); 
}); 



 
module.exports = router;