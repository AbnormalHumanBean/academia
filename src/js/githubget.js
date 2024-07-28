const cacheKey = `githubRepos`;
const cacheDuration = 5 * 24 * 60 * 60 * 1000; // 5 days in milliseconds

async function fetchRepos() {
    try {
        const response = await fetch('/.netlify/functions/fetchRepos');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    } catch (error) {
        console.error('Error fetching repositories:', error);
        throw error;
    }
}

function displayData(repos) {
    const tableBody = document.getElementById('repos');
    tableBody.innerHTML = ''; // Clear any existing content

    repos.forEach((repo, index) => {
        const uniqueId = index; // Unique ID based on index
        const row = `
            <tr>
                <td style="font-weight: bold;">${repo.name}</td>
                <td><a href="${repo.html_url}">link</a></td>
                <td>${repo.language ? repo.language : 'N/A'}</td>
                <td id="lastCommit_${uniqueId}">${repo.lastCommitDate}</td>
                <td id="commitsSince_${uniqueId}">${repo.totalCommits}</td>
                <td>${repo.description ? repo.description : 'No description'}</td>
                <td class="readme" id="readme_${uniqueId}"><div>${repo.readmeHtml}</div></td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });
}

document.addEventListener('DOMContentLoaded', async () => {
    const cachedData = JSON.parse(localStorage.getItem(cacheKey));
    const cacheTimestamp = localStorage.getItem(`${cacheKey}_timestamp`);

    if (cachedData && cacheTimestamp && (Date.now() - cacheTimestamp < cacheDuration)) {
        console.log('Using cached data');
        displayData(cachedData);
    } else {
        try {
            const repos = await fetchRepos();
            localStorage.setItem(cacheKey, JSON.stringify(repos));
            localStorage.setItem(`${cacheKey}_timestamp`, Date.now());
            displayData(repos);
        } catch (error) {
            document.getElementById('repos').innerHTML = `<p>Error fetching repositories: ${error.message}</p>`;
        }
    }
});