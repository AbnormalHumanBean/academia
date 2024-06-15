const username = 'abnormalhumanbean';
const token = '***REMOVED***';
const cacheDuration = 5 * 24 * 60 * 60 * 1000; // 5 days in milliseconds

const fetchData = () => {
    const key_user = `githubRepos_${username}`;
    const cachedUserData = JSON.parse(localStorage.getItem(key_user));
    if (cachedUserData && (Date.now() - cachedUserData.timestamp) < cacheDuration) {
        displayData(cachedUserData.data);
    } else {
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
                if (!Array.isArray(data)) {
                    throw new TypeError('Expected an array of repositories');
                }
                localStorage.setItem(key_user, JSON.stringify({
                    data,
                    timestamp: Date.now()
                }));
                displayData(data);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    };

    const displayData = (data) => {
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

            fetchCommits(repo);
            fetchFiles(repo);
        });
    };

    const fetchCommits = (repo) => {
        const key_repo = `githubCommits_${username}_${repo.name}`;
        const cachedCommits = JSON.parse(localStorage.getItem(key_repo));

        if (cachedCommits && (Date.now() - cachedCommits.timestamp) < cacheDuration) {
            displayCommits(cachedCommits.data, repo.name);
        } else {
            let page = 1;
            let totalCommits = 0;

            const fetchCommitsPage = () => {
                fetch(`https://api.github.com/repos/${username}/${repo.name}/commits?per_page=100&page=${page}`, {
                        headers: {
                            'Authorization': `token ${token}`
                        }
                    })
                    .then(response => response.json())
                    .then(commits => {
                        if (commits.length === 0) {
                            localStorage.setItem(key_repo, JSON.stringify({
                                data: totalCommits,
                                timestamp: Date.now()
                            }));
                            document.getElementById(`commitsSince_${repo.name}`).textContent = totalCommits;
                        } else {
                            totalCommits += commits.length;
                            page++;
                            fetchCommitsPage();
                        }
                    })
                    .catch(error => {
                        console.error('Error fetching commits:', error);
                        document.getElementById(`commitsSince_${repo.name}`).textContent = 'Unable to fetch commits';
                    });
            };

            fetchCommitsPage();

            fetch(`https://api.github.com/repos/${username}/${repo.name}/commits?per_page=100`, {
                    headers: {
                        'Authorization': `token ${token}`
                    }
                })
                .then(response => response.json())
                .then(commits => {
                    let lastCommitDate = commits.length > 0 ? new Date(commits[0].commit.author.date).toLocaleDateString('en-US') : 'No commits';
                    document.getElementById(`lastCommit_${repo.name}`).textContent = lastCommitDate;
                })
                .catch(error => {
                    console.error('Error fetching commits:', error);
                    document.getElementById(`lastCommit_${repo.name}`).textContent = 'Unable to fetch last commit';
                });
        }
    };

    const displayCommits = (commits, repoName) => {
        let lastCommitDate = commits.length > 0 ? new Date(commits[0].commit.author.date).toLocaleDateString('en-US') : 'No commits';
        document.getElementById(`lastCommit_${repoName}`).textContent = lastCommitDate;
        document.getElementById(`commitsSince_${repoName}`).textContent = commits.length;
    };
    const fetchFiles = (repo) => {
        const key_files = `githubFiles_${username}_${repo.name}`;
        const cachedFiles = JSON.parse(localStorage.getItem(key_files));

        if (cachedFiles && (Date.now() - cachedFiles.timestamp) < cacheDuration) {
            displayFiles(cachedFiles.data, repo.name);
        } else {
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
                    localStorage.setItem(key_files, JSON.stringify({
                        data: files,
                        timestamp: Date.now()
                    }));
                    displayFiles(files, repo.name);
                })
                .catch(error => {
                    console.error('Error fetching files:', error);
                    document.getElementById(`files_${repo.name}`).innerHTML = '<li>Unable to fetch files</li>';
                });
        }
    };
    const displayFiles = (files, repoName) => {
        let filesList = files.map(file => {
            if (file.type === 'dir') {
                return `<li><i class="fas fa-folder"></i> ${file.name}</li>`;
            } else if (file.type === 'file' && file.name.endsWith('.md')) {
                return `<li><i class="fab fa-markdown"></i> ${file.name}</li>`;
            } else if (file.type === 'file' && (file.name.endsWith('.Rmd') || file.name.endsWith('.Rproj'))) {
                return `<li><i class="fab fa-r-project"></i>${file.name}</li>`;
            } else {
                return `<li><i class="bi bi-file-earmark-code"></i>${file.name}</li>`;
            }
        }).join('');
        document.getElementById(`files_${repoName}`).innerHTML = filesList;
    };
};

fetchData();