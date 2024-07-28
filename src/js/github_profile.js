async function loadGithubCard() {
	try {
		 const response = await fetch('/.netlify/functions/fetchGithubUser');
		 if (!response.ok) {
			  throw new Error(`HTTP error! status: ${response.status}`);
		 }

		 const data = await response.json();
		 const { login, name, avatar_url } = data;

		 // Update card content
		 document.querySelector('.ava').href = `https://github.com/${login}`;
		 document.querySelector('.ava img').src = `${avatar_url}&s=60`;
		 document.querySelector('.ava img').alt = name;
		 document.querySelector('#name-head-1').textContent = `${name}`;
		 document.querySelector('#name-head-2').textContent = `(${login})`;
		 document.querySelector('#linky').href = `https://github.com/${login}`;
		 document.querySelector('#linky2').href = `https://github.com/${login}`;
	} catch (error) {
		 console.error('Error fetching user data:', error);
	}
}

document.addEventListener('DOMContentLoaded', loadGithubCard);