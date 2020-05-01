const express = require('express');
const app = express();
app.set('view engine', 'ejs');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

let MyUser;

app.use(express.static('public'));
app.get('/', (req, res) => res.send('Hello World!'));

app.get('/goTomyAccount', function (req, res) {
    res.render('pages/myAccaunt', { myuser: MyUser });
});
app.get('/goTologin', function (req, res) {
    res.render('pages/login', { myuser: MyUser });
});
app.get('/goToblogsingle', function (req, res) {
    res.render('pages/Nutritional-values', { myuser: MyUser });
});
app.get('/goToline', function (req, res) {
    res.render('pages/line', { myuser: MyUser });
});
app.get('/goTopai', function (req, res) {
    res.render('pages/pai', { myuser: MyUser });
});

app.get('/goTotable', function (req, res) {
    res.render('pages/table', { myuser: MyUser });
});







app.get('/addUser', function (req, res) {
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("mydb");
        var myobj = { ObjectId: req.query.id, firstName: req.query.name, gender: req.query.gender, dateOfBirth: req.query.dop, hight: req.query.height, weight: req.query.weight, id: req.query.id, mail: req.query.email, maritalStatus: req.query.marital }
        dbo.collection("users").insertOne(myobj, function (err, res)  {
            if (err) throw err;

            console.log("1 inserted!");
            db.close();
        });
        res.redirect('/');
    });
});

app.get('/findUser', function (req, res) {
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("mydb");
        //console.log('hi');
        //console.log(req.query);

        var query = { id: req.query.id };
        dbo.collection("users").find(query).toArray(function (err, result) {
            if (err) throw err;
            //console.log(result);
            if (result.length) {
                //console.log("user found:");
                console.log(result);

                //console.log(result[0]);
                //console.log(result[0].Id);

            }
            else {
                console.log("user not  found");
                
            }
            db.close();
            MyUser = result[0];

        });

    });
    res.render('pages/index', { myuser: MyUser });
});


app.get('/Update', function (req, res, next) {
    var myobj = {  firstName: req.query.name, gender: req.query.gender, dateOfBirth: req.query.dop, hight: req.query.height, weight: req.query.weight, id: req.query.id, mail: req.query.email, maritalStatus: req.query.marital  };
    MongoClient.connect(url, function (err, db) {
        // assert.equal(null, err);
        if (err) throw err;
        var dbo = db.db("mydb");
        dbo.collection("users").update({ "userId": MyUser.userId }, { $set: myobj });

        var query = { "userId": MyUser.userId };
        dbo.collection("users").find(query).toArray(function (err, result) {
            if (err) throw err;
            MyUser = result[0];
            res.render('pages/myAccaunt', {
                myuser: MyUser

            });

            db.close();
        });
        ;
    });

});







app.get('/addFood', function (req, res) {
    console.log(req.query);
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("mydb");
        var myobj = { name: req.query.name, cal: req.query.cal, sugar: req.query.sugar, lipid: req.query.lipid, carbohydrate: req.query.carbohydrates };
        dbo.collection("food").insertOne(myobj, function (err, res) {
            if (err) throw err;
             
            console.log("1 inserted!");
            db.close();
        });
        res.redirect('/');
    });
});








function getJson(str) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            //הפיכת הטקסט למערך בזכרון
            var result = JSON.parse(this.responseText);
            var foods = result["list"]["item"];
            var el = document.getElementById('fld_base_profile_id');

            for (var i = 0; i < foods.length; i++) {
                var dish = foods[i],
                    opt = document.createElement("option");

                opt.id = dish.ndbno;
                opt.text = dish.name;
                opt.value = dish.id;

                el.appendChild(opt);
            }
        }
    };
    xmlhttp.open("GET", "https://api.nal.usda.gov/ndb/search/?format=json&q=" + str + "&sort=n&max=25&offset=0&api_key=DEMO_KEY", true);
    xmlhttp.send();
}





app.listen(3000, function () { console.log('Example app listening on port 3000!') });