const fetch = require('node-fetch');
const { marked } = require('marked');

const username = 'abnormalhumanbean';
const token = process.env.GITHUB_TOKEN;

async function fetchRequest(url, headers = {}) {
   const { default: fetch } = await import('node-fetch');
   const response = await fetch(url, { headers });
   if (!response.ok) {
       throw new Error(`HTTP error! status: ${response.status}`);
   }
   return response.json();
}

async function fetchTextRequest(url, headers = {}) {
   const { default: fetch } = await import('node-fetch');
   const response = await fetch(url, { headers });
   if (!response.ok) {
       throw new Error(`HTTP error! status: ${response.status}`);
   }
   return response.text();
}

exports.handler = async function(event, context) {
   try {
       const repos = await fetchRequest(`https://api.github.com/users/${username}/repos`, {
           'Authorization': `token ${token}`
       });

       const promises = repos.map(async repo => {
           const repoName = repo.name;

           // Fetch last commit date
           const commits = await fetchRequest(`https://api.github.com/repos/${username}/${repoName}/commits?per_page=100`, {
               'Authorization': `token ${token}`
           });
           const lastCommitDate = commits.length > 0 ? new Date(commits[0].commit.author.date).toLocaleDateString('en-US') : 'No commits';

           // Fetch README
           let readmeText = '';
           try {
               readmeText = await fetchTextRequest(`https://api.github.com/repos/${username}/${repoName}/readme`, {
                   'Authorization': `token ${token}`,
                   'Accept': 'application/vnd.github.v3.raw'
               });
           } catch (error) {
               readmeText = 'No README available';
           }

           const readmeHtml = marked(readmeText);
           return {
            name: repoName,
            html_url: repo.html_url,
            language: repo.language,
            lastCommitDate,
            totalCommits: commits.length,
            description: repo.description,
            readmeHtml
        };
    });

    const repoData = await Promise.all(promises);

    return {
        statusCode: 200,
        body: JSON.stringify(repoData)
    };
} catch (error) {
    return {
        statusCode: 500,
        body: JSON.stringify({ error: error.message })
    };
}
};
