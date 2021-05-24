var eroare;

function verify(user, pass)
{
  return ((user.includes(" ") && pass.includes(" ")) ||
  user == "" || pass == "");
}

function updateLastLogin() {
  let dat = new Date();
  let data = "";

  if (dat.getDate() < 10)
    data = "0" + dat.getDate();
  else
    data = dat.getDate();
    if ((dat.getMonth() + 1) < 10)
      data += "/0" + (dat.getMonth() + 1);
    else
      data += "/" + (dat.getMonth() + 1);
  data += "/" + dat.getFullYear()  + " - ";
  if (dat.getHours() < 10)
    data += "0" + dat.getHours();
  else
    data += dat.getHours();
  if (dat.getMinutes() < 10)
    data += ":0" + dat.getMinutes();
  else
    data += ":" + dat.getMinutes();
  if (dat.getSeconds() < 10)
    data += ":0" + dat.getSeconds();
  else
    data += ":" + dat.getSeconds();

  var userUpdate = {
    username: localStorage.getItem('username'),
    lastLogin: data
  }

  fetch('/users', {
    method: "put",
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(userUpdate)
  }).then(function(response) {})
}

function try_login() {
  let user = document.getElementById("username").value;
  let pass = document.getElementById("password").value;

  if (verify(user, pass))
  {
    eroare.style.color = 'red';
    eroare.innerHTML = "Numele și parola sunt invalide (conțin spații).";
    return ;
  }

  fetch('/users', {
    method: 'get'
  }).then(function(response) {
      if (response.status !== 200) {
        console.log('Looks like there was a problem. Status Code: ' + response.status);
        return ;
      }
      response.json().then(function(data) {
        let contCorect = false;

        for (let i = 0; i < data.length; i++) {
          if (user == data[i].username) {
            if (pass == data[i].password)
            {
              contCorect = data[i].privilege;
              break;
            }
            else {
              break;
            }
          }
        }
        if (contCorect != false) {
          eroare.style.color = 'green';
          eroare.innerHTML = "Contul este corect. Veți fi redirecționat.";
          document.getElementById("username").readOnly = true;
          document.getElementById("password").readOnly = true;
          localStorage.setItem('username', user);
          localStorage.setItem('password', pass);
          localStorage.setItem('privilege', contCorect);
          localStorage.setItem('incercari', 0);
          updateLastLogin();
          setTimeout(function() {
            window.location.href = 'user-panel.html';
          },
           1000);
          return ;
        }
        else {
          eroare.style.color = 'red';
          eroare.innerHTML = "Numele sau parola sunt incorecte.";
          if (!localStorage.getItem('incercari'))
            localStorage.setItem('incercari', 1);
          else {
            let aux = localStorage.getItem('incercari');
            if (aux < 2) {
              aux = parseInt(aux) + 1;
              localStorage.setItem('incercari', aux);
            }
            else {
              document.getElementById("username").readOnly = true;
              document.getElementById("password").readOnly = true;
              eroare.innerHTML += " Ați fost blocat pentru 5 secunde."
              setTimeout(function() {
                document.getElementById("username").readOnly = false;
                document.getElementById("password").readOnly = false;
                eroare.style.color = 'blue';
                eroare.innerHTML = "Ați fost deblocat. Încercați din nou.";
                localStorage.setItem('incercari', 0);
              },
               2000);
            }
          }

        }
    });
  })
}

function register() {
  if (verify(document.getElementById("username").value, document.getElementById("password").value))
  {
    eroare.style.color = 'red';
    eroare.innerHTML = "Numele și parola sunt invalide (conțin spații).";
    return ;
  }

  var newUser = {
    username: document.getElementById("username").value,
    password: document.getElementById("password").value,
    privilege: "user",
    quizP: "0",
    quizF: "0",
    lastLogin: "0"
  }

  fetch('/users', {
    method: "post",
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(newUser)
  }).then(function(response) {
    if (response.status == 409) {
      eroare.style.color = 'red';
      eroare.innerHTML = "Există deja un cont cu numele acesta.";
    }
    else if (response.status == 200)
    {
      localStorage.setItem('inregistrat', true);
      eroare.innerHTML = "Contul a fost creat cu succes.";
      eroare.style.color = 'green';
    }
  })
}

window.onload = function() {
  if (localStorage.getItem('username')) {
    window.location.href = 'user-panel';
    return ;
  }

  eroare = document.getElementById('eroare');

  document.getElementById("login").addEventListener("click", () => {
      try_login();
  });

  document.getElementById("register").addEventListener("click", () => {
      register();
  });
}
