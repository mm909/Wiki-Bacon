let search = 'https://en.wikipedia.org/w/api.php?action=opensearch&format=json&search=';
let content = 'https://en.wikipedia.org/w/api.php?action=query&prop=revisions&rvprop=content&format=json&titles=';
let invalid = [
  'the',
  'ref',
  'com',
  'a',
  'of',
  'in',
  'and',
  'url',
  'code',
  'to',
  'that',
  'www',
  'title',
  'web',
  'http',
  'https',
  'name',
  'for'
]

let userInput;
let counter;

let scrapeNumber = 6;
let scrapes = scrapeNumber;

let termMeta = [];
let termTitle = [];
let termKeyWords = [];
let termContent = [];

Array.prototype.contains = function(element) {
  return this.indexOf(element) > -1;
};

function setup() {
  noCanvas();
  userInput = select('#userinput');
  counter = select('#counter');
  searchTermMeta(userInput.value());
  userInput.changed(() => {
    scrapes = scrapeNumber;
    searchTermMeta(userInput.value());
  });
}

function go(term) {
  if(scrapes == -1){
    scrapes = scrapeNumber;
    termMeta = [];
    termTitle = [];
    termKeyWords = [];
    termContent = [];
    let o = select('#output');
    if(o){
      o.remove()
    }
    searchTermMeta(userInput.value());
  }

}

function searchTermMeta(term) {
  if (scrapes) {
    let url = search + term;
    let tempMeta = loadJSON(url, gotSearch, 'jsonp');
    termMeta.push(tempMeta)
  } else {
    console.log("Meta");
    console.log(termMeta);
    // console.log("KeyWords");
    // console.log(termKeyWords);
    console.log("Title");
    console.log(termTitle);
    console.log("Content");
    console.log(termContent);

    let contentForDiv = "";
    for (var i = 0; i < termMeta.length; i++) {
      contentForDiv+="Key word:     <strong>" + termKeyWords[i] + "</strong> <br> Wiki Artical: " + termTitle[i] + "<br><br>"
    }
    let output = createDiv(contentForDiv)
    output.id('output')
  }
  scrapes--;
}

function gotSearch(data) {
  // console.log(counter.html());
  counter.html(scrapeNumber-scrapes + "/" + scrapeNumber)
  termKeyWords.push(data[0].toLowerCase())
  let title = data[1][floor(random(data[1].length))];
  termTitle.push(title)

  if (title)
    title = title.replace(/\s+/g, '_');
  let url = content + title;
  let tempContent = loadJSON(url, gotContent, 'jsonp');
}

function gotContent(data) {
  let pageId = Object.keys(data.query.pages)[0];
  let content = data.query.pages[pageId].revisions[0]['*'];
  termContent.push(content)
  let wordCounts = {};
  let words = content.split(/\b/)
  for (var i = words.length - 1; i >= 0; i--) {
    if (!words[i].toLowerCase().match(/[a-z]/i)) {
      words.splice(i, 1)
    }
  }
  for (var i = 0; i < words.length; i++) {
    wordCounts[words[i]] = (wordCounts[words[i]] || 0) + 1;
  }
  let topX = [];
  let mostUsedWord = "";
  let mostUsedCount = 0;
  for (var i = 0; i < words.length; i++) {
    if (
      wordCounts[words[i]] >= mostUsedCount &&
      words[i].length >= 3 &&
      !invalid.contains(words[i].toLowerCase()) &&
      !termKeyWords.contains(words[i].toLowerCase())
    ) {
      mostUsedWord = words[i]
      mostUsedCount = wordCounts[words[i]]
      topX.push(words[i])
    }
  }
  searchTermMeta(mostUsedWord);
  // searchTermMeta(random(words));
}
