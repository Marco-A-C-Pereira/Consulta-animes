import { mainUserFetch, compareUser } from './modules/graphQL.js'

let animeList = await mainUserFetch()
const animeCards = [];
document.addEventListener('load', objBuild(animeList) )


// Impede o teclado do mobile de mudar o viewport
window.addEventListener('load', () => {
  const metaViewport = document.querySelector("meta[name=viewport]");

  metaViewport.setAttribute("content", metaViewport.content + ", height=" + window.innerHeight)
});


function objBuild(animeList) {

    animeList.forEach((anime) => {
      const animeName = anime.title.english ? anime.title.english : anime.title.romaji
      const animeCover = anime.coverImage.large

      const cardBody = document.createElement('article');
        cardBody.classList.add('card-body')

      const animeLabel = document.createElement('label');
        animeLabel.for = animeName;

        animeLabel.addEventListener('click', (e) => {
          animeLabel.classList.toggle('checked');
        } );

      const input = document.createElement('input');
        input.type = 'checkbox'; input.id = animeName;
        input.addEventListener('click', (e) => {
          e.stopPropagation();
          !input.checked;
          alterList(animeTitle.innerHTML);
          showFooter();
        })

      const animeImg = document.createElement('img');
        animeImg.src = animeCover;

      const animeTitle = document.createElement('p');
        animeTitle.innerText = animeName;

        //appends

      // const cardContainer = document.querySelector('.card-container');
      const imgContainer = document.createElement('div');
        imgContainer.classList.add("imgContainer");
      const textContainer = document.createElement('div');
        textContainer.classList.add("textContainer");

      cardBody.appendChild(animeLabel)
      animeLabel.append(input, animeImg, animeTitle)


      animeCards.push(cardBody);
    });
    appendCards(animeCards);
  }

  function appendCards(cards) { document.querySelector('.card-container').replaceChildren(...cards); }

  function appendError() {
    const errorWrapper = document.createElement('section');
      const errorText = document.createElement('p');
        errorText.innerText = "Nenhum Anime Encontrado :/";
      const errorSugest = document.createElement('p');
        errorSugest.innerText = "Verifique o nome ou talvez ainda não tenha assistido esse anime"

      errorWrapper.append(errorText, errorSugest);

    document.querySelector('.card-container').replaceChildren(errorWrapper);
  }

 // Src Bar

  const searchOptionLabels = document.querySelectorAll(`label[for="search-anime"],label[for="search-user"] `);
    searchOptionLabels.forEach(label => {
      label.addEventListener('click', (e) => {
        searchBar.value = "";
        appendCards(animeCards)
      })
    })

  const searchBar = document.getElementById("search-bar");
    searchBar.addEventListener("input", (e) => {
      let searchOption = document.querySelector(`input[name="radio-options"]:checked`).id;


      if (searchOption === "search-anime") {searchAnime(e.target.value.toLowerCase())}
      else if (searchOption === "search-user") { searchUser(e.target.value) }

    })

    const searchAnime = debounce((userInput)=>{
      let animeQuerryResult = animeCards.filter(card => card.innerText.toLowerCase().includes(userInput))

      if (userInput.target == false) { appendCards(animeCards) }
      else if (animeQuerryResult.length === 0 ){ appendError() }
      else { appendCards(animeQuerryResult) } // Controle de estado ?
    })

    const searchUser = debounce( async (userInput)=>{
      try { 
        let results = await compareUser(userInput).then(response => response.map(node => node.title.english ? node.title.english : node.title.romaji))
      

        const matchCards = animeCards.filter(card => results.includes(card.innerText)); // Retorna os meus cards que tem match
        matchCards.forEach(card => card.children[0].click() )
        addSnackbar(`Animes de ${userInput} selecionados`, 'snackSuccess')
      }
      catch { 
        if (userInput) { addSnackbar(`Usuario ${userInput} não encontrado`, 'snackError') }}
    });

    function addSnackbar(msg, msgType) {
      if (document.getElementsByClassName('snackbar')[0]) {document.getElementsByClassName('snackbar')[0].remove()}

      const snackContainer = document.createElement('div');
      snackContainer.classList.add('snackbar', msgType)
      snackContainer.innerText = msg;
      
      document.querySelector('main').appendChild(snackContainer);

      const snackFade = snackContainer.animate([{ opacity: 0 }, { opacity: 1 }], {duration: 1000,  fill: "forwards"} )
      setTimeout(() => {snackFade.reverse();}, 5000);
      setTimeout(() => {snackContainer.remove()}, 6000); // Há uma solução melhor ? 

      snackContainer.addEventListener('click', (e)=>{
        e.preventDefault();
        snackFade.reverse()
        setTimeout(()=> {snackContainer.remove()}, 1000)
      })
    }

  var userList = [];
  function alterList(animeTitle) {
    !userList.includes(animeTitle) ? userList.push(animeTitle) : userList.splice(userList.indexOf(animeTitle), 1)
  }
  const footer = document.getElementsByTagName('footer')[0];
  function showFooter() {
    let hasItens = userList.length === 0;
    hasItens ? footer.style.transform = 'translate(0, 200%)' : footer.style.transform = 'translate(0, 0)'
  }

  //Modal
  const modal = document.getElementById('modal');
  const modalcolse = document.getElementById('modal-close');
   modalcolse.addEventListener('click', () => {
    modal.style.display = 'none'
    document.body.classList.remove("noscroll");
    footer.style.transform = 'translate(0, 0)'
    });


  const finish = document.getElementById('finish');
    finish.addEventListener('click', () => {
      modal.style.display = 'block';
      document.body.classList.add("noscroll");
      footer.style.transform = 'translate(0, 200%)'
      alterCounter(userList.length, animeList.length);
      showResultsList();
    });

  const modalCounter = document.getElementById('modal-counter');
    function alterCounter(userList, ownerList) {
      modalCounter.innerText = `(${userList} / ${ownerList})`;
    }

  const modalResults = document.getElementById('modal-results');
    function showResultsList () {
      const resultList = document.createElement('ul');
      modalResults.replaceChildren();
      modalResults.appendChild(resultList);

    userList.forEach(item => {
        let listItem = document.createElement('li');
        listItem.innerText = item;
        resultList.appendChild(listItem)
     })
    }

    function debounce(cb, delay = 500) {
      let timeout

      return (...args) => {
        clearTimeout(timeout)
        timeout= setTimeout(() => {
          cb(...args)
        }, delay)
      }
    }