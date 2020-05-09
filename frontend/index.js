// Async function for API call
// grabs the links from the database

// TODO: add current day as parameter?
'use strict';

// Returns a promise when complete
async function grabData()
{
    // Calls the api and populates `response` when done
    let response = await fetch(`http://localhost:3001/api/links`)
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
        // Populate the url and cqption rows
        var urlText = link["url"]
        var captionText = link["caption"]
        var urlElement = document.createElement('a')
        urlElement.setAttribute('href', urlText)
        urlElement.innerHTML = captionText;
        // Add the text to the respective columns
        urlData.appendChild(urlElement)
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

    