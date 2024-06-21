function loadGithubCard() {
	const githubUsername = "AbnormalHumanBean";
	const githubToken = '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'; // Replace with your personal access token
	// Update card dimensions
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
			document.querySelector('.avatar').href = `https://github.com/${login}`;
			document.querySelector('.avatar img').src = `${avatar_url}&s=60`;
			document.querySelector('.avatar img').alt = name;
			document.querySelector('#name-head-1').textContent = `${name}`;
			document.querySelector('#name-head-2').textContent = `(${githubUsername})`;
			document.querySelector('#linky').href =
				`https://github.com/${login}`;
		})
		.catch(error => console.error('Error fetching user data:', error));
};
document.addEventListener('DOMContentLoaded', loadGithubCard);