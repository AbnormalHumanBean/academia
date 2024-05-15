const username = 'abnormalhumanbean';

fetch(`https://api.github.com/users/${username}/repos`)
    .then(response => response.json())
    .then(data => {
        let tableBody = document.getElementById('repoTableBody');
        data.forEach(repo => {
            let row = `<tr>
                <td>${repo.name}</td>
                <td>${repo.language ? repo.language : 'N/A'}</td>
                <td>${repo.description ? repo.description : 'No description'}</td>
                <td><a href="${repo.html_url}">${repo.html_url}</a></td>
                <td id="files_${repo.name}">Fetching files...</td>
            </tr>`;
            tableBody.innerHTML += row;

            fetch(`https://api.github.com/repos/${username}/${repo.name}/contents`)
                .then(response => response.json())
                .then(files => {
                    let filesList = files.map(file => file.name).join(', ');
                    document.getElementById(`files_${repo.name}`).textContent = filesList;
                })
                .catch(error => {
                    console.error('Error fetching files:', error);
                    document.getElementById(`files_${repo.name}`).textContent = 'Unable to fetch files';
                });
        });
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });