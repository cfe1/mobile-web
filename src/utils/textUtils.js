const ellipsizeText = (text, outputLength = 30) => {
  if (text !== undefined && text.length > outputLength) {
    return text.substring(0, outputLength) + "...";
  } else {
    return text;
  }
};

const capitalizeFirstLetter = (string) => {
  if (string) {
    var newStr = string.replace(/_/g, " ");
    return newStr.charAt(0).toUpperCase() + newStr.slice(1).toLowerCase();
  }
};

const getAbbreviatedPositionName = (name) => {
  if (!name) {
    return;
  }
  return name
    .split(" ")
    .map((s) => {
      return s.substring(0, 1);
    })
    .join("");
};

function formatAmount(input) {
  // Convert input to a number
  const number = parseFloat(input);

  // Check if the input is a valid number
  if (isNaN(number)) {
    return "Invalid input";
  }

  // Format the number with commas and two decimal places
  const formatted = number.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

  return formatted;
}

function formatHours(input) {
  return input + " Hrs";
}

export {
  ellipsizeText,
  getAbbreviatedPositionName,
  capitalizeFirstLetter,
  formatAmount,
  formatHours
};
