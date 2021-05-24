var file;
var questions = [];
var questions_json;
var questions_total;
var questions_submitted;
var questions_submitted_arr;
var questions_remaining;
var questions_corect;
var questions_wrong;
var question_index;
var answers_selected;
var maxim_wrong;
var delayMs;
var contor;
var timp;
var minute;
var secunde;
var rezultate;

if (!localStorage.getItem('username'))
  window.location.href = 'utilizatori.html';

// Preluam întrebarile
function getQuestions () {
  fetch('/questions').then(function(response) {
      if (response.status !== 200) {
        console.log('Looks like there was a problem. Status Code: ' + response.status);
        return;
      }
        response.json().then(function(data) {
          console.log(data);
          questions_json = data;
    });
  })
}

// Pregatim quiz-ul
function prepare_quiz(optiune) {
    var extrase = [];

    if (optiune == 1) {
        maxim_wrong = 4;
        questions_total = 20;
        delayMs = 1800000;
        minute = 30;
        secunde = 0;
    } else if (optiune == 2) {
        questions_total = 26;
        maxim_wrong = 5;
        delayMs = 1800000;
        minute = 30;
        secunde = 0;
    } else if (optiune == 3) {
        questions_total = 5;
        maxim_wrong = 1;
        delayMs = 10000;
        minute = 0;
        secunde = 10;
    }

    let index = 0;
    while (index < questions_total)
    {
      let val = Math.floor(Math.random() * 50);
      if (!extrase.includes(val)) {
        questions.push(questions_json[val]);
        extrase.push(val);
        index += 1
      }
    }

    contor = setTimeout(function() {
        end_quiz("time")
    }, delayMs);
    timer();
    timp = setInterval(function() {
        timer();
    }, 1000);

    questions_remaining = questions_total;
    questions_submitted_arr = [];
    questions_submitted = 0;
    questions_corect = 0;
    questions_wrong = 0;
    question_index = 1;
    answers_selected = [];

    document.getElementById('inapoi').style.display = "none";
    var butoane = document.getElementById("quiz-prepare");
    butoane.style.display = "none";
    var butoane = document.getElementById("rezultat");
    butoane.style.display = "none";
    var butoane = document.getElementById("quiz");
    butoane.style.display = "block";
    document.getElementById("RQ").innerHTML = questions_remaining;
    document.getElementById("CQ").innerHTML = questions_corect;
    document.getElementById("WQ").innerHTML = questions_wrong;
    load_question();
}

// Timer-ul se schimbă la fiecare secundă
function timer() {
    document.getElementById("RT").innerHTML = "";
    if (minute < 10)
        document.getElementById("RT").innerHTML += "0" + minute;
    else
        document.getElementById("RT").innerHTML += minute;

    document.getElementById("RT").innerHTML += ":";

    if (secunde < 10)
        document.getElementById("RT").innerHTML += "0" + secunde;
    else
        document.getElementById("RT").innerHTML += secunde;

    secunde -= 1;
    if (secunde < 0)
        if (minute != 0) {
            minute -= 1;
            secunde = 59;
        }
}

// Marcăm întrebarea (a fost selectată)
function mark_question(optiune) {
    document.getElementById(optiune).style.color = "white";
    document.getElementById(optiune).style.backgroundColor = "#40476d";

    if (optiune == "buton1")
        if (answers_selected.includes(1) == false)
            answers_selected.push(1);
    if (optiune == "buton2")
        if (answers_selected.includes(2) == false)
            answers_selected.push(2);
    if (optiune == "buton3")
        if (answers_selected.includes(3) == false)
            answers_selected.push(3);
}

