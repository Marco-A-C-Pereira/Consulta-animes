export { mainUserFetch, compareUser};

async function mainUserFetch () {
  const query = `
  query GetBasicUser($pageNumber: Int){
    User(name: "MarcoAP") {
      favourites {
        anime (page: $pageNumber) {
          pageInfo{
            currentPage
            hasNextPage
          }
          nodes {
            title {
              english
              romaji
            }
            coverImage {
              large
            }
          }
        }
      }
    }
  }
  `;
  return await querryGen(query)
}

async function compareUser(user) {
  const query = `
  query GetSelectedUser($pageNumber: Int){
    User(name: "${user}") {
      favourites {
        anime (page: $pageNumber) {
          pageInfo{
            currentPage
            hasNextPage
          }
          nodes {       
            title {
              english
              romaji
            }
          }
        }        
      }
    }
  }
  `;

  return await querryGen(query)
}

// Função de querry e paginação
// Utiliza recursividade assincrona para realizar sua função
// Pode ser otimizada para promisses implicias (Assync Await) 
function querryGen(
  query, 
  param = {pageNumber: 1}, 
  hasPage = true, 
  results = [] ) {
    return new Promise((resolve, reject) => { 
    if ( !(hasPage) ) {
      return resolve(results);
    }
    //Porção de Querry
   fetch("https://graphql.anilist.co", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: query,
        variables: param
      }),
    }) 
    
    .then(response => response.json())
    // Porção Recursiva
    .then(response => {
    try {
      resolve (querryGen(
        query,
        param = {pageNumber:  response.data.User.favourites.anime.pageInfo.currentPage+1},
        response.data.User.favourites.anime.pageInfo.hasNextPage, 
        results = results.concat(response.data.User.favourites.anime.nodes)))
      }
     catch(err) {resolve(null)}
    })


  })
}
