document.addEventListener("DOMContentLoaded",(function(){const e="AbnormalHumanBean";fetch(`https://api.github.com/users/${e}`,{headers:{Authorization:"token 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"}}).then((e=>e.json())).then((t=>{const{login:n,name:o,avatar_url:r}=t;document.querySelector(".ava").href=`https://github.com/${n}`,document.querySelector(".ava img").src=`${r}&s=60`,document.querySelector(".ava img").alt=o,document.querySelector("#name-head-1").textContent=`${o}`,document.querySelector("#name-head-2").textContent=`(${e})`,document.querySelector("#linky").href=`https://github.com/${n}`,document.querySelector("#linky2").href=`https://github.com/${n}`})).catch((e=>console.error("Error fetching user data:",e)))}));