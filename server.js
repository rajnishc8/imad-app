var express = require('express');
var morgan = require('morgan');
var path = require('path');
var Pool = require('pg').Pool;
var crypto = require('crypto');
var bodyParser = require('body-parser');
var session = require('express-session');

var config = {
  user: 'rajnishc8',
  host: 'db.imad.hasura-app.io',
  //host: 'localhost',
  database: 'rajnishc8',
  password: process.env.DB_PASSWORD,
  //password: 'secretpassword',
  port: 5432
};

var app = express();
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(session({
    secret: 'someRandomSecretValue',
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 30}
}));

var articleOne = {
    title : 'Article One | Rc',
    heading : 'Article One ',
    date : 'Aug 6, 2017',
    content:`
                <p>
                   First article 1
                <p>
                <p>
                   First article 2
                <p>
                <p>
                   First article 3
                <p> `
};

var articles = {
    'article-one' : {
        title : 'Article One | Rc',
        heading : 'Article One ',
        date : 'Aug 6, 2017',
        content:`
                    <p>
                       First article 1-1
                    <p>
                    <p>
                       First article 1-2
                    <p>
                    <p>
                       First article 1-3
                    <p> `
    },
    'article-two' : {
        title : 'Article One | Rc',
        heading : 'Article One ',
        date : 'Aug 16, 2017',
        content:`
                    <p>
                       First article 2-1
                    <p>
                    <p>
                       First article 2-2
                    <p>
                    <p>
                       First article 2-3
                    <p> `
    },
    'article-three' : {
        title : 'Article One | Rc',
        heading : 'Article One ',
        date : 'Aug 26, 2017',
        content:`
                    <p>
                       First article 3-1
                    <p>
                    <p>
                       First article 3-2
                    <p>
                    <p>
                       First article 3-3
                    <p> `
    }
};


function createTemplate (data) {
    var title   = data.title;
    var date    = data.date;
    var heading = data.heading;
    var content = data.content;
        
    var htmlTemplate = `
    <html>
      <head>
         <title>
             ${title}
         </title>
         <meta name="viewport" content="width=device-width, initial-scale=1" />
         <link href="/ui/style.css" rel="stylesheet" />
      </head>
      <body>
          <div class="container">
              <div>
                    <a href="/">Home</a>
              </div>
              <hr/>
              <h3>
                  ${heading}
              </h3>
              <div>
                    ${date.toDateString()}
              </div>
              <div>
                    ${content}
              </div>
          </div>
      </body>
    </html>
    `;
    return htmlTemplate;
}


function hash (input, salt) {
    // How do we create a hash?
    var hashed = crypto.pbkdf2Sync(input, salt, 10000, 512, 'sha512');
    //return hashed.toString('hex');
    return ["pbkdf2", "10000", salt, hashed.toString('hex')].join('$');
}

app.get('/hash/:input', function(req, res) {
   var hashedString = hash(req.params.input, 'Salt No Pepper');
   res.send(hashedString);
});

app.post('/create-user', function (req, res) {
   // username, password
   // {"username": "rajnish", "password": "password"}
   // JSON
   var username = req.body.username;
   var password = req.body.password;
   var salt = crypto.randomBytes(128).toString('hex');
   var dbString = hash(password, salt);
   pool.query('INSERT INTO "user" (username, password) VALUES ($1, $2)', [username, dbString], function (err, result) {
      if (err) {
          console.error('Error executing Insert query', err.stack);
          res.status(500).send(err.toString());
      } else {
          res.send('User successfully created: ' + username);
      }
   });
});

app.post('/login', function (req, res) {
   var username = req.body.username;
   var password = req.body.password;
   
   pool.query('SELECT * FROM "user" WHERE username = $1', [username], function (err, result) {
      if (err) {
          res.status(500).send(err.toString());
      } else {
          if (result.rows.length === 0) {
              res.status(403).send('username/password is invalid');
          } else {
              // Match the password
              var dbString = result.rows[0].password;
              var salt = dbString.split('$')[2];
              var hashedPassword = hash(password, salt); // Creating a hash based on the password submitted and the original salt
              if (hashedPassword === dbString) {
                
                // Set the session
                //req.session.auth = {userId: result.rows[0].id};
                // set cookie with a session id
                // internally, on the server side, it maps the session id to an object
                // { auth: {userId }}
                
                res.send('credentials correct!');
                
              } else {
                res.status(403).send('username/password is invalid');
              }
          }
      }
   });
});


var pool = new Pool(config);
app.get('/test-db', function (req, res) {
    //alert('in end url get');
  //make a select request.
  // return a response with a result
  pool.query('SELECT * from test', function(err, result) {
    
    if (err) {
        console.error('Error executing query', err.stack);
         res.status(500).send(err.toString());
    }
    else
    {
        //res.send(JSON.stringify(result));
        res.send(JSON.stringify(result.rows));
    }
    console.log(result.rows)
  });
  //res.send(counter.toString());
});

var counter=0;
app.get('/counter', function (req, res) {
  counter = counter + 1;
  res.send(counter.toString());
});

var names=[];
app.get('/submit-name', function (req, res) {  //submit-name=xxxx
  //Get the name from the request
  var name = req.query.name;
  
  names.push(name)
  //JSON: 
  res.send(JSON.stringify(names));
});


app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});


app.get('/profile', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'profile.html'));
});

app.get('/indexold', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'indexold.html'));
});


app.get('/articleone', function (req, res) {
  //res.sendFile(path.join(__dirname, 'ui', 'article-one.html'));
  res.send(createTemplate(articleOne));
});

app.get('/articlefour', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'article-four.html'));
});

app.get('/articlefive', function (req, res) {
  res.send('Article Five');
});

app.get('/articles/:articleName', function (req, res) {
  //articleName == article-one
  //articles[articleName] == {} content object for article one
  var articleName = req.params.articleName;
  
  pool.query("SELECT * from article WHERE title = $1", [req.params.articleName],  function(err, result) {
    if (err) {
        console.error('Error executing query', err.stack);
        res.status(500).send(err.toString());
    } else   {
        if(result.rows.length === 0)
        {
            res.status(400).send("Article not found");
        }
        else
        {
           //res.send(JSON.stringify(result));
           //res.send(JSON.stringify(result.rows));
           var articleData =  result.rows[0];
           res.send(JSON.stringify(createTemplate(articleData)));
        }
    }
    console.log(result.rows)
  });
  
});

app.get('/:articleName', function (req, res) {
  //articleName == article-one
  //articles[articleName] == {} content object for article one
  var articleName = req.params.articleName;
  res.send(createTemplate(articles[articleName]));
});

app.get('/article-four', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'article-four.html'));
});

app.get('/article-five', function (req, res) {
  res.send('Article Five');
});

app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

app.get('/ui/main.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'main.js'));
});

app.get('/ui/madi.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'madi.png'));
});

app.get('/ui/AP.jpeg', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'AP.jpeg'));
});


// Do not change port, otherwise your app won't run on IMAD servers
// Use 8080 only for local development if you already have apache running on 80

var port = 80;
app.listen(port, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
