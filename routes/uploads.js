var express   = require('express'); 
var router 	  = new express.Router(); 
var util 	  = require("util"); 
var fs 		  = require("fs"); 
var XmlStream = require('xml-stream');

router.get('/', function(req, res, next) { 
  res.render("uploads", {title: "Upload Eagle File"}); 
}); 

router.post('/', function(req, res, next) { 
    
    if (req.files) { 
        
        //If User Selected No File
        if (req.files.myFile.size === 0) {
            return next(new Error("Please Select a File."));
        }
        //If User Didn't Select a .BRD File
        if(req.files.myFile.extension != 'brd') {
            console.log(req.files.myFile.extension);

            return next(new Error("Please Select a .brd file"));
        }
        
        //If File Exists
        fs.exists(req.files.myFile.path, function(exists) { 
            if(exists) { 
                
                //Extract Components from Eagle File
                var components = [];
                
                var stream = fs.createReadStream(req.files.myFile.path);
                var xml    = new XmlStream(stream);
                
                xml.preserve('elements',true);
                xml.collect('subitem');
                
                //Extract Components from XML File
                xml.on('endElement: element', function(item) {
	
	                var name     = item['$']['name'];
                    var value    = item['$']['value'];    
                    var pair     = {name: name, value: value};
                
                    components.push(pair);
                });
                
                //When finished, save data in session and redirect to bom view
                xml.on('end',function() {
                    
                    //Delete .BRD File
                    fs.unlink(req.files.myFile.path, function(err) {
                        console.log(req.files.myFile.name + ' has been deleted');
                    });

                    //Save Components in a Session
                    req.session.components = components;

                    //Redirect to BOM View
                    res.location('bom');
                    res.redirect('bom');
                    
                });
                  
            } else { 
                res.end("Unknown Error :/ "); 
            } 
        }); 
    } 
});

module.exports = router;