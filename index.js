const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const uuid = require("uuid");
const fs = require("fs");
const app = express();
const path = require('path');
const pug = require('pug');

app.use(morgan("tiny"));
app.use(bodyParser.json());
app.use(cors());
app.use(express.static(__dirname));
app.use(express.static('public'));
app.set('trust proxy',true);

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.get("/permis", (req, res) => {
    res.sendFile(path.join(__dirname + '/permis.html'));
});

app.get("/utilizatori", (req, res) => {
    res.sendFile(path.join(__dirname + '/utilizatori.html'));
});

app.get("/user-panel", (req, res) => {
    res.sendFile(path.join(__dirname + '/user-panel.html'));
});

app.get("/quiz", (req, res) => {
    res.sendFile(path.join(__dirname + '/quiz.html'));
});

app.get("/permis", (req, res) => {
    res.sendFile(path.join(__dirname + '/permis.html'));
});

app.get("/personal-page", (req, res) => {
    res.sendFile(path.join(__dirname + '/personal.html'));
});

app.get("/personal-page/:id", (req, res) => {
  const personal = readJSONFile('Personal-Detaliat');
  const compiledFunction = pug.compileFile('personal-page.pug');
  var id = req.params.id;
  var colegi = [];

  if (id > personal.length)
    res.status(404).send("No person found with this id!");

  for (let i = 0; i < personal.length; i++)
  {
    if (i != id && personal[i].zona == personal[id].zona)
      colegi.push({'nume': personal[i].nume, 'nr': i});
  }
  res.status(200).send(pug.renderFile('personal-page.pug', {
    nume: personal[id].nume,
    varsta: personal[id].varsta,
    disponibil: personal[id].disponibil,
    telefon: personal[id].nrtel,
    text1: personal[id].descriere1,
    text2: personal[id].descriere2,
    masina: personal[id].masina,
    profil: personal[id].profil,
    colegi: colegi
  }));

});


app.get("/personal", (req, res) => {
  const personal = readJSONFile('Personal');
  if (personal != undefined){
    res.status(200).send(personal);
  } else {
      res.status(404).send("Nu s-a găsit - personal.");
  }
});

app.get("/questions", (req, res) => {
  const questions = readJSONFile('Questions');
  if (questions != undefined){
    res.status(200).send(questions);
  } else {
      res.status(404).send("Nu s-a găsit - questions.");
  }
});

app.get("/users", (req, res) => {
  const users = readJSONFile('Users');
  if(users != undefined){
    res.status(200).send(users);
  } else {
    res.status(404).send("Nu s-a găsit - users");
  }
});

app.get("/users/:username", (req, res) => {
    const users = readJSONFile('Users');

    for (let i = 0; i < users.length; i++)
      if (users[i].username == req.params.username)
      {
        res.status(200).send(users[i]);
        return ;
      }

    res.status(404).send("Nu s-a găsit");
});

app.put("/users", (req, res) => {
  const users = readJSONFile('Users');
  const user = {
      username: req.body.username,
      quizP: req.body.quizP,
      quizF: req.body.quizF,
      lastLogin: req.body.lastLogin,
      lastIp: req.ip
  }

  for (let i = 0; i < users.length; i++)
  {
    if (users[i].username == user.username)
    {
      if (req.body.quizP != undefined)
        if (req.body.quizP != 0)
          users[i].quizP = String(parseInt(users[i].quizP) + req.body.quizP);
        else
          users[i].quizP = String(0);
      if (req.body.quizF != undefined)
        if (req.body.quizF != 0)
          users[i].quizF = String(parseInt(users[i].quizF) + req.body.quizF);
        else
          users[i].quizF = String(0);
      if (req.body.lastLogin != undefined)
      {
        users[i].lastLogin = req.body.lastLogin;
        users[i].lastIp = req.ip;
      }
    }
    writeJSONFile(users, 'Users');
    res.status(200).send();
  }
});

app.post("/users", (req, res) => {
    const users = readJSONFile('Users');
    const user = {
        username: req.body.username,
        password: req.body.password,
        privilege: req.body.privilege,
        quizP: req.body.quizP,
        quizF: req.body.quizF,
        lastLogin: req.body.lastLogin
    }
    for (let i = 0; i < users.length; i++)
      if (users[i].username == user.username)
      {
        res.status(409).send(false);
        return ;
      }

    users.push(user);
    writeJSONFile(users, 'Users');
    res.status(200).send(user);
});

app.delete("/users/:username", (req, res) => {
  const users = readJSONFile('Users');
  const user = {
      username: req.params.username,
  }
  var aux = false;
  for(let i = 0; i < users.length; i++) {
      if(users[i].username === user.username) {
          aux = true;
          users.splice(i, 1);
          break;
      }
  }

  if(aux === true) {
    writeJSONFile(users, 'Users');
    res.status(200).send("User deleted!");
} else {
    res.status(404).send("User not found!");
}

});

function readJSONFile(optiune) {
	if (optiune == 'Personal')
		return JSON.parse(fs.readFileSync("resources/personal.json"))["personal"];
	else if (optiune == 'Questions')
		return JSON.parse(fs.readFileSync("resources/questions.json"))["questions"];
  else if (optiune == 'Users')
    return JSON.parse(fs.readFileSync("resources/users.json"))["users"];
  else if (optiune == 'Personal-Detaliat')
    return JSON.parse(fs.readFileSync("resources/personal-detaliat.json"))["personal"];
}

function writeJSONFile(content, optiune) {
  if (optiune == 'Users')
  {
    fs.writeFileSync(
      "resources/users.json",
      JSON.stringify({ users : content }, null, 4),
      "utf8",
      err => {
        if (err) {
          console.log(err);
        }
      }
    );
  }
}

app.get('*', function(req, res) {
  res.status(404).sendFile(path.join(__dirname + '/err404.html'));
});

app.listen("3000", () =>
  console.log("Server started at: http://localhost:3000")
);
