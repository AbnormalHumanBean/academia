const username = 'AbnormalHumanBean';
const token = process.env.GITHUB_TOKEN;

function buildGithubHeaders(extraHeaders = {}) {
   const headers = {
       'Accept': 'application/vnd.github+json',
       'User-Agent': 'academia-site',
       ...extraHeaders
   };

   if (token) {
       headers['Authorization'] = `token ${token}`;
   }

   return headers;
}

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

async function renderMarkdown(markdownText) {
   const { marked } = await import('marked');
   return marked(markdownText);
}

exports.handler = async function(event, context) {
   try {
       const repos = await fetchRequest(
           `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`,
           buildGithubHeaders()
       );

       const promises = repos.map(async repo => {
           const repoName = repo.name;
           let lastCommitDate = repo.pushed_at
               ? new Date(repo.pushed_at).toLocaleDateString('en-US')
               : 'Unknown';
           let totalCommits = 'Unavailable';

           try {
               const commits = await fetchRequest(
                   `https://api.github.com/repos/${username}/${repoName}/commits?per_page=100`,
                   buildGithubHeaders()
               );
               if (commits.length > 0) {
                   lastCommitDate = new Date(commits[0].commit.author.date).toLocaleDateString('en-US');
               }
               totalCommits = commits.length;
           } catch (error) {
               // Some repos can return 409/404 here; keep the page working instead of failing the whole function.
           }

           // Fetch README
           let readmeText = '';
           try {
               readmeText = await fetchTextRequest(
                   `https://api.github.com/repos/${username}/${repoName}/readme`,
                   buildGithubHeaders({
                       'Accept': 'application/vnd.github.v3.raw'
                   })
               );
           } catch (error) {
               readmeText = 'No README available';
           }

           const readmeHtml = await renderMarkdown(readmeText);
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
