const axios = require("axios");

const getCurrencyByCountry = async (countryName) => {
  try {
    const response = await axios.get(
      "https://restcountries.com/v3.1/all?fields=name,currencies"
    );
    const country = response.data.find(
      (c) => c.name.common.toLowerCase() === countryName.toLowerCase()
    );

    if (!country) throw new Error("Country not found");

    // Get the first currency code
    const currency = Object.keys(country.currencies)[0];
    return currency;
  } catch (err) {
    console.error(err);
    return "USD"; // fallback
  }
};

module.exports = getCurrencyByCountry;
