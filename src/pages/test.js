function replaceWordOnPage(oldWord, newWord) {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
    const textNodes = [];

    while (walker.nextNode()) {
      textNodes.push(walker.currentNode);
    }
    textNodes.forEach((textNode) => {
      if (textNode.nodeValue.includes(oldWord)) {
        textNode.nodeValue = textNode.nodeValue.replace(new RegExp(oldWord, 'g'), newWord);
      }
    });
  }
   


function replaceWordIfCountryPresent(countryName, wordToReplace, newWord) {
    const currentURL = window.location.href;
    console.log(currentURL)
    console.log(countryName, wordToReplace, newWord)
    if (currentURL.includes(countryName)) {
        console.log("found country")
        replaceWordOnPage(wordToReplace,newWord)
    }
}
