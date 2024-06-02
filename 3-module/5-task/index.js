function getMinMax(str) {
  const filteredArr = str
    .split(' ')
    .filter(elem => !isNaN(elem));
  
  return {
    min: Math.min(...filteredArr),
    max: Math.max(...filteredArr)
  }
}
