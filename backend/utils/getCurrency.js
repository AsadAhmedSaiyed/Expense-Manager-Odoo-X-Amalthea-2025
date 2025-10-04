const axios = require("axios");

const getCurrencyByCountry = async (countryName) => {
  try {
    const response = await axios.get(
      "https://restcountries.com/v3.1/all?fields=name,currencies",
      { timeout: 5000 } // 5 seconds timeout
    );

    const country = response.data.find(
      c => c.name.common.toLowerCase() === countryName.trim().toLowerCase()
    );

    if (!country || !country.currencies) {
      console.warn(`Currency not found for "${countryName}", defaulting to USD`);
      return "USD";
    }

    return Object.keys(country.currencies)[0];
  } catch (err) {
    console.warn(`Failed to fetch countries: ${err.message}. Using USD as fallback.`);
    return "USD"; // fallback
  }
};

module.exports = getCurrencyByCountry;
