export { mainUserFetch };

async function mainUserFetch () {
    const query = `
      {
        User(name: "MarcoAP") {
          favourites {
            anime {
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
    
  return querryGen(query)
}

function querryGen(query) {
  return fetch("https://graphql.anilist.co", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query
    }),
  }) 
  .then(response => response.json()).then(response => response.data.User.favourites.anime.nodes)
}

