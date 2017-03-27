var controller = require('./controller');
var dbcontroller = require('./googleSheetController');

var REQUEST = require('request');

var Datastore = require('nedb');


/**
 * 
 * conncet to the sheer from backend
 */
function findSalary(req, res, next)
{

  var thisDB = loadDB(req.params.stm);

        // Finding all planets in the solar system
    thisDB.find({ value: 1 }, function (err, docs) 
    {
        // docs is an array containing documents Mars, Earth, Jupiter
        // If no document is found, docs is equal to []
        docs.forEach(function(doc){

            var amt = doc.amount;
            var count = 0;

            thisDB.count({ value: 1, amount: amt }, function (err, count) 
             {
                
                console.log(count);
                if(count === 3)
                {
                     thisDB.find({ value: 1, amount: amt }, function (err, docs) 
                      {

                            thisDB.update({ value: 1, amount: amt }, { $set: { "category": "salary", } }, { multi: true }, function (err, numReplaced) 
                            {
                                console.log("****SALARY SEARCH********");
                                console.log(err, numReplaced);

                            });
                           

                      })
                }

             });


        })
    });

res.end();

}


/**
 * 
 * conncet to the sheer from backend
 */
function findBTran(req, res, next)
{

  var thisDB = loadDB(req.params.stm);

        // Finding all planets in the solar system
   thisDB.find({ value: -1 }, function (err, docs) 
    {
        // docs is an array containing documents Mars, Earth, Jupiter
        // If no document is found, docs is equal to []
        docs.forEach(function(doc){

            var amt = doc.amount;
            var count = 0;

           thisDB.count({ value: -1, amount: amt }, function (err, count) 
             {
                
               // console.log(count);
                if(count === 3)
                {
                    thisDB.find({ value: -1, amount: amt }, function (err, docs) 
                      {

                           
                           thisDB.update({ value: -1, amount: amt }, { $set: { "category": "B_trans", } }, { multi: true }, function (err, numReplaced) 
                            {
                                console.log("******BTRAN********");
                                console.log(err, numReplaced);

                            });
                           

                      })
                }

             });


        })
    });

res.end();

}


/**
 * 
 * conncet to the sheer from backend
 */
function findCTran(req, res, next)
{

  var thisDB = loadDB(req.params.stm);
        // Finding all planets in the solar system
   thisDB.find({ value: -1 , label: /PRLV SEPA/,$not: { category: 'B_trans' } }, function (err, docs) 
    {

        
        // docs is an array containing documents Mars, Earth, Jupiter
        // If no document is found, docs is equal to []
        docs.forEach(function(doc){

            // for c trans check the label not the amount since tht might vary
            var label = doc.label;
            var count = 0;

           thisDB.count({ value: -1, label: label,$not: { category: 'B_trans' }  }, function (err, count) 
             {
                
                //console.log(count);
                if(count === 3)
                {
                    thisDB.find({ value: -1, label: label,$not: { category: 'B_trans' }  }, function (err, docs) 
                      {

                           
                           thisDB.update({ value: -1, label: label,$not: { category: 'B_trans' }  }, { $set: { "category": "C_trans", } }, { multi: true }, function (err, numReplaced) 
                            {
                                console.log("*******C TRANS*******");
                                console.log(err, numReplaced);

                            });
                           

                      })
                }

             });


        })
    });

res.end();

}

/**
 * 
 * conncet to the sheer from backend
 */
