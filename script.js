"use strict";
const section2 = document.querySelector(".section2");
const section1 = document.querySelector(".section1");

const separate = document.querySelector(".separate");
const container = document.querySelector(".container");
const input = document.querySelector("input");
const dropdown = document.querySelector("select");

const loader = document.querySelector(".loader");
const modeDark = document.querySelector(".modeDark");
const body = document.querySelector("body");

const head = document.querySelector(".head");
const modeLight = document.querySelector(".modeLight");

//Event Listners

window.addEventListener("DOMContentLoaded", () => initial());
modeDark.addEventListener("click", function (e) {
  modeLight.classList.remove("hidden");
  modeDark.classList.add("hidden");
  body.classList.add("darky");
});

modeLight.addEventListener("click", function (e) {
  modeLight.classList.add("hidden");
  modeDark.classList.remove("hidden");
  body.classList.remove("darky");
});

async function getCountry(a, b, c) {
  try {
    let response;
    loader.classList.remove("hidden");

    response = await fetch("https://restcountries.com/v2/all");

    if (a) response = await fetch(`https://restcountries.com/v2/name/${a}`);

    if (b) response = await fetch(`https://restcountries.com/v2/alpha/${b}`);

    if (c)
      response = await fetch(
        `https://restcountries.com/v2/name/${c}?fullText=true`
      );

    const data = await response.json();

    loader.classList.add("hidden");
    if (data.status === 404) throw new Error("Country Not Found");
    // console.log(data);
    return data;
  } catch (err) {
    alert(err.message);
  }
}

//Functions
async function initial(n, c) {
  // console.log(n,c);
  const data = await getCountry(n, c);
  data.forEach((ele) => {
    displayCountry(ele);
  });
}

function displayCountry(ele) {
  const html = `  <div class="country">
        <img src="${ele.flags.png}" class="flag">
          <div class="info">
              <div class="name">${
                ele.name.common ? ele.name.common : ele.name
              }</div>
              <div class="details">
                  <div class="nation">Population: <span class="pop col">${
                    ele.population
                  }</span></div>
                  <div class="nation">Region: <span class="region col">${
                    ele.region
                  }</span></div>
                  <div class="nation">Capital: <span class="cap col">${
                    ele.capital ? ele.capital : "No Capital"
                  }</span></div>
              </div>
          </div>
      </div>`;
  section2.insertAdjacentHTML("beforeend", html);
}
window.addEventListener("keydown", async function (e) {
  if (e.key === "Enter") {
    section2.innerHTML = "";
    initial(input.value);
    input.value = "";
  }
});

async function displaySeparateCountry(n) {
  const data = await getCountry(undefined, undefined, n);

  let border1;

  const html = ` <div class="newCountry">
  <div class="btn_back">
      <span class="material-icons arrow">arrow_back</span>
      <button class="back">Back</button>
  </div>
  <div class="view">
      <img src="${data[0].flag}" class="flag_sep">
      <div class="entry">
          <div class="name">${data[0].name}</div>
          <div class="split">
              <div class="point1">
                  <div class="nation1">Native Name: <span class="col">${
                    data[0].nativeName
                  }</span></div>
                  <div class="nation1">Population: <span class="col">${
                    data[0].population
                  }</span></div>
                  <div class="nation1">Region: <span class="col">${
                    data[0].region
                  }</span></div>
                  <div class="nation1">Sub Region: <span class="col">${
                    data[0].subregion
                  }</span></div>
                  <div class="nation1">Capital: <span class="col">${
                    data[0].capital ? data[0].capital : ""
                  }</span></div>
  
              </div>
              <div class="point">
                  <div class="nation1">Top Level Domain: <span class="col">${
                    data[0].topLevelDomain
                  }</span></div>
                  <div class="nation1">Currencies: <span class="col">${
                    data[0].currencies ? data[0].currencies[0].name : ""
                  }
                  </span></div>
                  <div class="nation1">Languages: <span class="col">${language(
                    data
                  )}
                  </span></div>
  
              </div>
          </div>
          <div class="border">
              <div class="nation1_border">Border Countries:</div>
             
              </div>
          </div>
      </div>
  </div>
  </div>`;

  section1.style.display = "none";
  section2.insertAdjacentHTML("beforeend", html);

  const back = document.querySelector(".back");
  back.addEventListener("click", function (e) {
    document.querySelector(".newCountry").innerHTML = "";
    section1.style.display = "flex";
    initial();
  });

  const border = document.querySelector(".border");
  if (!data[0].borders) return;
  data[0].borders.forEach(async (n) => {
    console.log(n);
    const btn = document.createElement("button");
    btn.classList.add("adj");
    border1 = await getCountry(undefined, n);

    btn.innerHTML = border1.name.split("(")[0];
    border.appendChild(btn);
  });
}

function language(data) {
  let a = "";
  data[0].languages.forEach((el) => {
    if (el) a += el.name + ",";
  });

  return a.substring(0, a.length - 1);
}

window.addEventListener("click", function (e) {
  if (e.target.closest(".country")) {
    const country =
      e.target.closest(".country").children[1].children[0].innerHTML;
    console.log(country);
    section2.innerHTML = "";
    displaySeparateCountry(country);
  }
});

async function getCountryByCode(code) {
  const data = await getCountry(undefined, code);
  const html = `
  <button class="adj"> ${data.name}</button> 
  `;
  return html;
}

async function filterByRegion(region) {
  const response = await fetch(
    `https://restcountries.com/v2/continent/${region}`
  );
  const data = await response.json();

  return data;
}

dropdown.addEventListener("click", async function (e) {
  if (e.target.value != "Filter by Region") {
    section2.innerHTML = "";
    const reg = await getCountry();
    reg.forEach((n) => {
      if (n.region === e.target.value) {
        displayCountry(n);
      }
    });
  }
});
