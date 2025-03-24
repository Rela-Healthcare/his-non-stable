export const numberToWords = (amountInNumbers) => {
  const ones = [
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
    "Ten",
  ];
  const teens = [
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
  ];
  const tens = [
    "Twenty",
    "Thirty",
    "Forty",
    "Fifty",
    "Sixty",
    "Seventy",
    "Eighty",
    "Ninety",
  ];
  let words = "";

  if (amountInNumbers < 0) return;
  if (amountInNumbers === 0) return (words = "Zero");
  if (amountInNumbers <= 10) return (words = ones[amountInNumbers - 1]);
  else if (amountInNumbers < 20) return (words = teens[amountInNumbers - 11]);
  else if (amountInNumbers < 100) {
    let reminder = numberToWords(amountInNumbers % 10);
    return (
      (words = tens[Math.floor(amountInNumbers / 10) - 2]) + " " + reminder
    );
  } else if (amountInNumbers < 1000) {
    let reminder = numberToWords(amountInNumbers % 100);
    return (words =
      ones[Math.floor(amountInNumbers / 100) - 1] + " Hundred " + reminder);
  }
  // else if (amountInNumbers < 100000) {
  //   let reminder = numberToWords(amountInNumbers % 1000);
  //   return (words =
  //     tens[Math.floor(amountInNumbers / 1000) - 2] + " Thousand " + reminder);
  // }
  else if (amountInNumbers < 1000000) {
    let reminder = numberToWords(amountInNumbers % 100000);
    return (words =
      ones[Math.floor(amountInNumbers / 100000) - 1] + " Lakh " + reminder);
  } else if (amountInNumbers < 10000000) {
    let reminder = numberToWords(amountInNumbers % 1000000);
    return (words =
      tens[Math.floor(amountInNumbers / 1000000) - 2] + " Lakh " + reminder);
  } else {
    let reminder = numberToWords(amountInNumbers % 10000000);
    return (words =
      ones[Math.floor(amountInNumbers / 10000000) - 1] + " Crore " + reminder);
  }
};