// Încheiem quiz-ul și afișăm rezultatul
function end_quiz(why) {
    let rezList = document.getElementById("rezultat");
    let rezultat = document.createElement("li");
    let dat = new Date();
    let aux = false;

    rezultat.style.display = "flex";
    if (dat.getDate() < 10)
      rezultat.innerHTML = "0" + dat.getDate();
    else
      rezultat.innerHTML = dat.getDate();
      if ((dat.getMonth() + 1) < 10)
        rezultat.innerHTML += "/0" + (dat.getMonth() + 1);
      else
        rezultat.innerHTML += "/" + (dat.getMonth() + 1);
    rezultat.innerHTML += "/" + dat.getFullYear()  + " - ";
    if (dat.getHours() < 10)
      rezultat.innerHTML += "0" + dat.getHours();
    else
      rezultat.innerHTML += dat.getHours();
    if (dat.getMinutes() < 10)
      rezultat.innerHTML += ":0" + dat.getMinutes();
    else
      rezultat.innerHTML += ":" + dat.getMinutes();
    if (dat.getSeconds() < 10)
      rezultat.innerHTML += ":0" + dat.getSeconds();
    else
      rezultat.innerHTML += ":" + dat.getSeconds();
    rezultat.innerHTML += " - " + "REZULTAT USER " + localStorage.getItem('username') + " ";
    if (questions_total == 20)
      rezultat.innerHTML += "CAT. A:";
    else if (questions_total == 26)
      rezultat.innerHTML += "CAT. B:";
    else if (questions_total == 5)
      rezultat.innerHTML += "CAT. X:";

    if (why == "time") {
        rezultat.style.color = "#940f0f";
        rezultat.innerHTML += " Timpul a expirat, ai picat!";
        alert("Timpul a expirat!");
    } else {
        clearTimeout(contor);
        if (questions_wrong >= maxim_wrong) {
            rezultat.style.color = "#940f0f";
            rezultat.innerHTML += " Ai picat cu " + questions_corect + '/' + questions_total + '.';
            alert("Ai picat cu " + questions_corect + '/' + questions_total + '.');

        } else if (questions_remaining == 0) {
            aux = true;
            rezultat.style.color = "#0f9442";
            rezultat.innerHTML += " Ai luat sala cu " + questions_corect + '/' + questions_total + '.';
            alert("Ai luat sala cu " + questions_corect + '/' + questions_total + '.');
        }
    }

    rezList.appendChild(rezultat);
    rezList.style.display = "flex";
    localStorage.setItem('list', JSON.stringify(rezList.innerHTML));
    clearInterval(timp);
    clearTimeout(contor);
    var butoane = document.getElementById("quiz-prepare");
    butoane.style.display = "flex";
    var butoane = document.getElementById("quiz");
    butoane.style.display = "none";
    document.getElementById('inapoi').style.display = "block";

    if (aux == true) {
      var userUpdate = {
        username: localStorage.getItem('username'),
        quizP: 1
      };
    }
    else {
      var userUpdate = {
        username: localStorage.getItem('username'),
        quizF: 1
      };
    }

    fetch('/users', {
      method: "put",
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(userUpdate)
    }).then(function(response) {});
}

function load_question() {
    delete_answers();
    document.getElementById("RQ").innerHTML = questions_remaining;
    document.getElementById("CQ").innerHTML = questions_corect;
    document.getElementById("WQ").innerHTML = questions_wrong;
    if (questions[question_index - 1].length == 6) {
        var mq = window.matchMedia("(max-width: 768px)");
        document.getElementById("quiz-image").style.display = "block";

        if (mq.matches) {
            document.getElementById("quiz-buttons").style.width = "100%";
            document.getElementById("quiz-buttons").style.justifyContent = "space-around";
            document.getElementById("quiz-image").style.width = "100%";
            document.getElementById("quiz-image").style.marginTop = "4%";
        } else {
            document.getElementById("quiz-buttons").style.width = "60%";
            document.getElementById("quiz-buttons").style.justifyContent = "center";
            document.getElementById("quiz-image").style.width = "30%";
        }
        document.getElementById("qimage").src = "images/" + questions[question_index - 1][5];
    } else {
        document.getElementById("quiz-buttons").style.width = "100%";
        document.getElementById("quiz-image").style.display = "none";
        document.getElementById("qimage").src = "";
    }
    document.getElementById("question").innerHTML = question_index + ". " + questions[question_index - 1][0];
    document.getElementById("buton1").innerHTML = questions[question_index - 1][1];
    document.getElementById("buton2").innerHTML = questions[question_index - 1][2];
    document.getElementById("buton3").innerHTML = questions[question_index - 1][3];
}

function verify_answers() {
    if (answers_selected.length != 0) {
        questions_remaining -= 1;
        if (JSON.stringify(answers_selected.sort()) == JSON.stringify(questions[question_index - 1][4].sort())) {
            questions_corect += 1;
            questions_submitted_arr.push(question_index);
        } else {
            questions_wrong += 1;
            questions_submitted_arr.push(question_index);
        }
        if (questions_remaining == 0 || questions_wrong >= maxim_wrong) {
            load_question();
            setTimeout(end_quiz(""), 1000);
        } else
            skip_question();
    }
}

function delete_answers() {
    optiuni = ["buton1", "buton2", "buton3"]
    for (optiune of optiuni) {
        document.getElementById(optiune).style.color = "#40476d";
        document.getElementById(optiune).style.backgroundColor = "white";
    }
    answers_selected = [];
}

function skip_question() {
    question_index += 1;
    if (question_index > questions_total)
        question_index = question_index % questions_total;
    while (questions_submitted_arr.includes(question_index)) {
        question_index += 1;
        if (question_index > questions_total)
            question_index = question_index % questions_total;
    }
    load_question();
}

window.onload = function() {
  getQuestions();

  let rezList = document.getElementById("rezultat");
  rezList.style.display = "flex";
  if (localStorage.getItem('list'))
    rezList.innerHTML = JSON.parse(localStorage.getItem('list'));

  var butoane = document.getElementById("quiz");
  butoane.style.display = "none";
  document.getElementById("skip_intrebare").addEventListener("click", () => {
      skip_question();
  });
  document.getElementById("buton1").addEventListener("click", () => {
      mark_question("buton1");
  });
  document.getElementById("buton2").addEventListener("click", () => {
      mark_question("buton2");
  });
  document.getElementById("buton3").addEventListener("click", () => {
      mark_question("buton3");
  });
  document.getElementById("sterge_rasp").addEventListener("click", () => {
      delete_answers();
  });
  document.getElementById("trimite_rasp").addEventListener("click", () => {
      verify_answers();
  });
}
