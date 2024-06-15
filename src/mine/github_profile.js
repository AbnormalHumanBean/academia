
function loadGithubCard() {
  const githubCardDivs = document.querySelectorAll('.github-card');
  githubCardDivs.forEach(cardDiv => {
    const githubUsername = cardDiv.getAttribute('data-github');
    const cardWidth = cardDiv.getAttribute('data-width');
    const cardHeight = cardDiv.getAttribute('data-height');
    const cardTheme = cardDiv.getAttribute('data-theme');

    const iframe = document.createElement('iframe');
    iframe.setAttribute('src', `mine/gh_pro.html?user=${githubUsername}&width=${cardWidth}&height=${cardHeight}&theme=${cardTheme}`);
    iframe.setAttribute('width', cardWidth);
    iframe.setAttribute('height', cardHeight);
    iframe.setAttribute('frameborder', '0');
    iframe.setAttribute('scrolling', 'no');

    cardDiv.appendChild(iframe);
  });
}

// Call the function when the page loads
window.onload = loadGithubCard;
