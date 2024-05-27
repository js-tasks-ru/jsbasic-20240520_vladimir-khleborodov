function truncate(str, maxlength) {
  return (str.length <= maxlength) ? str : str.slice(0, maxlength - 1) + "…";
}
