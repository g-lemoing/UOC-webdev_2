window.onload = function () {

  // Variables
  let duel = [];                    // Fighting cards array
  const PATH_URL = "https://pokeapi.co/api/v2/pokemon/";     // Root URL path 
  let pageName = location.pathname.split("/").slice(-1);
  let cardMode = "summary";
  const body = document.getElementsByTagName('body')[0];
  const element = document.getElementsByTagName("nav")[0];
  const nodes = Array.from(element.getElementsByTagName("img"));

  // Mirem si teníem seleccionat el tema fosc o clar

  switchTheme(checkTheme());

  /**** Carreguem una informació o altra a la pàgina segons l'URL ***************/
  // Si estem a la pàgina d'index, consultem si hi ha algun paràmetre a la URL
  if (pageName == "index.html") {

    const enrere = document.querySelector('#enrere');
    const links = document.querySelectorAll('.link');
    const cercador = document.querySelector('#cont-search');
    let params = new URLSearchParams(document.location.search);
    let pokeID = params.get("pokeID");


    if (pokeID) {
      cardMode = "complete";
      // Guardem en LocalStorage que volem conservar els Pokemon
      localStorage.setItem("preservePokemon", "true");
      document.getElementById("cards-grid").setAttribute("complete", true);
      // mostrar l'enllaç per tornar enrera i ocultar el cercador
      enrere.style.display = "block";
      cercador.style.display = "none";
      // mostrar els links només quan estem a la pàgina o ruta inicial (sense paràmetres a la url)
      links.forEach(link => link.style.display = "none");
      //Carreguem la informació del pokemon corresponent
      let fetchurl = PATH_URL + pokeID;
      fetchPokemon(fetchurl, createCard);
    } else {
      cardMode = "summary";
      document.getElementById("cards-grid").setAttribute("complete", false);
      // ocultar l'enllaç per tornar enrera i mostrar el cercador
      enrere.style.display = "none";
      cercador.style.display = "flex";
      // mostrar els links només quan estem a la pàgina o ruta inicial (sense paràmetres a la url)
      links.forEach(link => link.style.display = "block");
      // carreguem les 10 cartes aleatories
      loadCards();
      //Filtratge de cartes a mesura que anem escrivint a la caixa de text
      document.getElementById("name_search").addEventListener("keyup", filterCards);
    }
  } else {
    loadCards();
  }


  // Get an array of random numbers of Pokemons to be displayed
  function getRandomPokeNumbers(totalCards) {
    // Constant values
    const MAX_POKE_NUMBER = 905;                            // Max Pokemon Number

    // Variables
    let pokenumbers = [];                // Array of selected Pokemons

    // Build array of Pokemons 
    while (pokenumbers.length < totalCards) {
      let pokenumber = (Math.floor(Math.random() * MAX_POKE_NUMBER)).toString();
      if (!pokenumbers.includes(pokenumber) && pokenumber > 0) {
        pokenumbers.push(pokenumber);
      }
    }
    //Guardem els números de Pokemon generats al LocalStorage
    localStorage.setItem("currentPokemons", pokenumbers.join(","));
    return pokenumbers;
  }

  // Get Pokemon data from fetch API
  function loadCards() {
    const CARDS = 10;
    let pokenumbers = [];
    //Comprovem si venim de la pàgina de combat
    if(pageName == "index.html"){
      let conservarPokemons = localStorage.getItem("preservePokemon");
      console.log(conservarPokemons);
      if(conservarPokemons == "true"){
        localStorage.setItem("preservePokemon", "false");
        pokenumbers = localStorage.getItem("currentPokemons").split(",");
      }
      else {
        pokenumbers = getRandomPokeNumbers(CARDS);
      }
    } else {
      pokenumbers = getRandomPokeNumbers(CARDS);
    }
                                             // Number of cards to be loaded on page
    console.log(pokenumbers);
    var pokeResult;                                             // FetchAPI result object

    // Request from PokeAPI

    pokenumbers.forEach(element => {
      let fetchurl = PATH_URL + element;                      // Build url + id Pokemon
      fetchPokemon(fetchurl, createCard);
    });
  }

  function fetchPokemon(fetchurl, createCard) {
    fetch(fetchurl, createCard)                             // Fetch request
      .then(response => response.json())
      .then(data => pokeResult = {
        "id": data.id,
        "name": data.name,
        "img": (data.sprites.front_default)?data.sprites.front_default:"assets/logos/no-image.png",
        "img_back": (data.sprites.back_default)?data.sprites.back_default:"assets/logos/no-image.png",
        "attack": data.stats[1].base_stat,
        "defense": data.stats[2].base_stat,
        "types": data.types
      })
      .then(() => createCard(pokeResult))
  }

  function createCard(cardObj) {
    let cardGrid = document.getElementById('cards-grid');

    // Creem l'element 'carta' que contindrà coses diferents segons si estiguem
    // en la pàgina de combat o en la pàgina de l'índex

    let card = document.createElement('div');
    // Add class to card element
    card.classList.add("card");
    card.setAttribute("id", cardObj.id);
    // Creem els elements i els afegim
    // Per al mode combat la carta tindrà una part de darrere
    if (pageName == "combat.html") {
      let card_back = document.createElement('div');
      card_back.classList.add('back');
      card.appendChild(card_back);
    }

    // I també una part frontal que serà igual a la de l'índex, però penjarà d'un lloc diferent
    let card_front;
    if (pageName == "combat.html"){
      card_front = document.createElement('div');
      card_front.classList.add('front');
      card.appendChild(card_front);
    }
    // Guardem en 'elem_int' l'element on volem penjar el contingut de la carta:
    //  Per al mode combat penjaran de l'element 'card_front'
    //  Per al mode index penjaran directament de carta

    let elem_int = (pageName == "combat.html")?card_front:card;

    // Contenidor per les dues imatges
    let img_cont = document.createElement("div");
    img_cont.classList.add("img-container");
    //Ho pengem en un lloc o en un altre depenent del mode
    elem_int.appendChild(img_cont);
    //Imatge frontal
    let card_img = document.createElement('img');
    card_img.src = cardObj.img;
    card_img.alt = cardObj.name;
    img_cont.appendChild(card_img);

    //Imatge darrere
    if (cardMode == "complete") {
      let card_img_back = document.createElement('img');
      card_img_back.src = cardObj.img_back;
      card_img_back.alt = cardObj.name;
      img_cont.appendChild(card_img_back);
    }

    //Nom del Pokemon
    let card_name = document.createElement('h2');
    card_name.innerHTML = (cardObj.name).charAt(0).toUpperCase() + cardObj.name.slice(1);
    elem_int.appendChild(card_name);

    //Div per als estats
    let div_stats = document.createElement('div');
    div_stats.classList.add("estats");

    //Atac del Pokemon
    let div_attack = document.createElement('div');
    div_attack.classList.add("card-attack");
    let img_attack = document.createElement('img');
    img_attack.setAttribute("src","assets/logos/atac.svg");
    img_attack.classList.add((checkTheme() == "dark") ? "icon-dark-theme" : "icon");
    //L'afegim a l'array d'elements que han de canviar quan canvia el tema de fons
    nodes.push(img_attack);
    let card_attack = document.createElement('span');
    card_attack.textContent = cardObj.attack.toString();
    div_attack.appendChild(img_attack);
    div_attack.appendChild(card_attack);
    div_stats.appendChild(div_attack);

    //Defensa del Pokemon
    let div_defense = document.createElement('div');
    div_defense.classList.add("card-defense");
    let img_defense = document.createElement('img');
    img_defense.setAttribute("src","assets/logos/defensa.svg");
    img_defense.classList.add((checkTheme() == "dark") ? "icon-dark-theme" : "icon");
    //L'afegim a l'array d'elements que han de canviar quan canvia el tema de fons
    nodes.push(img_defense);
    let card_defense = document.createElement('span');
    card_defense.textContent = cardObj.defense.toString();
    div_defense.appendChild(img_defense);
    div_defense.appendChild(card_defense);
    div_stats.appendChild(div_defense);

    elem_int.appendChild(div_stats);

    //Tipus del Pokemon
    if (cardMode == "complete") {
      let card_types = document.createElement('div');
      card_types.classList.add("tipus-pokemon")
      cardObj.types.forEach(function (tipus) {
        let imgType = document.createElement('img');
        imgType.setAttribute("src","assets/tipus/" + tipus.type.name + ".png");
        imgType.setAttribute("title",tipus.type.name);
        imgType.setAttribute("alt",tipus.type.name);
        card_types.appendChild(imgType);
      });
      elem_int.appendChild(card_types);
    }

    if ((cardMode == "summary") && (pageName == "index.html")) {
      let card_link = document.createElement('a');
      let info_icon = document.createElement('img');
      //Li posem la classe a la icona depenent del tema clar o fosc
      info_icon.classList.add((checkTheme() == "dark") ? "icon-dark-theme" : "icon");
      info_icon.src = "assets/logos/info-icon.svg";
      card_link.appendChild(info_icon);
      card_link.setAttribute("href", "?pokeID=" + cardObj.id);
      card_link.classList.add("link-com-boto");
      elem_int.appendChild(card_link);
      //L'afegim a l'array d'elements que han de canviar quan canvia el tema de fons
      nodes.push(info_icon);
    }

    // If combat page
    if (pageName == "combat.html") {
      // Set data-attributes for name, attack and defense values
      card.dataset.name = (cardObj.name).charAt(0).toUpperCase() + cardObj.name.slice(1);
      card.dataset.attack = cardObj.attack;
      card.dataset.defense = cardObj.defense;
      // And add Event Listener - Click
      //Gir de carta quan la cliquem en la pàgina de combat
      card.addEventListener('click', function () {
        this.classList.add('flipped');
        // Add card to fighting cards array and check the card has not been clicked already
        if (duel.length == 0 || (duel.length == 1 && duel[0] != this.dataset)){
          duel.push(this.dataset);
        }
        // If array has two elements, show winner
        if (duel.length == 2) {
          setTimeout(card1Wins(duel[0], duel[1]), 1000);
          duel = [];
        }
      });
    }

    // En mode combat, afegim tots els elements a la part frontal
    if (pageName == "combat.html"){
      card.appendChild(card_front);
    }
    // Afegim la card al grid --> Hauria de ser al forEach de creació de la grid de cards
    cardGrid.appendChild(card);
  }

    // Fight winner function
  function card1Wins(card1, card2) {
    let win = (parseInt(card1.attack) > parseInt(card2.defense))? ' guanya a ' : ' perd contra ';
    let message = document.getElementById("winner-message");
    message.innerHTML = card1.name + ' ataca i' + win + card2.name + '!'
    message.style.display = "block";
  }

  // Filter cards by name
  function filterCards(e) {
    // Declare variables
    let input, filter, cardsGrid, cards, h2, i, txtValue;

    filter = e.target.value.toUpperCase();
    cards = document.getElementsByClassName('card');

    // Loop through all list items, and hide those who don't match the search query
    for (i = 0; i < cards.length; i++) {
      h2 = cards[i].getElementsByTagName("h2")[0];
      txtValue = h2.textContent || h2.innerText;

      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        cards[i].style.display = "block";
      } else {
        cards[i].style.display = "none";
      }
    }
  }

  // Switch theme between light and dark
  function switchTheme(newTheme) {

    switch (newTheme) {
      case "dark":
        body.setAttribute("data-theme", "dark");

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
    console.log(theme);
    if (theme == null || theme == '') {
      theme = "light";
    }
    document.getElementById(theme).checked = true;
    return theme;
  }

  // Event listeners
  // Change theme listener
  const switcher = document.querySelectorAll('input[name = "switcher"]');

  switcher.forEach(
    (sw) => {
      sw.addEventListener('change', canviTema)
    }
  )

  function canviTema(e) {
    switchTheme(e.target.value);
  }

};