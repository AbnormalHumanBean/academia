const username = 'abnormalhumanbean';
const token =
	'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';
const cacheKey = `githubRepos_${username}`;
const cacheDuration = 5 * 24 * 60 * 60 * 1000; // 5 days in milliseconds
function fetchData() {
	fetch(`https://api.github.com/users/${username}/repos`, {
			headers: {
				'Authorization': `token ${token}`
			}
		})
		.then(response => {
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			return response.json();
		})
		.then(data => {
			console.log('Fetched data:', data);
			debugger;
			if (!Array.isArray(data)) {
				throw new TypeError('Expected an array of repositories');
			}
			localStorage.setItem(cacheKey, JSON.stringify({
				data,
				timestamp: Date.now()
			}));
			displayData(data);
		})
		.catch(error => {
			console.error('Error fetching data:', error);
		});
}

function displayData(data) {
	let tableBody = document.getElementById('repoTableBody');
	tableBody.innerHTML = ''; // Clear previous content
	data.forEach(repo => {
		let lastUpdated = new Date(repo.updated_at).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
		let row = `<tr>
            <td style="font-weight: bold;">${repo.name}</td>
            <td>${repo.language ? repo.language : 'N/A'}</td>
            <td>${repo.description ? repo.description : 'No description'}</td>
            <td><a href="${repo.html_url}"> link </a></td>
            <td id="lastCommit_${repo.name}">Fetching last commit...</td>
            <td id="commitsSince_${repo.name}">Fetching commits...</td>
            <td><ul id="files_${repo.name}"></ul></td>
        </tr>`;
		tableBody.innerHTML += row;
		let page = 1;
		let totalCommits = 0;
		const fetchCommits = () => {
			fetch(
					`https://api.github.com/repos/${username}/${repo.name}/commits?per_page=100&page=${page}`, {
						headers: {
							'Authorization': `token ${token}`
						}
					})
				.then(response => response.json())
				.then(commits => {
					if (commits.length === 0) {
						// No more commits, update UI with total count
						document.getElementById(`commitsSince_${repo.name}`).textContent = totalCommits;
					} else {
						// Add commits to total count and fetch next page
						totalCommits += commits.length;
						page++;
						fetchCommits();
					}
				})
				.catch(error => {
					console.error('Error fetching commits:', error);
					document.getElementById(`commitsSince_${repo.name}`).textContent =
						'Unable to fetch commits';
				});
		};
		fetchCommits();
		fetch(`https://api.github.com/repos/${username}/${repo.name}/commits?per_page=100`, {
				headers: {
					'Authorization': `token ${token}`
				}
			})
			.then(response => response.json())
			.then(commits => {
				let lastCommitDate = commits.length > 0 ? new Date(commits[0].commit.author.date)
					.toLocaleDateString('en-US') : 'No commits';
				document.getElementById(`lastCommit_${repo.name}`).textContent = lastCommitDate;
			})
			.catch(error => {
				console.error('Error fetching commits:', error);
				document.getElementById(`lastCommit_${repo.name}`).textContent =
					'Unable to fetch last commit';
			});
		fetch(`https://api.github.com/repos/${username}/${repo.name}/contents`, {
				headers: {
					'Authorization': `token ${token}`
				}
			})
			.then(response => response.json())
			.then(files => {
				files.sort((a, b) => {
					if (a.type === 'dir' && b.type !== 'dir') {
						return -1; // Directory before file
					} else if (a.type !== 'dir' && b.type === 'dir') {
						return 1; // File after directory
					} else {
						return 0; // Maintain current order
					}
				});
				let filesList = files.map(file => {
					if (file.type === 'dir') {
						return `<li><i class="fas fa-folder"></i> ${file.name}</li>`;
					} else if (file.type === 'file' && file.name.endsWith('.md')) {
						return `<li><i class="fab fa-markdown"></i> ${file.name}</li>`;
					} else if (file.type === 'file' && (file.name.endsWith('.Rmd') || file.name.endsWith(
							'.Rproj'))) {
						return `<li><i class="fab fa-r-project"></i>${file.name}</li>`;
					} else {
						return `<li><i class="bi bi-file-earmark-code"></i>${file.name}</li>`;
					}
				}).join('');
				document.getElementById(`files_${repo.name}`).innerHTML = filesList;
			})
			.catch(error => {
				console.error('Error fetching files:', error);
				document.getElementById(`files_${repo.name}`).innerHTML = '<li>Unable to fetch files</li>';
			});
	}, );
};
const cachedData = JSON.parse(localStorage.getItem(cacheKey));
if (cachedData && (Date.now() - cachedData.timestamp) < cacheDuration) {
	displayData(cachedData.data);
} else {
	fetchData();
};
