const cacheKey = `githubReposV2`;
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

function renderTableRows(tableBody, repos) {
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

function displayData(repoGroups) {
	const publicTableBody = document.getElementById('repoTableBody');
	const privateTableBody = document.getElementById('privateRepoTableBody');
	const privateSection = document.getElementById('privateReposSection');
	const privateMessage = document.getElementById('privateReposMessage');

	const publicRepos = Array.isArray(repoGroups) ? repoGroups : (repoGroups.publicRepos || []);
	const privateRepos = Array.isArray(repoGroups) ? [] : (repoGroups.privateRepos || []);
	const hasPrivateAccess = Array.isArray(repoGroups) ? false : Boolean(repoGroups.hasPrivateAccess);

	renderTableRows(publicTableBody, publicRepos);
	renderTableRows(privateTableBody, privateRepos);

	if (privateRepos.length > 0) {
		privateSection.hidden = false;
		privateMessage.textContent = 'Private repositories available through the Netlify GitHub token.';
	} else if (hasPrivateAccess) {
		privateSection.hidden = false;
		privateMessage.textContent = 'No private repositories were returned for this account.';
		privateTableBody.innerHTML = `
			<tr>
				<td colspan="8">No private repositories found.</td>
			</tr>
		`;
	} else {
		privateSection.hidden = false;
		privateMessage.textContent = 'Private repositories are unavailable here unless the Netlify GitHub token has permission to read them.';
		privateTableBody.innerHTML = `
			<tr>
				<td colspan="8">Private repositories are not available with the current Netlify token.</td>
			</tr>
		`;
	}
}

function displayError(message) {
	const publicTableBody = document.getElementById('repoTableBody');
	const privateTableBody = document.getElementById('privateRepoTableBody');
	publicTableBody.innerHTML = `
		<tr>
			<td colspan="8">Error fetching repositories: ${message}</td>
		</tr>
	`;
	privateTableBody.innerHTML = `
		<tr>
			<td colspan="8">Unable to load private repositories.</td>
		</tr>
	`;
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
			displayError(error.message);
		}
	}
});
