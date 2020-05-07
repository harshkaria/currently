// Async function for API call
// grabs the links from the database
// TODO: add current day as parameter?

let globalLinks = []
async function grabData()
{
    let response = await fetch(`http://localhost:3001/api/links`)
    let data = await response.json();
    return data;
}
grabData().then((links, rej) => {
    if(rej) 
        return rej;
    populateDom(links);
    })

function populateDom(links) {
    var table = document.getElementById("linksTable")
    links.forEach(link => {
        var row = table.insertRow()
        var urlData = row.insertCell(0)
        var captionData = row.insertCell(1)
        var urlText = document.createTextNode(link["url"])
        var captionText = document.createTextNode(link["caption"])
        urlData.appendChild(urlText)
        captionData.appendChild(captionText)


    })
}
