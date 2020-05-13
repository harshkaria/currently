// Async function for API call
// grabs the links from the database

// TODO: add current day as parameter?
'use strict';

const API_URL = `https://currentlydeployment.herokuapp.com/api/links`

// Returns a promise when complete
async function grabData()
{
    // Calls the api and populates `response` when done
    let response = await fetch(API_URL)
    // Waits for response to be populated and then converts it to JSON
    let data = await response.json();
    return data;
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
        // Populate the url and cqption rows
        var urlText = link["url"]
        var captionText = link["caption"]
        var titleText = link["title"]
        var urlClicks = link["clicks"]

        var urlElement = document.createElement('a')
        // Title element
        var titleElement = document.createTextNode(titleText)
        // Add the url
        urlElement.setAttribute('href', urlText)
        // Add the title to be clickable
        urlElement.appendChild(titleElement);
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

    // Grabs the data and then populates the table
    grabData().then((links, rej) => {
    if(rej) 
        return rej;
    //console.log(links)
    return links
    }).then((links) => {
        populateDom(links)
    })

    