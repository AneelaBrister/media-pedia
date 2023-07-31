
export function isChrome(): boolean {
  return chrome && chrome.tabs ? true: false;
}

export function getCurrentTab(){
  return new Promise(function(resolve, reject){
    setTimeout(() => {
      chrome.tabs.query({
        active: true,               // Select active tabs
        lastFocusedWindow: true     // In the current window
      }, 
      function(tabs) {
        console.log('All tabs in background', tabs);
        resolve(tabs[0]);
      });
    }, 50);
  });
}
