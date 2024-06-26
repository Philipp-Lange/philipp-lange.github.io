const submitButton = document.getElementById('submit-button');
const namesInput = document.getElementById('name-input');
const searchTermInput = document.getElementById('search-term-input');

// current maximum number of words per google query
const googleMaxQueryLength = 32;


function checkInput() {
    if (namesInput.value === "") {
        namesInput.classList.add('invalid-input');
    } else {
        namesInput.classList.remove('invalid-input');
        generateLinks();
    }
}


function generateLinks() {
    let linksContainer = document.getElementById('links-container');
    linksContainer.innerHTML = "";
    let names = namesInput.value.split(/\r?\n/)
        .map(item => item.trim())
        .filter(item => item != "");

    // get longest name so we know how long we can make our search strings
    let longestName = 0;
    for (const name of names) {
        let words = name.split(" ");
        longestName = Math.max(longestName, words.length);
    }

    let searchStrings = [];
    generateSearchStrings(searchStrings, longestName);

    if (document.getElementById('list-with-quotes-switch').checked) {
        let listContainer = document.createElement('div');
        listContainer.classList.add('col');
        let listType = document.createElement('h4');
        listType.textContent = "List of Links With Quotation Marks"
        listContainer.appendChild(listType);
        generateLinksList("\"", listContainer, names, searchStrings);
        linksContainer.appendChild(listContainer);
    }

    if (document.getElementById('list-without-quotes-switch').checked) {
        let listContainer = document.createElement('div');
        listContainer.classList.add('col');
        let listType = document.createElement('h4');
        listType.textContent = "List of Links Without Quotation Marks"
        listContainer.appendChild(listType);
        generateLinksList("", listContainer, names, searchStrings);
        linksContainer.appendChild(listContainer);
    }
}

function generateLinksList(seperator, linksContainer, names, searchStrings) {
    for (let i = 0; i < names.length; i++) {
        let container = document.createElement('div');
        let name = document.createElement('h5');
        name.textContent = names[i];
        container.appendChild(name)

        let linksList = document.createElement('ul');

        for (let j = 0; j < searchStrings.length; j++) {
            let link = document.createElement('li');
            let linkAnchor = document.createElement('a');
            linkAnchor.setAttribute('target', '_blank');
            linkAnchor.textContent = "Link " + (j + 1);
            linkAnchor.href = buildURL(seperator + names[i] + seperator + searchStrings[j]);
            link.appendChild(linkAnchor);
            linksList.appendChild(link);
        }
        container.appendChild(linksList);

        linksContainer.appendChild(container);
    }
}

function generateSearchStrings(searchStrings, longestName) {
    let searchTerms = searchTermInput.value.split(';')
        .map(item => item.trim()).
        filter(item => item != "");
    while (searchTerms.length > 0) {
        let wordcount = longestName;

        let searchString = " AND ";
        wordcount++;

        while (searchTerms.length > 0 && wordcount <= googleMaxQueryLength) {
            let searchTerm = searchTerms.shift();
            searchString += searchTerm;
            wordcount += searchTerm.split(" ").length;

            if (searchTerms.length > 0 && wordcount <= googleMaxQueryLength) {
                searchString += " OR ";
            }
        }
        searchStrings.push(searchString);
    }

}

function buildURL(string) { return "https:///www.google.com/search?q=" + encodeURIComponent(string); }

document.getElementById('submit-button').addEventListener('click', (event) => checkInput());











