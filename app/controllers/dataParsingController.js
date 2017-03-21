var controller = require('./controller');
var dbcontroller = require('./googleSheetController');

var REQUEST = require('request');




/**
 * 
 * conncet to the sheer from backend
 */
function findSalary(req, res, next)
{

  
        // Finding all planets in the solar system
    dbcontroller.db.find({ value: 1 }, function (err, docs) 
    {
        // docs is an array containing documents Mars, Earth, Jupiter
        // If no document is found, docs is equal to []
        docs.forEach(function(doc){

            var amt = doc.amount;
            var count = 0;

            dbcontroller.db.count({ value: 1, amount: amt }, function (err, count) 
             {
                
                console.log(count);
                if(count === 3)
                {
                     dbcontroller.db.find({ value: 1, amount: amt }, function (err, docs) 
                      {

                            console.log(docs);
                            dbcontroller.db.update({ value: 1, amount: amt }, { $set: { "category": "salary", } }, { multi: true }, function (err, numReplaced) 
                            {
                                console.log("**************");
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

  
        // Finding all planets in the solar system
    dbcontroller.db.find({ value: -1 }, function (err, docs) 
    {
        // docs is an array containing documents Mars, Earth, Jupiter
        // If no document is found, docs is equal to []
        docs.forEach(function(doc){

            var amt = doc.amount;
            var count = 0;

            dbcontroller.db.count({ value: -1, amount: amt }, function (err, count) 
             {
                
                console.log(count);
                if(count === 3)
                {
                     dbcontroller.db.find({ value: -1, amount: amt }, function (err, docs) 
                      {

                            console.log(docs);
                            dbcontroller.db.update({ value: -1, amount: amt }, { $set: { "category": "B_trans", } }, { multi: true }, function (err, numReplaced) 
                            {
                                console.log("**************");
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

  
        // Finding all planets in the solar system
    dbcontroller.db.find({ value: -1 }, function (err, docs) 
    {
        // docs is an array containing documents Mars, Earth, Jupiter
        // If no document is found, docs is equal to []
        docs.forEach(function(doc){

            var amt = doc.amount;
            var count = 0;

            dbcontroller.db.count({ value: -1, amount: amt }, function (err, count) 
             {
                
                console.log(count);
                if(count === 3)
                {
                     dbcontroller.db.find({ value: -1, amount: amt }, function (err, docs) 
                      {

                            console.log(docs);
                            dbcontroller.db.update({ value: -1, amount: amt }, { $set: { "category": "B_trans", } }, { multi: true }, function (err, numReplaced) 
                            {
                                console.log("**************");
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

  
        // Finding all planets in the solar system
    dbcontroller.db.find({ value: -1 , label: /PRLV SEPA/,$not: { category: 'B_trans' } }, function (err, docs) 
    {

        console.log("docs ", docs);
        // docs is an array containing documents Mars, Earth, Jupiter
        // If no document is found, docs is equal to []
        docs.forEach(function(doc){

            // for c trans check the label not the amount since tht might vary
            var label = doc.label;
            var count = 0;

            dbcontroller.db.count({ value: -1, label: label,$not: { category: 'B_trans' }  }, function (err, count) 
             {
                
                console.log(count);
                if(count === 3)
                {
                     dbcontroller.db.find({ value: -1, label: label,$not: { category: 'B_trans' }  }, function (err, docs) 
                      {

                            console.log(docs);
                            dbcontroller.db.update({ value: -1, label: label,$not: { category: 'B_trans' }  }, { $set: { "category": "C_trans", } }, { multi: true }, function (err, numReplaced) 
                            {
                                console.log("**************");
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
function listTrans(req, res, next)
{

  
        // Finding all planets in the solar system
    dbcontroller.db.find({ }, function (err, docs) 
    {
       
       res.json(docs);

    });


}

/**
  Return a list of routes supported by this controller.  
  Map path to function (action)
*/
module.exports.routes = function routes() {
  return [
    {method:'get', path:'/findSalary', action:findSalary, role:'guest'},
    {method:'get', path:'/findBTran', action:findBTran, role:'guest'},
    {method:'get', path:'/findCTran', action:findCTran, role:'guest'},
    {method:'get', path:'/listTrans', action:listTrans, role:'guest'}
  ]
}