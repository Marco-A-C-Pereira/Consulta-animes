import { mainUserFetch } from './modules/graphQL.js'

document.addEventListener('load', objBuild(await mainUserFetch()) )

function objBuild(animeList) {

    animeList.data.User.favourites.anime.nodes.forEach((anime) => {
      const animeName = anime.title.english ? anime.title.english : anime.title.romaji
      const animeCover = anime.coverImage.large
  
      
    });
  }
  