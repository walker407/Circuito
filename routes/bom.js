var express = require('express'); 
var router 	= new express.Router(); 

router.get('/', function(req, res) { 
   
    res.render("bom", {title: "Bom View", components: req.session.components}); 
    console.log(req.session.components.size);
    console.log(req.session.components);
    console.log(req.session.text);
}); 
 
module.exports = router;