var express = require('express'); 
var router 	= new express.Router(); 
var util 	= require("util"); 
var fs 		= require("fs"); 
 
router.get('/', function(req, res) { 
  res.render("bom", {title: "BOM View"}); 
}); 
 
module.exports = router;