//My code goes here

const myApi = 'https://api.artic.edu/api/v1/artworks?page=2&limit=50';
const artList = document.querySelector('.art-list');
const searchedArtList = document.querySelector('#searched-art-list');
const form = document.querySelector('form');
const input = document.querySelector('input');



let isLiked = false

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
                <button class='like'><span id="like-icon"><i class="fa fa-thumbs-o-up" aria-hidden="true"></i></span></button>
                <button id='share'><i class="fa fa-share-alt" aria-hidden="true"></i></button>
                <a href="${imageSrc}" download = "art.jpg"id='download'><i class="fa fa-arrow-circle-down" aria-hidden="true"></i></a>
            </div>
        </div>
        `
        let likeBtn = artListItem.querySelector('.like')
        likeBtn.addEventListener('click', () => {
            console.log(`liked`);

            let likeIcon = likeBtn.querySelector('#like-icon')
            let count = 0
            if (!isLiked) {
                likeIcon.innerHTML = `<i class="fa fa-thumbs-up" aria-hidden="true"></i>`
                isLiked = true
                // isLiked = 
            }
            else {
                likeIcon.innerHTML = `<i class="fa fa-thumbs-o-up" aria-hidden="true"></i>`
                isLiked = false
            }
            // likeClick()
            
        })

        let downloadBtn = artListItem.querySelector('#download')
        downloadBtn.addEventListener('click', () => {
            console.log('success');
        })
        artList.appendChild(artListItem)
        // return {title: artItem.title, artist: artItem.artist_display, element: artListItem}
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

/**
 * The following function handles clicking like
 */
const download = function (data, name = "image.png") {
    const blob = new Blob([data], { type: "image/png"})

    const href = URL.createObjectURL(blob)

    const a = Object.assign(document.querySelector("#download"), {
        href,
        download: name,
    })
    URL.revokeObjectURL(href)
    return a
}

