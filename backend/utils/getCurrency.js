const axios = require("axios");

const getCurrencyByCountry = async (countryName) => {
  try {
    const response = await axios.get("https://restcountries.com/v3.1/all?fields=name,currencies");
    const country = response.data.find(c => c.name.common.toLowerCase() === countryName.toLowerCase());
    if (!country) throw new Error("Country not found");
    return Object.keys(country.currencies)[0];
  } catch (err) {
    console.error(err);
    return "USD"; // fallback
  }
};

module.exports = getCurrencyByCountry;
