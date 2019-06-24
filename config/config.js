module.exports = {
  /*
  Primeira letra maiúscula:
  https://dzone.com/articles/how-to-capitalize-the-first-letter-of-a-string-in
  */
  jsUcfirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  },
  removeLastCharacter(string) {
    string = string.substring(0, string.length - 1);
    return string;
  }
};