function findSTran(req, res, next)
{

  var thisDB = loadDB(req.params.stm);
        // Finding all planets in the solar system
   thisDB.find({ value: -1 , label: /VIR/, $not:{label: /VIR SEPA/}}, function (err, docs)
    {

       
        // docs is an array containing documents Mars, Earth, Jupiter
        // If no document is found, docs is equal to []
        docs.forEach(function(doc){

            
            var amt = doc.amount;
            var count = 0;

           thisDB.count({ value: -1, amount: amt, label: /VIR/, $not:{label: /VIR SEPA/} }, function (err, count) 
             {
                
                //console.log(count);
                if(count === 3)
                {
                    thisDB.find({ value: -1, amount: amt }, function (err, docs) 
                      {

                            
                           thisDB.update({ value: -1, amount: amt, label: /VIR/, $not:{label: /VIR SEPA/} }, { $set: { "category": "S_trans", } }, { multi: true }, function (err, numReplaced) 
                            {
                                console.log("******S TRANS********");
                                console.log(err, numReplaced);

                            });
                           

                      })
                }

             });


        })
    });

res.end();

}


/**
 * 
 * conncet to the sheer from backend
 */
function findHTran(req, res, next)
{

    var thisDB = loadDB(req.params.stm);
  
        // Finding all planets in the solar system
   thisDB.find({ value: -1 , label: /VIR SEPA/ }).sort({"amount" : -1}).exec(function (err, docs) 
    {

        // docs is an array containing documents Mars, Earth, Jupiter
        // If no document is found, docs is equal to []
        docs.forEach(function(doc){

            
            var amt = doc.amount;
            var count = 0;

           thisDB.count({ value: -1, amount: amt }, function (err, count) 
             {
                
                //console.log(count);
                if(count === 3)
                {
                    thisDB.find({ value: -1, amount: amt }, function (err, docs) 
                      {

                            
                           thisDB.update({ value: -1, amount: amt }, { $set: { "category": "H_trans", } }, { multi: true }, function (err, numReplaced) 
                            {
                                console.log("******H TRANS********");
                                console.log(err, numReplaced);

                            });
                           

                      })
                }

             });


        })
    });

res.end();

}

/**
 * 
 * conncet to the sheer from backend
 */
function findRTran(req, res, next)
{

  var thisDB = loadDB(req.params.stm);
        // Finding all planets in the solar system
   
   thisDB.update({ value: -1, category: { $exists: false } }, { $set: { "category": "R_trans", } }, { multi: true }, function (err, numReplaced) 
    {
        console.log("******R TRANS********");
        console.log(err, numReplaced);

    });


res.end();

}


/**
 * 
 * conncet to the sheer from backend
 */
function listTrans(req, res, next)
{

  var thisDB = loadDB(req.params.stm);
        // Finding all planets in the solar system
   thisDB.find({ }, function (err, docs) 
    {
       
       res.json(docs);

    });


}

/**
 * 
 * conncet to the sheer from backend
 */
function listTransByCat(req, res, next)
{

  var thisDB = loadDB(req.params.stm);
  var transCat = req.params.cat;

        // Finding all planets in the solar system
   thisDB.find({category: transCat }, function (err, docs) 
    {
       
       res.json(docs);

    });


}

function loadDB(dbpath)
{
    
  var dbPathName = './db/'+dbpath;

    var db = new Datastore({
        filename: dbPathName,
        autoload: true
    });
    db.loadDatabase(function(err) { // Callback is optional
        // Now commands will be executed
        console.log("db loaded with path ", dbPathName);
    });

    return db;
}

/**
  Return a list of routes supported by this controller.  
  Map path to function (action)
*/
module.exports.routes = function routes() {
  return [
    {method:'get', path:'/findSalary/:stm', action:findSalary, role:'guest'},
    {method:'get', path:'/findBTran/:stm', action:findBTran, role:'guest'},
    {method:'get', path:'/findCTran/:stm', action:findCTran, role:'guest'},
    {method:'get', path:'/findHTran/:stm', action:findHTran, role:'guest'},
    {method:'get', path:'/findRTran/:stm', action:findRTran, role:'guest'},
     {method:'get', path:'/findSTran/:stm', action:findSTran, role:'guest'},
    {method:'get', path:'/listTrans/:stm', action:listTrans, role:'guest'},
    {method:'get', path:'/listTransByCat/:stm/:cat', action:listTransByCat, role:'guest'}
  ]
}