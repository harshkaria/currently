// Async function for API call
// grabs the links from the database

// TODO: add current day as parameter?
'use strict';
var API_URL =  `http://localhost:3001/api/links`
const debug = false;
if(debug != true) 
    API_URL = "https://currentlydeployment.herokuapp.com/api/links"

// Returns a promise when complete
async function grabData()
{
    // Calls the api and populates `response` when done
    let response = await fetch(API_URL)
    // Waits for response to be populated and then converts it to JSON
    let data = await response.json();
    return data;
}
// Increments the click counter
// TO-DO: save to cookies
async function updateClick(url) {
    //console.log(url)
    // Call /api/link and JSON data
    let response = await fetch(API_URL, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify({"url": url})
    });
    // Wait for the result to be completed
    let result = await response.json();
    // Once result is populated, we return it
    return result;
}

// Click function
var clicked =  function(curr_url) {
    const url = curr_url;
    // We don't want redundant API calls
    if(url.indexOf('http://harshkaria.com') >= 0) {
        return;
    }
    else {
        console.log(`${url}`)
        updateClick(url).then((res, rej) => {
            if(rej) {
                console.log(rej)
            }
            console.log(res);
        });
    }
}

//Populates the table
function populateDom(links) {
    // Grab the table from the html file
    var table = document.getElementById("linksTable")
    // For each link we create a new row in the table
    links.forEach(link => {
        var row = table.insertRow()
        // Create the columns
        var urlData = row.insertCell(0)
        var captionData = row.insertCell(1)
        var clickData = row.insertCell(2);
        // Populate the url and caption rows
        var urlText = (link["short_link"] === undefined ? link['url'] : `http://harshkaria.com/` + link['short_link']); 
        var captionText = link["caption"]
        var titleText = link["title"]
        var urlClicks = link["clicks"]

        var urlElement = document.createElement('a')
        // Title element
        var titleElement = document.createTextNode(titleText)
        // Add the url
        urlElement.setAttribute('href', urlText)
        // New tab or window
        urlElement.setAttribute('target', '_blank')
        // Add the title to be clickable
        urlElement.appendChild(titleElement);
        // Add clicked URL
        urlElement.addEventListener("click", clicked.bind(this, urlText));
        // Add the caption element
        var captionElement = document.createTextNode(captionText)
        // Adds the click element
        var clickElement = document.createTextNode(urlClicks)
        // Add the text to the respective columns
        urlData.appendChild(urlElement)
        captionData.appendChild(captionElement)
        clickData.appendChild(clickElement)

    })
}

function grabUrl() {
    console.log(window.location.href)

}

grabUrl()

 // Grabs the data and then populates the table
 grabData().then((links, rej) => {
    if(rej) 
        return rej;
    //console.log(links)
    populateDom(links)
    });

    