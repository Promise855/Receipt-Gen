// src/js/utils.js
export function numberToWords(num) {
    if (isNaN(num) || num < 0) return "Invalid Amount";
    if (num === 0) return "Zero Naira";

    const units = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"];
    const teens = ["Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
    const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
    const scales = ["", "Thousand", "Million", "Billion"];

    function convertGroupToWords(num) {
        let words = [];
        if (num >= 100) {
            words.push(units[Math.floor(num / 100)] + " Hundred");
            num %= 100;
            if (num > 0) words.push("And");
        }
        if (num >= 20) {
            words.push(tens[Math.floor(num / 10)]);
            num %= 10;
        } else if (num >= 10) {
            words.push(teens[num - 10]);
            num = 0;
        }
        if (num > 0) words.push(units[num]);
        return words.join(" ");
    }

    let [integerPart, decimalPart] = num.toFixed(2).split(".");
    integerPart = parseInt(integerPart, 10);
    decimalPart = parseInt(decimalPart, 10);

    let words = [];
    let scaleIndex = 0;

    while (integerPart > 0) {
        let group = integerPart % 1000;
        if (group > 0) {
            let groupWords = convertGroupToWords(group);
            if (scaleIndex > 0) groupWords += " " + scales[scaleIndex];
            words.unshift(groupWords);
        }
        integerPart = Math.floor(integerPart / 1000);
        scaleIndex++;
    }

    let integerWords = words.length > 0 ? words.join(" ") : "Zero";
    let decimalWords = decimalPart > 0 ? convertGroupToWords(decimalPart) + " Kobo" : "";
    return integerWords + " Naira" + (decimalWords ? " and " + decimalWords : "");
}