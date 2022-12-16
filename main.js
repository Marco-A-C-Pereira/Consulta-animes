import { mainUserFetch } from './modules/graphQL.js'

let animeList = await mainUserFetch()
document.addEventListener('load', objBuild(animeList) )

// Impede o teclado do mobile de mudar o viewport
window.addEventListener('load', () => {
  const metaViewport = document.querySelector("meta[name=viewport]");

  metaViewport.setAttribute("content", metaViewport.content + ", height=" + window.innerHeight)
});



function objBuild(animeList) {

    animeList.data.User.favourites.anime.nodes.forEach((anime) => {
      const animeName = anime.title.english ? anime.title.english : anime.title.romaji
      const animeCover = anime.coverImage.large
  
      const cardBody = document.createElement('article');
        cardBody.classList.add('card-body')

      const animeLabel = document.createElement('label');
        animeLabel.for = animeName;

        // Not working
        animeLabel.addEventListener('click', (e) => {
          animeLabel.classList.toggle('checked');
        } );

      const input = document.createElement('input');
        input.type = 'checkbox'; input.id = animeName;
        input.addEventListener('click', (e) => {
          e.stopPropagation();
          !input.checked;
          alterList(animeTitle.innerHTML);
        })

      const animeImg = document.createElement('img');
        animeImg.src = animeCover;

      const animeTitle = document.createElement('p');
        animeTitle.innerText = animeName;

      const cardContainer = document.querySelector('.card-container');
      const imgContainer = document.createElement('div');
        imgContainer.classList.add("imgContainer");
      const textContainer = document.createElement('div');
        textContainer.classList.add("textContainer");

      cardContainer.appendChild(cardBody).appendChild(animeLabel)
      animeLabel.append(input, animeImg, animeTitle)


    });
  }

  var userList = [];
  function alterList(animeTitle) {
    !userList.includes(animeTitle) ? userList.push(animeTitle) : userList.splice(userList.indexOf(animeTitle), 1)
    console.log(userList.length)
    console.log(animeList.data.User.favourites.anime.nodes.length)
  }