var doc = window.top.document
function getTab(title, url) {
    // Grab the url element from the dom
    var urlElem = doc.getElementById("url-title")
    // Add a text node to put the url text in within the node
    var urlText = doc.createTextNode(title);
    // Add to the DOM
    urlElem.appendChild(urlText)
    // Log 
    console.log(title, url)
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
            getTab(tabs[0].title, tabs[0].url)
        })
}
// Gather URL, title, as well as caption
function submitClicked() 
{
    var caption = doc.getElementById('caption').value
    if(caption.length != 0) 
        console.log(caption)
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