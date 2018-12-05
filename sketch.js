let search = 'https://en.wikipedia.org/w/api.php?action=opensearch&format=json&search=';
let content = 'https://en.wikipedia.org/w/api.php?action=query&prop=revisions&rvprop=content&format=json&titles=';
let userInput;

let scrapes = 7;
let termMeta = [];
let termTitle = [];
let termKeyWords = [];
let termContent = [];
let invalid = ["the", 'ref', 'com','a','of','in','and','url','code','to', 'that','www','title','web','http','https','name']

Array.prototype.contains = function(element){
    return this.indexOf(element) > -1;
};

function setup() {
  noCanvas();
  userInput = select('#userinput');
  searchTermMeta(userInput.value());
  userInput.changed(()=>{
    scrapes = 7;
    searchTermMeta(userInput.value());
  });
}

function searchTermMeta(term) {
  if (scrapes) {
    let url = search + term;
    let tempMeta = loadJSON(url, gotSearch, 'jsonp');
    termMeta.push(tempMeta)
  } else {
    // console.log(termMeta);
    // console.log(termTitle);
    // console.log(termKeyWords);
    // console.log(termContent);
  }
  scrapes--;

}

function gotSearch(data) {
  termKeyWords.push(data[0].toLowerCase())
  let len = data[1].length;
  let index = floor(random(len));
  let title = data[1][index];
  termTitle.push(title)
  createDiv("Key word:     " + data[0]);
  createDiv("Wiki Artical: " + title);
  createDiv("-----------------------");
  if(title)
  title = title.replace(/\s+/g, '_');
  let url = content + title;
  let tempContent = loadJSON(url, gotContent, 'jsonp');
}

function gotContent(data) {

  let page = data.query.pages;
  let pageId = Object.keys(data.query.pages)[0];
  let content = page[pageId].revisions[0]['*'];
  termContent.push(content)
  // createDiv(content);
  let wordCounts = { };
  let words = content.split(/\b/)
  // for (var i = 0; i < words.length; i++) {
  //   words[i] = words[i].toLowerCase()
  // }
  for (var i = words.length-1; i>=0; i--) {
    if (!words[i].toLowerCase().match(/[a-z]/i)) {
      words.splice(i,1)
    }
  }
  // console.log(words);
  for(var i = 0; i < words.length; i++)
  {
    wordCounts[words[i]] = (wordCounts[words[i]] || 0) + 1;
  }
  let mostUsedWord = "";
  let mostUsedCount = 0;
  for(var i = 0; i < words.length; i++)
  {
    if(wordCounts[words[i]] >= mostUsedCount && words[i].length >= 3 && !invalid.contains(words[i].toLowerCase()) && !termKeyWords.contains(words[i].toLowerCase())){
      mostUsedWord = words[i]
      mostUsedCount = wordCounts[words[i]]
    }
  }
  // console.log(wordCounts);
  // let wordRegex = /\b\w{4,}\b/g;
  // let word = content.match(wordRegex);
  // let wrd = random(word);
  searchTermMeta(mostUsedWord);
}
