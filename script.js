const toggleBtn = {
  toggleSelector: document.querySelector(".theme"),
  toggleSpan: document.querySelector(".theme span"),
};

const prefersColorScheme = window.matchMedia("(prefers-color-scheme: dark)");
const userLocalStorage = window.localStorage.getItem("theme");
const userPrefersDark = window.matchMedia && prefersColorScheme.matches;

const toggleTheme = (state, handlerEvent) => {
  if (state) {
    document.body.className = "dark";
    toggleBtn.toggleSpan.textContent = "light";
  } else {
    document.body.className = "light";
    toggleBtn.toggleSpan.textContent = "dark";
  }
};

if (userLocalStorage) {
  toggleTheme(userLocalStorage === "dark");
} else {
  toggleTheme(userPrefersDark);
}

if (!userLocalStorage) {
  prefersColorScheme.addEventListener("change", (e) => {
    toggleTheme(e.matches);
  });
}

toggleBtn.toggleSelector.addEventListener("click", () => {
  toggleTheme(document.body.className === "light", true);
});

const API_URL = "https://api.github.com/users/";

const form = document.getElementById("form");
const main = document.getElementById("main");
const search = document.getElementById("search-input");

getUser("octocat");

async function getUser(username) {
  try {
    const { data } = await axios(API_URL + username);

    userCardContent(data);
  } catch (err) {
    if (err.response.status == 404) {
      createErrorMsg("No results");
    }
  }
}

function userCardContent(user) {
  const cardHTML = `
  <div class="card">
        <figure>
          <img src="${user.avatar_url}" alt=""/>
        </figure>
        <div>
          <h2 class="user-full-name">${user.name ? user.name : user.login}</h2>
          <p class="user-name">@${user.login}</p>
          <p class="user-bio">
          ${user.bio ? user.bio : "This profile has no bio"}
          </p>
          <ul class="user-stats">
            <li>Repos<strong>${user.public_repos}</strong></li>
            <li>Followers<strong>${user.followers}</strong></li>
            <li>Following<strong>${user.following}</strong></li>
          </ul>
          <ul class="user-links">
            <li>
              <img
                src="assets/icon-location.svg"
                alt="icon-location"/>
                ${
                  user.location
                    ? user.location
                    : "<span class='text-disabled'>Not Available</span>"
                }
            </li>
            <li class="twitter-icon">
              <img
                src="assets/icon-twitter.svg"
                alt="icon-twitter"/>
                ${
                  user.twitter_username
                    ? user.twitter_username
                    : "<span class='text-disabled'>Not Available</span>"
                }
            </li>
            <li class="user-website">
              <img
                src="assets/icon-website.svg"
                alt="icon-website"/>
              <a href="${
                user.html_url
                  ? user.html_url
                  : "<span class='text-disabled'>Not Available</span>"
              }">Website</a>
            </li>
            <li class="company-icon">
              <img
                src="assets/icon-company.svg"
                alt="icon-company"/>
                ${
                  user.company
                    ? user.company
                    : "<span class='text-disabled'>Not Available</span>"
                }
            </li>
          </ul>
        </div>
      </div>
  `;
  main.innerHTML = cardHTML;
}

function createErrorMsg(msg) {
  const cardHTML = `
      <span id="error" class="error">${msg}</span>
    `;

  main.innerHTML = cardHTML;
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const user = search.value;

  if (user) {
    getUser(user);

    search.value = "";
  }
});
