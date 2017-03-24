var controller = require('./controller');
var dbcontroller = require('./googleSheetController');

var REQUEST = require('request');
var ASYNC   = require('async');

var Datastore = require('nedb');


/**
 * 
 * conncet to the sheer from backend
 */
function addRTran(req, res, next)
{

   var thisDB = loadDB(req.params.stm);

   var totalRTrans = 0;
   var totalSTrans = 0;
   var totalBTrans = 0;
   var totalCTrans = 0;
   var totalHTrans = 0;

   var finalRes = [];

        // Finding all planets in the solar system
   thisDB.find({ category: "R_trans" }, function (err, docs) 
    {
        // docs is an array containing documents Mars, Earth, Jupiter
        // If no document is found, docs is equal to []

           console.log("here");

            ASYNC.forEachSeries(docs, function(doc, callback) {
                //doThis(row.axn, row.dnq, row.bgq, callback);
                console.log(doc);
                totalRTrans = totalRTrans + Math.abs(doc.amount);
                callback();
            }, function(err) {
                // All done
                console.log(err);
                
                    finalRes.push({r_transactions: totalRTrans});

                    //second loop
                   thisDB.find({ category: "S_trans" }, function (err, docs) 
                    {
                        // docs is an array containing documents Mars, Earth, Jupiter
                        // If no document is found, docs is equal to []

                        console.log("here");
                           
                            ASYNC.forEachSeries(docs, function(doc, callback) {
                                //doThis(row.axn, row.dnq, row.bgq, callback);
                                console.log(doc);
                                totalSTrans = totalSTrans + Math.abs(doc.amount);
                                callback();
                            }, function(err) {
                                // All done
                                console.log(err);
                                     finalRes.push({s_transactions: totalSTrans});
                                     //third loop
                                   thisDB.find({ category: "B_trans" }, function (err, docs) 
                                    {
                                        // docs is an array containing documents Mars, Earth, Jupiter
                                        // If no document is found, docs is equal to []

                                        console.log("here");

                                            ASYNC.forEachSeries(docs, function(doc, callback) {
                                                //doThis(row.axn, row.dnq, row.bgq, callback);
                                                console.log(doc);
                                                totalBTrans = totalBTrans + Math.abs(doc.amount);
                                                callback();
                                            }, function(err) {
                                                // All done
                                                console.log(err);
                                                         finalRes.push({b_transactions: totalBTrans});
                                                        //fourth loop
                                                       thisDB.find({ category: "C_trans" }, function (err, docs) 
                                                        {
                                                            // docs is an array containing documents Mars, Earth, Jupiter
                                                            // If no document is found, docs is equal to []

                                                            console.log("here");

                                                                ASYNC.forEachSeries(docs, function(doc, callback) {
                                                                    //doThis(row.axn, row.dnq, row.bgq, callback);
                                                                    console.log(doc);
                                                                    totalCTrans = totalCTrans + Math.abs(doc.amount);
                                                                    callback();
                                                                }, function(err) {
                                                                    // All done
                                                                    console.log(err);
                                                                             finalRes.push({c_transactions: totalCTrans});
                                                                            //third loop
                                                                           thisDB.find({ category: "H_trans" }, function (err, docs) 
                                                                            {
                                                                                // docs is an array containing documents Mars, Earth, Jupiter
                                                                                // If no document is found, docs is equal to []

                                                                                console.log("here");

                                                                                    ASYNC.forEachSeries(docs, function(doc, callback) {
                                                                                        //doThis(row.axn, row.dnq, row.bgq, callback);
                                                                                        console.log(doc);
                                                                                        totalHTrans = totalHTrans + Math.abs(doc.amount);
                                                                                        callback();
                                                                                    }, function(err) {
                                                                                        // All done
                                                                                        console.log(err);
                                                                                         finalRes.push({h_transactions: totalHTrans});
                                                                                        res.json(finalRes);
                                                                                        
                                                                                    });       
                                                                            }); //third loop closed

                                                                    
                                                                    
                                                                });       
                                                        }); //fourth loop closed

                                                
                                                
                                            });       
                                    }); //third loop closed
                                
                            });       
                    }); //second loop closed


            });    //outermost loop  closed
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
    {method:'get', path:'/addRTran/:stm', action:addRTran, role:'guest'}
  ]
}