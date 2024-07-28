const { marked } = require('marked')
const username = 'abnormalhumanbean';
const token = process.env.REACT_APP_GITHUB_TOKEN;
const cacheKey = `githubRepos`;
const cacheDuration = 1000; // 5 days in milliseconds  5 * 24 * 60 * 60 *

async function fetchRequest(url, headers = {}) {
    const response = await fetch(url, { headers });
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
}

async function fetchTextRequest(url, headers = {}) {
    const response = await fetch(url, { headers });
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.text();
}

async function getCommitCount(repo) {
    try {
        console.log(`Fetching commit count for repo: ${repo}`);
        const commitsUrl = `https://api.github.com/repos/${username}/${repo}/commits?sha=main&per_page=1&page=1`;
        const response = await fetch(commitsUrl, {
            headers: {
                'Authorization': `token ${token}`
            }
        });

        if (!response.ok) {
            throw new Error(`GitHub API returned an error: ${response.statusText}`);
        }

        const linkHeader = response.headers.get('Link');
        if (!linkHeader) {
            console.log('No Link header found in the response');
            return 1; // If there's no Link header, assume only one page of commits
        }

        const lastPageLink = linkHeader.split(',').find(link => link.includes('rel="last"'));
        if (!lastPageLink) {
            console.log('No rel="last" link found in the Link header');
            return 1; // If there's no rel="last" link, assume only one page of commits
        }

        const pageCount = lastPageLink.match(/&page=(\d+)>/)[1];
        return parseInt(pageCount, 10);
    } catch (error) {
        console.error('Error fetching total commits:', error);
        return null;
    }
}

async function fetchData() {
    try {
        console.log(`Fetching repositories for user: ${username}`);
        const repos = await fetchRequest(`https://api.github.com/users/${username}/repos`, {
            'Authorization': `token ${token}`
        });

        const promises = repos.map(async repo => {
            const repoName = repo.name;
            console.log(`Processing repo: ${repoName}`);

            // Fetch last commit date
            const commits = await fetchRequest(`https://api.github.com/repos/${username}/${repoName}/commits?per_page=100`, {
                'Authorization': `token ${token}`
            });
            const lastCommitDate = commits.length > 0 ? new Date(commits[0].commit.author.date).toLocaleDateString('en-US') : 'No commits';
            console.log(`Last commit date for ${repoName}: ${lastCommitDate}`);

                // Fetch README
                let readmeText = '';
                try {
                    readmeText = await fetchTextRequest(`https://api.github.com/repos/${username}/${repoName}/readme`, {
                        'Authorization': `token ${token}`,
                        'Accept': 'application/vnd.github.v3.raw'
                    });
                } catch (error) {
                    console.error(`Error fetching README for ${repoName}:`, error);
                    readmeText = 'No README available';
                }
    
                const readmeHtml = marked(readmeText);

            // Fetch total commits
            const totalCommits = await getCommitCount(repoName);
            console.log(`Total commits for ${repoName}: ${totalCommits}`);

            return {
                name: repoName,
                html_url: repo.html_url,
                language: repo.language,
                lastCommitDate,
                totalCommits,
                description: repo.description,
                readmeHtml
            };
        });

        const repoData = await Promise.all(promises);
        console.log('Repository data fetched successfully:', repoData);

        localStorage.setItem(cacheKey, JSON.stringify({
            data: repoData,
            timestamp: Date.now()
        }));

        displayData(repoData);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

function displayData(data) {
    const tableBody = document.getElementById('repoTableBody');
    tableBody.innerHTML = ''; // Clear previous content

    data.forEach(repo => {
        const uniqueId = `repo_${repo.name.replace(/\s+/g, '_')}`;
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

const cachedData = JSON.parse(localStorage.getItem(cacheKey));
if (cachedData && (Date.now() - cachedData.timestamp) < cacheDuration) {
    console.log('Using cached data');
    displayData(cachedData.data);
} else {
    fetchData();
}
