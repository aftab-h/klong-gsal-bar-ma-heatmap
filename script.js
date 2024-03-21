document.addEventListener('DOMContentLoaded', function () {
    const lsCorpusContainer = document.getElementById('ls-text');
    const tTextContainer = document.getElementById('t-text');
    const contextMenu = document.getElementById('customContextMenu');

    let keyData = []; // Define keyData at the top level to ensure wider scope

    // LOAD AND PARSE KEY.CSV

    // Load LS Corpus and T Text CSV files and process the data
    Promise.all([
        fetchAndLoadCSV('ls-corpus-test.csv', lsCorpusContainer),
        fetchAndLoadCSV('t-text-test.csv', tTextContainer)
    ]).then(() => {
        // Now that text is loaded, load key.csv and process the data
        fetch('key.csv')
            .then(response => response.text())
            .then(csvData => {
                keyData = parseCSV(csvData); // This updates the outer `keyData`
                console.log(keyData);

                // Store citation and UID mapping
                const citationUidMap = {};

                // Iterate through each row of the key data
                keyData.forEach(row => {
                    const lsCorpusCitation = row['Quote in LS'];
                    const tTextCitation = row['Quote in T Text'];
                    // const volume = row['Volume'];
                    // const textNo = row['Text No.'];
                    const uid = row['UID'];

                    // Highlight LS Corpus citation
                    highlightCitation(lsCorpusContainer, lsCorpusCitation, 'highlight-ls', uid);

                    // Store the mapping of LS Corpus citation to UID
                    citationUidMap[lsCorpusCitation] = uid;

                    // Highlight T Text citation
                    highlightCitation(tTextContainer, tTextCitation, 'highlight-t', uid);
                });
            })
            .catch(error => console.error('Error loading or processing key.csv:', error));
    }).catch(error => console.error('Error loading or processing CSVs:', error));


    // SET UP LISTENERS

    // Right click behavior (appear context menu)
    document.addEventListener('contextmenu', function (event) {
        event.preventDefault(); // Prevent the default context menu from showing

        contextMenu.style.top = `${event.pageY}px`;
        contextMenu.style.left = `${event.pageX}px`;
        contextMenu.style.display = 'block';

        const clickedElement = event.target; // Define clickedElement here

        // Check if clicked quote is highlighted
        if (clickedElement.classList.contains('highlight-t')) {
            const tTextCitationText = clickedElement.textContent;
            const citationDetails = findAllCorrespondingLSCitations(tTextCitationText, keyData);

            // Clear the context menu before adding new content
            contextMenu.innerHTML = '';

            // Check if there are matching entries and append their details to the context menu
            if (citationDetails.length > 0) {
                citationDetails.forEach(detail => {
                    const { volume, textNo, quoteInLS } = detail;
                    // Create a new div element for each citation detail
                    const detailElement = document.createElement('div');
                    detailElement.textContent = `Volume: ${volume}, Text No.: ${textNo}, Quote in LS: ${quoteInLS}`;
                    // Append the detail element to the context menu
                    contextMenu.appendChild(detailElement);
                });

                contextMenu.style.top = `${event.pageY}px`;
                contextMenu.style.left = `${event.pageX}px`;
                contextMenu.style.display = 'block';
            }
        }
    });

    // Left click behavior (hide menu)
    document.addEventListener('click', function () {
        // Hide the custom context menu when clicking elsewhere
        contextMenu.style.display = 'none';
    });

    // Click-Scroll functionality
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

    tTextContainer.addEventListener('click', function (event) {
        const clickedElement = event.target;
        if (clickedElement.classList.contains('highlight-t')) {
            // Retrieve the text content of the clicked T Text citation
            const tTextCitationText = clickedElement.textContent;

            // Debug print highlighted text
            console.log("You clicked on t text line: " + tTextCitationText);

            // Log all corresponding LS citations for this T Text citation
            findAllCorrespondingLSCitations(tTextCitationText, keyData);
        }
    });




});
















function findAllCorrespondingLSCitations(tTextCitationText, keyData) {
    // Filter the keyData for all entries with the matching T Text citation
    const matchingEntries = keyData.filter(row => row['Quote in T Text'] === tTextCitationText);

    // Log the citation details to console
    console.log(`LS Citations for T Text citation "${tTextCitationText}":`);
    matchingEntries.forEach(entry => {
        console.log(`Volume: ${entry['Volume']}, Text No.: ${entry['Text No.']}, Quote in LS: ${entry['Quote in LS']}`);
    });

    // Create an array to hold citation details (for printing to context menu)
    const citationDetails = matchingEntries.map(entry => {
        return {
            volume: entry['Volume'],
            textNo: entry['Text No.'],
            quoteInLS: entry['Quote in LS']
        };
    });

    return citationDetails;
}

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
}

// Function to append LS Corpus info to each T Text citation
function appendLSCorpusInfo(tTextContainer, citationUidMap, keyData) {
    const tTextCitations = tTextContainer.querySelectorAll('.highlight-t');
    tTextCitations.forEach(tTextCitation => {
        const citationText = tTextCitation.textContent;
        const uid = tTextCitation.getAttribute('data-uid');
        const matchingRow = keyData.find(row => row['UID'] === uid);
        if (matchingRow) {
            const volume = matchingRow['Volume'];
            const textNo = matchingRow['Text No.'];
            tTextCitation.textContent += ` (LS ${volume}.${textNo})`;
        }
    });
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
