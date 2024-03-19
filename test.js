document.addEventListener('DOMContentLoaded', function () {
    const lsCorpusContainer = document.getElementById('ls-text');
    const tTextContainer = document.getElementById('t-text');
    const contextMenu = document.getElementById('customContextMenu');

    // Context menu listner
    document.addEventListener('contextmenu', function (event) {
        event.preventDefault(); // Prevent the default context menu from showing

        contextMenu.style.top = `${event.pageY}px`;
        contextMenu.style.left = `${event.pageX}px`;
        contextMenu.style.display = 'block';
    });

    // Click hide listener
    document.addEventListener('click', function () {
        // Hide the custom context menu when clicking elsewhere
        contextMenu.style.display = 'none';
    });

    // Load LS Corpus and T Text CSV files and process the data
    Promise.all([
        fetchAndLoadCSV('ls-corpus-test.csv', lsCorpusContainer),
        fetchAndLoadCSV('t-text-test.csv', tTextContainer)
    ]).then(() => {
        // Now that text is loaded, load key.csv and process the data
        fetch('key.csv')
            .then(response => response.text())
            .then(csvData => {
                // Parse key csv data
                const keyData = parseCSV(csvData);

                // Store citation and UID mapping
                const citationUidMap = {};

                // Iterate through each row of the key data
                keyData.forEach(row => {
                    const lsCorpusCitation = row['Quote in LS'];
                    const tTextCitation = row['Quote in T Text'];
                    const volume = row['Volume'];
                    const textNo = row['Text No.'];
                    const uid = row['UID'];

                    // Highlight LS Corpus citation
                    highlightCitation(lsCorpusContainer, lsCorpusCitation, 'highlight-ls', uid);

                    // Store the mapping of LS Corpus citation to UID
                    citationUidMap[lsCorpusCitation] = uid;

                    // Highlight T Text citation
                    highlightCitation(tTextContainer, tTextCitation, 'highlight-t', uid);
                });

                // Add event listener for LS Corpus citations (for scroll-to-target)
                lsCorpusContainer.addEventListener('click', function (event) {
                    const clickedElement = event.target;
                    if (clickedElement.classList.contains('highlight-ls')) {
                        // Retrieve the associated UID
                        const lsCorpusCitation = clickedElement.textContent;
                        const uid = citationUidMap[lsCorpusCitation];
                        // Find the corresponding T Text citation
                        const tTextCitation = tTextContainer.querySelector(`[data-uid="${uid}"]`);
                        // Scroll to the T Text citation
                        if (tTextCitation) {
                            tTextCitation.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }
                    }
                });

                // Add event listener for right-click on T Text citations
                tTextContainer.addEventListener('contextmenu', function (event) {
                    event.preventDefault(); // Prevent default right-click behavior
                    const clickedElement = event.target;
                    if (clickedElement.classList.contains('highlight-t')) {
                        const dataUidsString = clickedElement.getAttribute('data-uids');  // Get the data-uids attribute
                        const uids = JSON.parse(dataUidsString);  // Parse the string back to an array of UIDs
                        showContextMenu(event, lsCorpusCitations);
                    }
                });
            })
            .catch(error => console.error('Error loading or processing key.csv:', error));
    }).catch(error => console.error('Error loading or processing CSVs:', error));
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

// Function to highlight citations in a container
function highlightCitation(container, citation, highlightClass, uid) {
    if (!container || !citation) return;

    // Properly escape the citation for regex use
    const escapedCitation = citation.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp(`(${escapedCitation})`, 'g');

    // Replace the matched citation text with highlighted version
    container.innerHTML = container.innerHTML.replace(regex, `<span class="${highlightClass}" data-uid="${uid}">$1</span>`);

    highlightedElement.setAttribute('data-uids', JSON.stringify(uids)); // Store array of UIDs as JSON string
}

// Function to get LS Corpus citations for a given UID
function getLSCorpusCitationsForUIDs(uids, keyData) {
    const allCitations = [];
    uids.forEach(uid => {
        const citations = keyData.filter(row => row['UID'] === uid)
            .map(row => `LS ${row['Volume']}.${row['Text No.']}`);
        allCitations.push(...citations);  // Spread operator to add retrieved citations to the allCitations array
    });
    return allCitations;
}

// Function to display the context menu with LS Corpus citations
function showContextMenu(event, citations) {
    const contextMenu = document.getElementById('customContextMenu');
    contextMenu.innerHTML = ''; // Clear previous options

    citations.forEach(citation => {
        const menuItem = document.createElement('div');
        menuItem.textContent = citation;
        menuItem.onclick = () => {
            // Logic to handle clicking on a specific LS Corpus citation within the menu
            console.log(`Clicked on LS Corpus citation: ${citation}`);
            // You can potentially implement functionality to highlight/scroll to that specific LS Corpus citation
        };
        contextMenu.appendChild(menuItem);
    });

    // Show the context menu
    contextMenu.style.top = `${event.pageY}px`;
    contextMenu.style.left = `${event.pageX}px`;
    contextMenu.style.display = 'block';
}

// Simple CSV parser function
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
