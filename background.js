const filter = {url:[{urlMatches:"https://www.google.com/*"},
                    {urlMatches:"https://www.bing.com/*"}]};

const unrequiredTransitionQualifiers = ["forward_back","server_redirect"];

chrome.webNavigation.onCommitted.addListener(function(details){
    var currentTransitionQualifiers = details.transitionQualifiers.filter(qualifier => unrequiredTransitionQualifiers.includes(qualifier));
    if(currentTransitionQualifiers.length === 0 && details.transitionType != "reload"){
        chrome.scripting.executeScript({
            target: { tabId: details.tabId },
            files: ['content.js']
        }).catch(error => {
            console.log(error);
        });
    }
},filter);

chrome.runtime.onMessage.addListener(
    async function(request, sender, sendResponse){
        if(request.message === "open_new_tab" && request.urls && request.urls.length > 0){
            const tabs = await chrome.tabs.query({currentWindow: true, active: true});
            
            if(!tabs || tabs.length === 0){
                console.error("No active tab found");
                return;
            }
            
            const currentTabIndex = tabs[0].index;
            const uniqueUrls = [...new Set(request.urls)].slice(0, 3);
            
            uniqueUrls.forEach((url, offset) => {
                chrome.tabs.create({index: currentTabIndex + 1 + offset, url: url, active: false});
            });
        }
    }
);
