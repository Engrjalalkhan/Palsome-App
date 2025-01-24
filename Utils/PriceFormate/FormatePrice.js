export const formatPrices = (price) => {
  const formattedPrice = (price / 100)
    .toFixed(2)
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `${formattedPrice}`;
};
