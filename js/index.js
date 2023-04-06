//My code goes here

const myApi = 'https://api.artic.edu/api/v1/artworks?page=2&limit=50';
const artList = document.querySelector('.art-list');
const searchedArtList = document.querySelector('#searched-art-list');
const form = document.querySelector('form');
const input = document.querySelector('input');

document.addEventListener('DOMContentLoaded', (e) => {
    e.preventDefault()
    fetchArtItems()
    document.querySelector('form').addEventListener('submit', (e) => {
        e.preventDefault()
        let searchValue = document.querySelector("input").value.toLowerCase()
        console.log(searchValue);
        searchArtItem(searchValue)
        document.querySelector('#searched-items-header').innerHTML = `Search for ${searchValue}`
    })
})

/**
 * The following function fetches art items from my api
 */
const fetchArtItems = async () => {
    try {
        const response = await fetch(myApi, {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            }
        })
        const artItems = await response.json()
        return renderArtItems(artItems.data)
    } catch (error) {
        return console.error(error.message)
    }
}

/**
 * The following function takes an argument of artItems fetched above
 * and works on rendering them.
 * 
 */

const renderArtItems = function (artItems) {
    artItems.forEach(artItem => {
        console.log(artItem.api_link);
        //https://api.artic.edu/api/v1/artworks/27992?fields=id,title,image_id
        let imageSrc = `https://www.artic.edu/iiif/2/${artItem.image_id}/full/843,/0/default.jpg`

        let artListItem = document.createElement('li')
        artListItem.className = `artListItem`
        artListItem.innerHTML = `
        <div class="art-item shadow">
            <img src='${imageSrc}' alt="${artItem.thumbnail.alt_text}" id="art-item-image">
            <h3 id="art-item-title">${artItem.title}</h3>
            <h4 id="art-item-artist-display">by: <span id='artist-name'>${artItem.artist_display}</span></h4>
            <div class='buttons'>
                <button id='like'><i class="fa fa-thumbs-o-up" aria-hidden="true"></i></button>
                <button id='share'><i class="fa fa-share-alt" aria-hidden="true"></i></button>
                <button id='download'><i class="fa fa-arrow-circle-down" aria-hidden="true"></i></button>
            </div>
        </div>
        `
        artList.appendChild(artListItem)
        return {title: artItem.title, artist: artItem.artist_display, element: artListItem}
    });
}

/**
 * the following function fetches a searched item
 */

const searchArtItem = async function (searchValue) {
    let searchPath = `https://api.artic.edu/api/v1/artworks/search?q=${searchValue}&&fields=id`
    try {
        const response = await fetch(searchPath)
        const res = await response.json()
        return await fetchSearchedItems(res.data)
    } catch (error) {
        return console.error(error.message)
    }
}

const fetchSearchedItems = async function (response) {
    const artworkPromises = response.map(async element => {
        let apiPath = `https://api.artic.edu/api/v1/artworks/${element.id}`
        const res = await fetch(apiPath);
        const jsonData = await res.json();
        return jsonData.data;
    });

    const searchedItems = await Promise.all(artworkPromises)
    return renderSearchedArtItems(searchedItems)
}

function renderSearchedArtItems(searchedItems) {
    searchedItems.forEach(searchedItem => {
        let imageSrc = `https://www.artic.edu/iiif/2/${searchedItem.image_id}/full/843,/0/default.jpg`

        let artListItem = document.createElement('li')
        artListItem.className = `artListItem`
        artListItem.innerHTML = `
        <div class="art-item shadow">
            <img src='${imageSrc}' alt="${searchedItem.thumbnail.alt_text}" id="art-item-image">
            <h3 id="art-item-title">${searchedItem.title}</h3>
            <h4 id="art-item-artist-display">by: <span id='artist-name'>${searchedItem.artist_display}</span></h4>
        </div>
        `
        searchedArtList.appendChild(artListItem)
    });
};


// const searchArtItem = function (searchValue) {
//     let searchPath = `https://api.artic.edu/api/v1/artworks/search?q=${searchValue}&&fields=id`
//     return fetch(searchPath)
//     .then(response => response.json())
//     .then(res => {
//         console.log(res.data);
//         fetchSearchedItems(res.data)
//     })
//     .catch(error => console.error(error.message))
// }

// /**
//  * the following function fetches the searched items
//  */
// const fetchSearchedItems = function (response) {
//     response.forEach(element => {
//         let apiPath = `https://api.artic.edu/api/v1/artworks/${element.id}`
//         return fetch(apiPath)
//         .then(res => res.json())
//         .then(jsonData => {
//             // console.log(data);
//             renderSearchedArtItems(jsonData.data)
//         })
//     });
    
    
    
// }

// /**
//  * the following functionrenders the seached items
//  */

// function renderSearchedArtItems(searchedItems) {

//     let searchedArtList = document.querySelector('#searched-art-list')
//         console.log(searchedItems.title);
        
//         let imageSrc = `https://www.artic.edu/iiif/2/${searchedItems.image_id}/full/843,/0/default.jpg`

//         let artListItem = document.createElement('li')
//         artListItem.className = `artListItem`
//         artListItem.innerHTML = `
//         <div class="art-item shadow">
//             <img src='${imageSrc}' alt="${searchedItems.thumbnail.alt_text}" id="art-item-image">
//             <h3 id="art-item-title">${searchedItems.title}</h3>
//             <h4 id="art-item-artist-display">by: <span id='artist-name'>${searchedItems.artist_display}</span></h4>
//         </div>
//         `
//         searchedArtList.appendChild(artListItem)
        
//     };



// const myApi = 'https://api.artic.edu/api/v1/artworks?page=2&limit=50';
// const artList = document.querySelector('.art-list');
// const searchedArtList = document.querySelector('#searched-art-list');
// const form = document.querySelector('form');
// const input = document.querySelector('input');

// const fetchArtItems = async () => {
//   try {
//     const response = await fetch(myApi, {
//       headers: {
//         'Content-Type': 'application/json',
//         Accept: 'application/json',
//       },
//     });
//     const { data: artItems } = await response.json();
//     renderArtItems(artItems);
//   } catch (error) {
//     console.error(error.message);
//   }
// };

// const renderArtItems = (artItems) => {
//   const artElements = artItems.map((artItem) => {
//     const { title, image_id, thumbnail, artist_display } = artItem;
//     const imageSrc = `https://www.artic.edu/iiif/2/${image_id}/full/843,/0/default.jpg`;
//     const artListItem = document.createElement('li');
//     artListItem.className = `artListItem`;
//     artListItem.innerHTML = `
//         <div class="art-item shadow">
//             <img src='${imageSrc}' alt="${thumbnail.alt_text}" id="art-item-image">
//             <h3 id="art-item-title">${title}</h3>
//             <h4 id="art-item-artist-display">by: <span id='artist-name'>${artist_display}</span></h4>
//             <div class='buttons'>
//             <button id='like'>like</button>
//             <button id='share'>share</button>
//             <button id='download'>download</button>
//             </div>
//         </div>
//         `;
//     return { title, artist: artist_display, element: artListItem };
//   });
//   artList.append(...artElements.map((element) => element.element));
// };

// const searchArtItem = async (searchValue) => {
//   const searchPath = `https://api.artic.edu/api/v1/artworks/search?q=${searchValue}&&fields=id`;
//   try {
//     const response = await fetch(searchPath);
//     const { data: searchedItems } = await response.json();
//     const promises = searchedItems.map(async (element) => {
//       const apiPath = `https://api.artic.edu/api/v1/artworks/${element.id}`
//     }
//     )}
//     catch(error){
//         console.error(error.message);
//     }
// }

