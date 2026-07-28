/**
 * Formats a number into INR currency format
 * Example: 1299 => "₹1,299.00"
 */
export const formatCurrency = (amount) => {
  if (isNaN(amount)) return '₹0.00';

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(amount);
};