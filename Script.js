const BASE_URL = "https://2024-03-06.currency-api.pages.dev/v1/currencies/";

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

// Populate dropdowns with currency codes
for (let select of dropdowns) {
  for (currCode in countryList) {
    let newOption = document.createElement("option");
    newOption.innerText = currCode;
    newOption.value = currCode;

    if (select.name === "from" && currCode === "USD") {
      newOption.selected = "selected";
    } else if (select.name === "to" && currCode === "INR") {
      newOption.selected = "selected";
    }

    select.append(newOption);
  }

  select.addEventListener("change", (evt) => {
    updateFlag(evt.target);
  });
}

// Update flag function when dropdown changes
const updateFlag = (element) => {
  let currCode = element.value;
  let countryCode = countryList[currCode];
  let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
  let img = element.parentElement.querySelector("img");
  img.src = newSrc;
};

// Update exchange rate with validation 
const updateExchangeRate = async () => {
  let amount = document.querySelector(".amount input");
  let amtVal = amount.value.trim();

  // Validation logic for amount
  if (amtVal === "" || isNaN(amtVal) || parseFloat(amtVal) < 1) {
    alert("Please enter a valid amount");
    amount.value = "1";
    amtVal = "1"; // Update variable again to 1
  }

  const URL = `${BASE_URL}/${fromCurr.value.toLowerCase()}.json`;
  let response = await fetch(URL);
  let data = await response.json();

  let rate = data[toCurr.value.toLowerCase()];
  let finalAmount = (
    data[fromCurr.value.toLowerCase()][toCurr.value.toLowerCase()] *
    parseFloat(amtVal)
  ).toFixed(2);

  msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount} ${toCurr.value}`;
};

// handle button click event
btn.addEventListener("click", (evt) => {
  evt.preventDefault();
  updateExchangeRate();
});

// Show exchange rate on initial page load after fetching data from API
window.addEventListener("load", () => {
  updateExchangeRate();
});
