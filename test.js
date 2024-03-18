document.addEventListener('DOMContentLoaded', function() {
    const lsCorpusContainer = document.getElementById('ls-text');
    const tTextContainer = document.getElementById('t-text');
    const contextMenu = document.getElementById('customContextMenu');

    let citationUidMap = {}; // Maps T text lines to arrays of citation details

    // Assuming fetchAndLoadCSV and parseCSV are implemented
    Promise.all([
        fetchAndLoadCSV('key.csv').then(csvData => {
            let keyData = parseCSV(csvData);
            // Process keyData to populate citationUidMap
            keyData.forEach(row => {
                let tTextCitation = row['Quote in T Text'];
                if (!citationUidMap[tTextCitation]) {
                    citationUidMap[tTextCitation] = [];
                }
                citationUidMap[tTextCitation].push({
                    volume: row['Volume'],
                    textNo: row['Text No.'],
                    uid: row['UID']
                });
            });
        }),
        // Load T text and LS corpus CSVs as needed
    ]).then(() => {
        // Setup your highlighting and click listeners here, using citationUidMap
    });

    tTextContainer.addEventListener('contextmenu', event => {
        if (event.target.classList.contains('highlight-t')) {
            event.preventDefault(); // Prevent the default context menu
            showContextMenu(event, citationUidMap[event.target.textContent]);
        }
    });

    document.addEventListener('click', () => contextMenu.style.display = 'none');
});

function showContextMenu(event, citations) {
    // Position and populate the context menu based on citations array
    const contextMenu = document.getElementById('customContextMenu');
    contextMenu.innerHTML = ''; // Clear existing content
    citations.forEach(citation => {
        let menuItem = document.createElement('div');
        menuItem.textContent = `LS ${citation.volume}.${citation.textNo}`;
        menuItem.onclick = () => navigateToLSCorpus(citation.uid);
        contextMenu.appendChild(menuItem);
    });
    contextMenu.style.top = `${event.pageY}px`;
    contextMenu.style.left = `${event.pageX}px`;
    contextMenu.style.display = 'block';
}

function navigateToLSCorpus(uid) {
    // Logic to scroll to the LS corpus citation based on UID
}
