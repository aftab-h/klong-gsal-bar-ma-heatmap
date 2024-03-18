
document.addEventListener('DOMContentLoaded', function () {
    const lsCorpusContainer = document.getElementById('ls-text');
    const tTextContainer = document.getElementById('t-text');
    const contextMenu = document.getElementById('customContextMenu');

    let citationUidMap = {};


    Promise.all([
        fetchAndLoadCSV('ls-corpus-test.csv', lsCorpusContainer),
        fetchAndLoadCSV('t-text-test.csv', tTextContainer)
    ]).then(() => {
        fetch('key.csv')
            .then(response => response.text())
            .then(csvData => {
                const keyData = parseCSV(csvData);
                keyData.forEach(row => {
                    const tTextCitation = row['Quote in T Text'];
                    if (!citationUidMap[tTextCitation]) {
                        citationUidMap[tTextCitation] = [];
                    }
                    citationUidMap[tTextCitation].push({
                        volume: row['Volume'],
                        textNo: row['Text No.'],
                        uid: row['UID']
                    });
                });
                highlightCitations(tTextContainer, citationUidMap); 

                // Move the event listener setup here, after highlighting
                tTextContainer.addEventListener('contextmenu', function (event) {
                    if (event.target.classList.contains('highlight-t')) {
                        event.preventDefault();
                        showContextMenu(event, citationUidMap[event.target.textContent] || []); // Ensure citations exist or default to empty
                    }
                });
            });
        // Hide the custom context menu when clicking elsewhere
        document.addEventListener('click', function () {
            contextMenu.style.display = 'none';
        });
    });




});


// Function to fetch and load CSV data into a container
function fetchAndLoadCSV(csvPath, container) {
    return fetch(csvPath)
        .then(response => response.text())
        .then(csvData => {
            // Set the inner HTML of the container with the CSV data
            container.innerHTML = csvData;
        });
}

function parseCSV(text) {
    const lines = text.split(/\r?\n/);
    const headers = lines.shift().split(',');
    return lines.map(line => {
        const data = line.split(',');
        return headers.reduce((obj, nextKey, index) => {
            obj[nextKey] = data[index];
            return obj;
        }, {});
    });
}

function highlightCitations(container, citationDataMap) {
    // Iterate through each citation data entry
    Object.entries(citationDataMap).forEach(([citationText, citationInfos]) => {
        // Properly escape the citation text for regex use
        const escapedCitation = citationText.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        const regex = new RegExp(`(${escapedCitation})`, 'g');

        // For each match in the container, replace with a highlighted version
        // that includes data attributes for all citation details.
        container.innerHTML = container.innerHTML.replace(regex, (match) => {
            // Construct a data attribute string with all citation info
            const dataAttributes = citationInfos.map((info, index) =>
                `data-volume${index}="${info.volume}" data-textno${index}="${info.textNo}" data-uid${index}="${info.uid}"`).join(' ');
            // Return the modified match with all data attributes
            return `<span class="highlight-t" ${dataAttributes}>${match}</span>`;
        });
    });

    // Now, all highlighted texts have data attributes for their citations.
    // You can use these attributes to show detailed citation info on interactions like right-click.
}

// Assuming citationUidMap is structured as:
// { "citationText": [{volume: "5", textNo: "4", uid: "9833"}, {...}, ...], ... }
// You can call highlightCitations like this:
// highlightCitations(tTextContainer, citationUidMap);


function showContextMenu(event, citations) {
    const contextMenu = document.getElementById('customContextMenu');
    contextMenu.innerHTML = ''; // Clear previous options
    citations.forEach(citation => {
        const menuItem = document.createElement('div');
        menuItem.textContent = `LS ${citation.volume}.${citation.textNo}`;
        menuItem.onclick = () => alert(`Go to LS ${citation.volume}.${citation.textNo}`); // Replace with actual navigation logic
        contextMenu.appendChild(menuItem);
    });

    contextMenu.style.top = `${event.pageY}px`;
    contextMenu.style.left = `${event.pageX}px`;
    contextMenu.style.display = 'block';
}



