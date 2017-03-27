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
   var totalSalary = 0;


   var finalRes = [];

        // Finding all planets in the solar system
   thisDB.find({ category: "R_trans" }, function (err, docs) 
    {
        // docs is an array containing documents Mars, Earth, Jupiter
        // If no document is found, docs is equal to []

           console.log("r trans search");

            ASYNC.forEachSeries(docs, function(doc, callback) {
                //doThis(row.axn, row.dnq, row.bgq, callback);
                console.log(doc.category);
                totalRTrans = totalRTrans + Math.abs(doc.amount);
                callback();
            }, function(err) {
                // All done
                console.log(err);
                
                    finalRes["r_transactions"] = totalRTrans;

                    //second loop
                   thisDB.find({ category: "S_trans" }, function (err, docs) 
                    {
                        // docs is an array containing documents Mars, Earth, Jupiter
                        // If no document is found, docs is equal to []

                        console.log("here");
                           
                            ASYNC.forEachSeries(docs, function(doc, callback) {
                                //doThis(row.axn, row.dnq, row.bgq, callback);
                                console.log(doc.category);

                                totalSTrans = totalSTrans + Math.abs(doc.amount);
                                callback();
                            }, function(err) {
                                // All done
                                console.log(err);
                                     finalRes["s_transactions"] = totalSTrans;
                                     //third loop
                                   thisDB.find({ category: "B_trans" }, function (err, docs) 
                                    {
                                        // docs is an array containing documents Mars, Earth, Jupiter
                                        // If no document is found, docs is equal to []

                                        console.log("here");

                                            ASYNC.forEachSeries(docs, function(doc, callback) {
                                                //doThis(row.axn, row.dnq, row.bgq, callback);
                                               console.log(doc.category);

                                                totalBTrans = totalBTrans + Math.abs(doc.amount);
                                                callback();
                                            }, function(err) {
                                                // All done
                                                console.log(err);
                                                         finalRes["b_transactions"] = totalBTrans;
                                                        //fourth loop
                                                       thisDB.find({ category: "C_trans" }, function (err, docs) 
                                                        {
                                                            // docs is an array containing documents Mars, Earth, Jupiter
                                                            // If no document is found, docs is equal to []

                                                            console.log("here");

                                                                ASYNC.forEachSeries(docs, function(doc, callback) {
                                                                    //doThis(row.axn, row.dnq, row.bgq, callback);
                                                                   console.log(doc.category);
                                                                    totalCTrans = totalCTrans + Math.abs(doc.amount);
                                                                    callback();
                                                                }, function(err) {
                                                                    // All done
                                                                    console.log(err);
                                                                             finalRes["c_transactions"] = totalCTrans;
                                                                            //third loop
                                                                           thisDB.find({ category: "H_trans" }, function (err, docs) 
                                                                            {
                                                                                // docs is an array containing documents Mars, Earth, Jupiter
                                                                                // If no document is found, docs is equal to []

                                                                                console.log("here");

                                                                                    ASYNC.forEachSeries(docs, function(doc, callback) {
                                                                                        //doThis(row.axn, row.dnq, row.bgq, callback);
                                                                                       console.log(doc.category);

                                                                                        totalHTrans = totalHTrans + Math.abs(doc.amount);
                                                                                        callback();
                                                                                    }, function(err) {
                                                                                        // All done
                                                                                        console.log(err);
                                                                                         finalRes["h_transactions"] = totalHTrans;

                                                                                            thisDB.find({ category: "salary" }, function (err, docs) 
                                                                                                {
                                                                                                    // docs is an array containing documents Mars, Earth, Jupiter
                                                                                                    // If no document is found, docs is equal to []

                                                                                                    console.log("salary compute");

                                                                                                        ASYNC.forEachSeries(docs, function(doc, callback) {
                                                                                                            //doThis(row.axn, row.dnq, row.bgq, callback);
                                                                                                        console.log(doc.category);

                                                                                                            totalSalary = totalSalary + Math.abs(doc.amount);
                                                                                                            callback();
                                                                                                        }, function(err) {
                                                                                                            // All done
                                                                                                            console.log(err);
                                                                                                            finalRes["salary"] = totalSalary;

                                                                                                            var tmp = finalRes["c_transactions"];
                                                                                                            console.log(tmp);

                                                                                                            
                                                                                                            var BCH = finalRes["b_transactions"] + finalRes["c_transactions"] + finalRes["h_transactions"];
                                                                                                            console.log(BCH);

                                                                                                            var spendable = finalRes["salary"] - BCH - finalRes["c_transactions"];
                                                                                                            console.log(spendable);
                                                                                                            
                                                                                                            var weeklySpendable = spendable / 4;
                                                                                                            
                                                                                                            res.json({
                                                                                                                b_transactions: finalRes["b_transactions"], 
                                                                                                                c_transactions: finalRes["c_transactions"],
                                                                                                                h_transactions: finalRes["h_transactions"],
                                                                                                                monthly_spendable: spendable, 
                                                                                                                weekly_spendable: weeklySpendable});
                                                                                                            
                                                                                                        });       
                                                                                                }); //salary loop closed
                                                                                        
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