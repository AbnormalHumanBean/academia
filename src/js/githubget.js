async function fetchData() {
    try {
        const response = await fetch('/.netlify/functions/fetchRepos');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const repoData = await response.json();
        displayData(repoData);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};