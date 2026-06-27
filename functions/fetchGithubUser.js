exports.handler = async function(event, context) {
   const githubUsername = "AbnormalHumanBean";
   const githubToken = process.env.GITHUB_TOKEN;

   const headers = {
       'Accept': 'application/vnd.github+json',
       'User-Agent': 'academia-site'
   };

   if (githubToken) {
       headers['Authorization'] = `token ${githubToken}`;
   }

   try {
       const { default: fetch } = await import('node-fetch');
       const response = await fetch(`https://api.github.com/users/${githubUsername}`, {
           headers
       });

       if (!response.ok) {
           return {
               statusCode: response.status,
               body: JSON.stringify({ error: `HTTP error! status: ${response.status}` })
           };
       }

       const data = await response.json();
       return {
           statusCode: 200,
           body: JSON.stringify(data)
       };
   } catch (error) {
       return {
           statusCode: 500,
           body: JSON.stringify({ error: error.message })
       };
   }
};
