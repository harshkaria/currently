var doc = window.top.document
var url = ''
var title = ''
var API_URL = 'https://currentlydeployment.herokuapp.com/api/links'
function populateTabInfo(title, url) {
    // Grab the url element from the dom
    var urlElem = doc.getElementById("url-title")
    // Add a text node to put the url text in within the node
    var urlText = doc.createTextNode(title);
    // varr 
    // Add to the DOM
    urlElem.appendChild(urlText)
    // Log 
    console.log(title, url)
    // Store
    this.url = url
    this.title = title
}
// Upon error, we call this
function onError(err) {
    console.err(`Error: ${err}`)
}

// When the submit button is clicked, we call this to grab the current tab
function tabInfo() {
    console.log("clicked");
    // Returns a prromise containing info about the current tab, given the current parameters
    browser.tabs.query({active: true, windowId: browser.windows.WINDOW_ID_CURRENT})
    // With the array of tabs, we want to access the top 
        .then(tabs => {
            // Get the title and url property
            populateTabInfo(tabs[0].title, tabs[0].url)
        })
}
// Gather URL, title, as well as caption
function submitClicked() 
{
    var caption = doc.getElementById('caption')
    if(caption.length != 0 && url != "about:newtab") {
        // Make API call here
        // Data object to send in POST call
        var data = {
            url: url,
            title: title,
            caption: caption.value
        }
        // Make API call
        postLink(data).then((res, rej) => {
            if(rej) {
                console.err(rej)
            }
            console.log(res);
        })
        // Clear textarea 
        caption.innerHTML += '<b> hi </b>'
    }
}
// POST a link
async function postLink(data) {
    console.log(data)
    // Call /api/link and JSON data
    let response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(data)
    });
    // Wait for the result to be completed
    let result = await response.json();
    // Once result is populated, we return it
    return result;
}
// Gets the document ready
function populate() {
    console.log("Adding listeners")
    var submitElem = doc.getElementById("submitUrl")
    submitElem.addEventListener("click", submitClicked)
    // Get tab info
    tabInfo()
}

populate(); 