/**
 * Returns a string that describes the position of the balance.
 *
 * @param {number} balance - The balance value.
 * @return {string} A string describing the position of the balance.
 */
export const getMarqueInfo = (balance: number): string => {
  const absBalance = Math.abs(balance);
  const position = balance < -5 ? "left" : balance > 5 ? "right" : "center";

  if (position === "center") {
    return `Balance: ${position}`;
  }
  return `Balance: ${absBalance}% ${position}`;
};
