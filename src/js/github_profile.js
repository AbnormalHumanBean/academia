function loadGithubCard() {
	const githubUsername = "AbnormalHumanBean";
	const githubToken = process.env.REACT_APP_GITHUB_TOKEN;
	// Fetch user data from GitHub API
	fetch(`https://api.github.com/users/${githubUsername}`, {
			headers: {
				'Authorization': `token ${githubToken}`
			}
		}).then(response => response.json())
		.then(data => {
			const {
				login,
				name,
				avatar_url,
			} = data;
			// Update card content
			document.querySelector('.ava').href = `https://github.com/${login}`;
			document.querySelector('.ava img').src = `${avatar_url}&s=60`;
			document.querySelector('.ava img').alt = name;
			document.querySelector('#name-head-1').textContent = `${name}`;
			document.querySelector('#name-head-2').textContent = `(${githubUsername})`;
			document.querySelector('#linky').href =
				`https://github.com/${login}`;
			document.querySelector('#linky2').href =
				`https://github.com/${login}`;
		})
		.catch(error => console.error('Error fetching user data:', error));
};
document.addEventListener('DOMContentLoaded', loadGithubCard);