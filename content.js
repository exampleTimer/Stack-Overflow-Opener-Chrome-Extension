let links = document.getElementsByTagName("a");
const numLinks = links.length;
const soRegex = /https:\/\/stackoverflow\.com\/questions\/.+/;
const urls = [];

for(let index = 0; index < numLinks && urls.length < 8; index++){
    if(soRegex.test(links[index].href)){
        urls.push(links[index].href);
    }
}

chrome.runtime.sendMessage({"message":"open_new_tab", "urls":urls});