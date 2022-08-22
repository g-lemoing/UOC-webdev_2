window.onload = function () {
  //******************************** MODAL *******************************************/
  //Funció per obrir el Modal
  const obrirModal = (e) => {
    let pokeID = e.currentTarget.getAttribute("id");
    let modal = document.getElementById("poke-modal");
    document.body.style.overflow = "hidden";
    modal.setAttribute("obert", "true");
    // Esdeveniment per tancar el modal si polsem la tecla ESC
    document.addEventListener("keydown", tancarESC);
    let overlay = document.createElement("div");
    overlay.setAttribute("id", "modal-overlay");
    document.body.appendChild(overlay);
  };

  //Funció per tancar el modal
  const tancarModal = () => {
    let modal = document.getElementById("poke-modal");
    document.body.style.overflow = "auto";
    modal.removeAttribute("obert");
    document.removeEventListener("keydown", tancarESC);
    document.body.removeChild(document.getElementById("modal-overlay"));
  };

  //Esdeveniment per tancar el Modal quan polsem la 'x'
  document.getElementsByClassName("modal-tancar")[0].addEventListener("click", tancarModal);

  //Funció per tancar el modal si polsem la tecla ESC
  const tancarESC = (e) => {
    if (e.keyCode == 27) {
      tancarModal();
    }
  };
/********************************* FI MODAL ******************************************/
  
loadCards();

  // Variables
  var duel = [];                    // Fighting cards array

  // Get an array of random numbers of Pokemons to be displayed
  function getRandomPokeNumbers(totalCards) {
    // Constant values
    const MAX_POKE_NUMBER = 905;                            // Max Pokemon Number
    console.log('Hello fetchapi')
    // Variables
    let pokenumbers = [];                // Array of selected Pokemons

    // Build array of Pokemons 
    while (pokenumbers.length < totalCards) {
      let pokenumber = (Math.floor(Math.random() * MAX_POKE_NUMBER)).toString();
      console.log(pokenumber);
      if (!pokenumbers.includes(pokenumber) && pokenumber > 0) {
        pokenumbers.push(pokenumber);
      }
    }
    return pokenumbers;
  }

  // Get Pokemon data from fetch API
  function loadCards() {
    const CARDS = 10;                                           // Number of cards to be loaded on page
    const pokenumbers = getRandomPokeNumbers(CARDS);
    const PATH_URL = "https://pokeapi.co/api/v2/pokemon/"       // Root URL path 
    var pokeResult;                                             // FetchAPI result object

    // Request from PokeAPI

    pokenumbers.forEach(element => {
      let fetchurl = PATH_URL + element;                      // Build url + id Pokemon
      console.log(fetchurl);

      fetch(fetchurl, createCard)                             // Fetch request
        .then(response => response.json())
        .then(data => pokeResult = {
          "id": data.id,
          "name": data.name,
          "img": data.sprites.front_default,
          "img-back": data.sprites.back_default,
          "attack": data.stats[1].base_stat,
          "defense": data.stats[2].base_stat,
          "types": data.types
        })
        .then(() => createCard(pokeResult))
    });
  }

  function createCard(cardObj) {
    console.log(cardObj.img);
    // Creem els objectes del grid i de la card
    let cardGrid = document.getElementById('cards-grid');
    let card = document.createElement('div');
    card.setAttribute("id", cardObj.id);
    // Creem els elements de cada card: imatge, nom, atac i defensa
    let card_img = document.createElement('img');
    card_img.src = cardObj.img;
    card_img.alt = cardObj.name;
    let card_name = document.createElement('h2');
    card_name.innerHTML = (cardObj.name).charAt(0).toUpperCase() + cardObj.name.slice(1);
    let card_attack = document.createElement('p');
    card_attack.innerHTML = "Atac: " + cardObj.attack.toString();
    let card_defense = document.createElement('p');
    card_defense.innerHTML = "Defensa: " + cardObj.defense.toString();

    // Afegim aquests 4 elements a la card
    card.appendChild(card_img);
    card.appendChild(card_name);
    card.appendChild(card_attack);
    card.appendChild(card_defense);

    // Add class to card element
    card.classList.add("card");

    // If combat page
    let pageName = location.pathname.split("/").slice(-1);
    if (pageName == "combat.html") {
      // Add class to make card visibility hidden (card face down)
      card.classList.add("card-down");
      // Set data-attributes for name, attack and defense values
      card.dataset.name = cardObj.name;
      card.dataset.attack = cardObj.attack;
      card.dataset.defense = cardObj.defense;
      // And add Event Listener - Click
      card.addEventListener('click', cardUp)
    }

    //Li afegim l'esdeveniment perquè surti el Modal quan cliquem la carta
    card.addEventListener("click", obrirModal);

    // Afegim la card al grid --> Hauria de ser al forEach de creació de la grid de cards
    cardGrid.appendChild(card);
  }

  // Flip card up function
  function cardUp(card) {
    console.dir(card.target);
    // Make card visible
    // card.classList.add("card-up");
    // card.classList.remove("card-down");

    // Add card to fighting cards array
    duel.push(card.target.dataset);
    // If array has two elements, show winner
    if (duel.length == 2) {
      card1Wins(duel[0], duel[1]);
    }
  }

  // Fight winner function
  function card1Wins(card1, card2) {
    console.dir(card1);
    if (parseInt(card1.attack) > parseInt(card2.defense)) {
      alert(`${card1.name} ataca i guanya a ${card2.name}.`);
    }
    else {
      alert(`${card2.name} ataca i guanya a ${card1.name}.`);
    }
  }

  // Filter cards by name
  function filterCards() {
    // Declare variables
    let input, filter, cardsGrid, cards, h2, i, txtValue;
    input = document.getElementById('name_search');
    filter = input.value.toUpperCase();
    cardsGrid = document.getElementById("cards-grid");
    cards = cardsGrid.getElementsByTagName('div');

    // Loop through all list items, and hide those who don't match the search query
    for (i = 0; i < cards.length; i++) {
      h2 = cards[i].getElementsByTagName("h2")[0];
      txtValue = h2.textContent || h2.innerText;
      console.log(txtValue);
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        cards[i].style.display = "";
      } else {
        cards[i].style.display = "none";
      }
    }
  }

  // Switch theme between light and dark
  function switchTheme(e) {
    console.log(e.target);
    switch (e.target.value) {
      case "dark":
        body.setAttribute("data-theme", "dark");
        console.log(typeof (nodes));
        nodes.forEach((node) => {
          node.classList.remove("icon");
          node.classList.add("icon-dark-theme");
        })
        localStorage.setItem("customTheme", "dark");
        break;
      case "light":
        body.setAttribute("data-theme", "light");
        nodes.forEach((node) => {
          node.classList.remove("icon-dark-theme");
          node.classList.add("icon");
        })
        localStorage.setItem("customTheme", "light");
      default:
        body.setAttribute("data-theme", "light");
        nodes.forEach((node) => {
          node.classList.remove("icon-dark-theme");
          node.classList.add("icon");
        })
        break;
    }
  }

  // Check custom theme in local storage
  function checkTheme() {
    let theme = localStorage.getItem("customTheme");
    if (theme == null || theme != '') {
      body.setAttribute("data-theme", theme);
      document.getElementById(theme).checked = true;
    }
  }

  // Event listeners
  // Change theme listener
  const body = document.getElementsByTagName('body')[0];
  const switcher = document.querySelectorAll('input[name = "switcher"]');
  body.setAttribute('data-theme', 'light');
  switcher.forEach(
    (sw) => {
      sw.addEventListener('change', switchTheme)
    }
  )
  // Change fill color icons in nav
  const element = document.getElementsByTagName("nav")[0];
  const nodes = Array.from(element.getElementsByTagName("img"));

  // Check theme when loading page
  document.addEventListener("DOMContentLoaded", () => checkTheme());

  // Desglosar creació de card (parametrizar si es de vista detalle o llistat?)
  //--> afegir Event listener "click" --> afegir card a cards-grid

};





