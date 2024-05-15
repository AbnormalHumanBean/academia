import requests
from tabulate import tabulate
import base64
username = "abnormalhumanbean"
response = requests.get(f"https://api.github.com/users/{username}/repos")
repos = response.json()

repo_list = []
for repo in repos:
    repo_name = repo["name"]
    repo_url = repo["html_url"]
    language = repo["language"] if repo["language"] else "N/A"
    description = repo["description"] if repo["description"] else "No description"

    files_url = f"https://api.github.com/repos/{username}/{repo['name']}/contents"
    files_response = requests.get(files_url)
    if files_response.status_code == 200:
        files = [file["name"] for file in files_response.json()]
        files_str = ", ".join(files)
    else:
        files_str = "Unable to fetch files"

    repo_list.append([repo_name, language,description, repo_url, files_str])

print(tabulate(repo_list, headers=["Repository", "Language", "Description", "URL", "Files"]))