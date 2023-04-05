//My code goes here
const myApi = 'https://api.artic.edu/api/v1/artworks?page=2&limit=50'
document.addEventListener('DOMContentLoaded', (e) => {
    e.preventDefault()
    fetchArtItems()
})

/**
 * The following function fetches art items from my api
 */
const fetchArtItems = function () {
    return fetch(myApi, {
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
        }
    })
    .then(response => response.json())
    .then(artItems => renderArtItems(artItems.data))
    .catch(error => console.error(error.message))
}

/**
 * The following function takes an argument of artItems fetched above
 * and works on rendering them.
 * 
 */

const renderArtItems = function (artItems) {
    let artList = document.querySelector('.art-list')
    artItems.forEach(artItem => {
        console.log(artItem.image_id);
        //https://api.artic.edu/api/v1/artworks/27992?fields=id,title,image_id
        let imageSrc = `https://www.artic.edu/iiif/2/${artItem.image_id}/full/843,/0/default.jpg`

        let artListItem = document.createElement('li')
        artListItem.innerHTML = `
        <div class="art-item shadow">
            <img src = '${imageSrc}' alt="${artItem.thumbnail.alt_text}" id="art-item-image">
            <h3 id="art-item-title">${artItem.title}</h3>
            <h4 id="art-item-artist-display">by: <span id = 'artist-name'>${artItem.artist_display}</span></h4>
        </div>
        `
        artList.appendChild(artListItem)
    });
}