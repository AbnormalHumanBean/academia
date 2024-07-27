
// If your plugin is direct dependent to the html webpack plugin:
const HtmlWebpackPlugin = require("html-webpack-plugin");
// If your plugin is using html-webpack-plugin as an optional dependency
// you can use https://github.com/tallesl/node-safe-require instead:
const stylesheets = ['<link rel="preconnect" href="https://rsms.me/"><link rel="stylesheet" href="https://rsms.me/inter/inter.css"><script defer src="https://kit.fontawesome.com/33332c4d45.js" crossorigin="anonymous"></script>']
const nav = ['<nav class="navbar fixed-top navbar-expand-sm bg-body bg-nav sp-navbar"> <a class="navbar-brand" href="#"> <img src="images/icon2.png" alt="the letter i with the letter p" width="35" height="35" /> </a> <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation"> <span class="navbar-toggler-icon"></span> </button> <div class="collapse navbar-collapse" id="navbarSupportedContent"> <ul class="navbar-nav me-auto mb-2 mb-lg-0"> <li class="nav-item"> <a class="nav-link active" aria-current="page" href="index.html">Welcome</a> </li> <li class="nav-item"> <a class="nav-link" href="about.html">About</a> </li> <li class="nav-item"> <a class="nav-link" href="research.html">Research</a> </li> <li class="nav-item dropdown"> <div class="btn-group"> <a id="teach" class="split-nav-a dropdown-link nav-link" href="teaching.html">Teaching</a> <a class="split-nav-b dropdown-toggle dropdown-toggle-split nav-link" href="#" id="teach" role="button" data-bs-toggle="dropdown" aria-expanded="false"> </a> <ul class="dropdown-menu"> <li><a class="dropdown-item" href="teaching_tools.html">Tools & Examples</a></li> </ul> </div> </li> <li class="nav-item dropdown"> <a class="nav-link dropdown-toggle dropdown-link px-0 px-lg-2" href="#" id="code" role="button" data-bs-toggle="dropdown" aria-expanded="false"> CodeBox </a> <ul class="dropdown-menu"> <li><a class="dropdown-item" href="coding_show.html">Show Coding</a></li> <li><a class="dropdown-item" href="coding_explain.html">Explain Coding</a></li> </ul> </li> </ul> <ul class="navbar-nav ms-0 me-1"> <li class="nav-item"> <a class="nav-link" href="connect.html">Connect</a> <li class="nav-item"> <a class="nav-link" href="cv.html">CV</a> </li> <li class="nav-item py-2 px-1"> <div class="vr h-100 d-flex opacity-75 text-primary"> </div> </li> <li class="nav-item dropdown"> <a href="#" class="nav-link px-0 px-lg-2 dropdown-toggle d-flex align-items-center show" id="bd-color-mode" data-bs-toggle="dropdown" aria-expanded="false" data-bs-display="static" data-bs-toggle="tooltip" title="Toggle color mode"> <span class="d-light"> <i class="bi bi-brightness-high-fill"></i> </span> <span class="d-dark"> <i class="bi bi-moon-stars-fill"></i> </span> <span class="d-auto"> <i class="bi bi-circle-half"></i> </span> </a> <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="bd-color-mode" style="--bs-dropdown-min-width: 6rem;" data-bs-popper="static"> <li> <button type="button" class="dropdown-item d-flex align-items-center" data-bs-theme-value="light" aria-pressed="false"> <i class="bi bi-brightness-high-fill"></i> <span class="ms-2">Light</span> </button> </li> <li> <button type="button" class="dropdown-item d-flex align-items-center" data-bs-theme-value="dark" aria-pressed="false"> <i class="bi bi-moon-stars-fill"></i> <span class="ms-2">Dark</span> </button> </li> <li> <button type="button" class="dropdown-item d-flex align-items-center" data-bs-theme-value="auto" aria-pressed="true"> <i class="bi bi-circle-half"></i> <span class="ms-2">Auto</span> </button> </li> </ul> </li> </ul> </div> </nav>'];

class nav_inject {
    apply(compiler) {
      compiler.hooks.compilation.tap("nav_inject", (compilation) => {
        console.log("The compiler is starting a new compilation...");
        HtmlWebpackPlugin.getHooks(compilation).beforeEmit.tapAsync(
            'nav_inject',
            (data, cb) => { if (data.html.includes("this_one")) {
                data.html = data.html
                console.log("The html has a canvas")
            }
            else {
                data.html = data.html.replace(
                    "</head>",
                    stylesheets.join("\n") + "\n</head>" + "\n<body>" + nav.join("\n")
                )}
                cb(null, data);
            }
        );
    });
}};

module.exports = nav_inject;