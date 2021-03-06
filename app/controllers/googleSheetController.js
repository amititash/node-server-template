var controller = require('./controller');

var REQUEST = require('request');

var GoogleSpreadsheet = require('google-spreadsheet');
var async = require('async');

var jsonfile = require('jsonfile');


// Type 2: Persistent datastore with manual loading
var Datastore = require('nedb');
 

//exports.db = db;

/**
 * 
 * conncet to the sheer from backend
 */
function fetchJSON(req, res, next) {

  /**
   * 
   * initialising db based on month
   */

  var startMonth = req.params.stm;
  var dbPathName = './db/'+startMonth;

    var db = new Datastore({
        filename: dbPathName,
        autoload: true
    });
    db.loadDatabase(function(err) { // Callback is optional
        // Now commands will be executed
        console.log("db loaded with path ", dbPathName);
    });


    console.log("entering async");

    // spreadsheet key is the long id in the sheets URL 
    var doc = new GoogleSpreadsheet('1MCSVx9lrlTsTRs3dKkKPGLwLyLf75HkaJIWg77igzGY');
    var sheet;

    async.series([
        function setAuth(step) {
            // see notes below for authentication instructions!
            //var creds = require('./google-generated-creds.json');
            // OR, if you cannot save the file locally (like on heroku)
            var creds = {
                client_email: 'igneous-sweep-146102@appspot.gserviceaccount.com',
                private_key: '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDkQmpRtMKVdmhG\nE65u0F6DNt7IsFY8v1j+70Irne7as3pGLGgudtkYIfC4IttfeebWspKQjEqoWpTK\nL0NJtIXWqzRoLHTPpllkQ0wAynyIrMyimjE91tSCuGiAhBjQYIjOacCkQYdUqzAX\n/oeMmfYJkQUv3xiCxf/5SFwz4ahnEVIdH8hrxEgJCwOB8XALkGkbUKb/+y/GWE0q\nBKA9q/hOGWNqP4HK+wlhr9uAhfnsr05MgkD7hN7Y0KQaFJwq3Bcfug6MJ+07w8Hl\nO+zN9WxMicVKw27GDkfdl9l0FMC8jQq/g0nWZ2/3ftonC3cPYIB8wSNiE6/So3XA\n2hhep6MHAgMBAAECggEAXbby5cbcGPc7SoIsHK0KEL9HaogTb+9zv39F4JiAB2Sm\nsAbtYx5CdYkBxufwv1tSLhW03QnsYQCHlBchfjJSvNcftiGCd/qpOuPyYWTBCnA/\nuAasbuIz79N8fD8/3NW1dWGvyQBqapW6Mi+7QTu46yaSRZxH+PEH7jYKPPbJ6D5K\nlr2EjO68WEFakafO9kJDj9DuNwJBw2Cw7hcZGx7cKqqpGIkW3wXEeFuFy4TFLzf8\ndeM04ZWDiOhU63gtIX+/ewbCfWxGzn4myK6aO1Tkt1aa05+DUP3sZTMPBaQBFeKH\nnnsGWEx01eLbozSOeIOb4EslXjnZOLE++f6Zd/LX2QKBgQD8OGKYM8Hz6Tuknk4n\ndCjCI7/267fiGz7o7ccsO+an0voxNcz6n6GB4RiacZoMiYFllQcba4p5tSigvhoN\nOXCbqJqMOrwWvuwiTXCVhBFKyr1/ILK1DNQTf2qSvP7VsJqV6V712xnzfjLxb+VL\nBwovof+aKE2ShDfesJRNdVmoNQKBgQDnrhtvC++04mEfBRr5++lLjahIaZUNUULj\nyRRK6avmKeZ74aIwx2MMYv3380vcwbE6UlkDBKXLD7wW/6RagOo7OiwoeSU9akB3\nxJL/lj3oLAOu+w1bpr0nsZfwO8VpQRjtX1mvhlOrUZixj4oYAR/mbdO9ciTOOm0n\nUP4bmyRdywKBgHDpYSIYEZz67ct9XymEc/atgHOvBOwBHIG0aPThgBnjdkPvfOs5\n6Vi2h4gkkT1JlZb/R2Y8F4ry0dRcJleDPmlA6qcaaDeakyWsG1mj/QXJi1nNLpOk\nwZBU+0XjvAW4AQxZpDxWMODzvySc3j5fUW0PjdjacBfGfyh/TnT6sv99AoGBAL31\ndIr1Z4KRhv5vKjJECYIoUQ2mfE7iDQ1FprzRoV9jhZaXZ2vFYAIc/I2bz9zed5kR\nQeiGnAXGDftxemm2f9c2GFTLF+ymPNu2sqybnIDL7e0/7TDzou5z39daur9VX8Hp\nR1jys5GpoqAbyCdsbKJ79HvFpkXtg+gTsXYjG4tHAoGAdOQyNJD/++TlcDOUtedD\nLJLRg4tkda/VAJeKni5sFZgCEMZJqTIacrEYPwQmlNus1QT5HDssq1ZkY+9Y7Lhy\nis9Pm76Vo1j07bi4GXjIFpSYPBhiTahplao8Ncve7uf4ZgGJVfgW2NIPutCxfP5o\nU4mi/VHCbWw/YeMlhXNV+0I=\n-----END PRIVATE KEY-----\n'
            }

            doc.useServiceAccountAuth(creds, step);
        },
        function getInfoAndWorksheets(step) {
            doc.getInfo(function(err, info) {
                console.log('Loaded doc: ' + info.title + ' by ' + info.author.email);
                sheetMain = info.worksheets[0];

                step();
            });
        },
        
        function workingWithRows(step) {
            // google provides some query options

            sheetMain.getRows({
                offset: 1,
                limit: 1000
            }, function(err, rows) {

                //finding exactly which row to start from 
                var month = 0;
                var startRowNum = 0;
                for (var i=0;i<rows.length;) 
                {

                  month = rows[i].datevaleur.split("/")[1];
                  //console.log("month is ", month);

                  //lets get the date object.
                 



                  if(month === startMonth)
                  {
                    startRowNum = i;
                    //break;
                  }

                  i++;

                }


                //console.log('starRowNum ' + startRowNum + ' rows');

                //var startMonth = rows[0].datevaleur.split("/")[1];
                console.log("starting month is ",startMonth);

                var count = 0;
                var lastMonth = 0;
                var dictPositives = [];
                var dictNegatives = [];

                //rows.forEach(function(row){
                for (var i=startRowNum;i<rows.length;) {

                    var currMonth = rows[i].datevaleur.split("/")[1];
                    var day = rows[i].datevaleur.split("/")[0];
                    var year = rows[i].datevaleur.split("/")[2];

                    

                    console.log("******* ", currMonth,day, year);
                 

                    if (currMonth > lastMonth && (lastMonth != 0 || lastMonth == 12)) 
                    {
                        count++;
                        //console.log("**********************************************", row[i].datevaleur);

                    }


                    var montant = rows[i].montant;
                    var label = rows[i].libelle;
                    var labelArr = label.split(/[0-9]+/);

                    var finalArr = labelArr.filter(function(entry) { return entry.trim() != ''; });

                    var paymentLabel = finalArr[0];
                    var sourceLabel = finalArr[1];
                    

                    var doc = {};

                    if (montant > 0) {
                        doc = {
                            month: currMonth,
                            date: day,
                            label: rows[i].libelle,
                            paymentlabel: paymentLabel,
                            sourcelabel: sourceLabel,
                            amount: rows[i].montant,
                            value: 1
                        };

                        console.log(doc);
                        dictPositives.push(doc);
                    } else {
                        doc = {
                            month: currMonth,
                            date: day,
                            label: rows[i].libelle,
                            paymentlabel: paymentLabel,
                            sourcelabel: sourceLabel,
                            amount: rows[i].montant,
                            value: -1
                        };

                        dictNegatives.push(doc);
                    }
                    //console.log(row.montant);

                    lastMonth = rows[i].datevaleur.split("/")[1];

                    if (count == 4) {



                        db.insert(dictPositives, function(err, posDoc) {
                            // Callback is optional
                            console.log(posDoc);
                            db.insert(dictNegatives, function(err, newDoc) {
                                // Callback is optional
                                console.log("inserted document");

                            });

                        });
                        //count++;
                        break;

                    }

                    i++;

                };


            }); //sheet loop ends here


        }

    ]);

    res.json({status: "db created"});

}

/**
  Return a list of routes supported by this controller.  
  Map path to function (action)
*/
module.exports.routes = function routes() {
    return [{
        method: 'get',
        path: '/googlesheet/:stm',
        action: fetchJSON,
        role: 'guest'
    }]
}