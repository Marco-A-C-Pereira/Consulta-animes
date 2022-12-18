export { mainUserFetch, compareUser};

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
    
  return querryGen(query).then(response => response.data.User.favourites.anime.nodes)
}

async function compareUser(user) {
  const query = `
    {
      User(name: "${user}") {
        favourites {
          anime {
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

  return querryGen(query).then(response => response.data.User.favourites.anime.nodes)
}

function querryGen(query) {
  return fetch("https://graphql.anilist.co", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query
    }),
  }) 
  .then(response => response.json())
}

