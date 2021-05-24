var personal;

String.prototype.capitalize = function() {
  return this.charAt(0).toUpperCase() + this.slice(1)
}

function drawPersonal()
{
  let aux = 0;
  table = document.getElementById("personal-table");

  for (locatie of Object.keys(personal))
  {
      for (let index = 0; index < personal[locatie].length; index += 3)
      {
        let limit = index + 3;
        let element = document.createElement("div");

        element.classList.add("personal-row");
        element.classList.add("personal-" + locatie);

        for (let jndex = index; jndex < limit && jndex < personal[locatie].length; jndex++)
        {
          let pers = document.createElement("div");
          pers.classList.add("person");

          let over = document.createElement("div");
          over.classList.add("overlay");

          let text = document.createElement("div");
          text.classList.add("text");

          let nume = document.createElement("p");
          nume.style.textAlign = "center";
          nume.innerHTML = personal[locatie][jndex]['nume'];

          let masina = document.createElement("p");
          masina.style.textAlign = "center";
          masina.innerHTML = personal[locatie][jndex]['masina'];

          let telefon = document.createElement("p");
          telefon.style.textAlign = "center";
          telefon.innerHTML = personal[locatie][jndex]['numar'];

          let a = document.createElement('a');
          a.href = "personal-page" + '/' + personal[locatie][jndex]['id'];

          let img = document.createElement("img");
          img.src = personal[locatie][jndex]['img'];
          img.alt = "Avatar";
          img.classList.add("person-image");
          img.style.width = "100%";

          text.appendChild(nume);
          text.appendChild(masina);
          text.appendChild(telefon);
          over.appendChild(text);
          pers.appendChild(a);
          a.appendChild(img);
          pers.appendChild(over);

          element.appendChild(pers);
        }
        table.appendChild(element);
      }
    }
}

function getPersonal () {
  fetch('/personal').then(function(response) {
      if (response.status !== 200) {
        console.log('Looks like there was a problem. Status Code: ' + response.status);
        return;
      }
      response.json().then(function(data) {
        personal = data;
        drawPersonal();
        drawButtons();
    });
  })
}

function drawButtons()
{
  drop = document.getElementById("dropdown-menu-item");
  for (obj of Object.keys(personal))
  {
    buton = document.createElement('a');
    buton.href = "javascript:showInstructori(\'" + 'personal-' + obj + "\')";
    buton.innerHTML = "Personal " + obj.capitalize();
    drop.appendChild(buton);
  }

}

function showInstructori(zona) {
    for (obj of document.getElementsByClassName('personal-row'))
    {
      if (obj.classList.contains(zona) || zona == 'Personal') {
        obj.style.display = 'flex';
      }
      else {
        obj.style.display = 'none';
      }
    }
}

window.onload = function() {
  getPersonal();
}
