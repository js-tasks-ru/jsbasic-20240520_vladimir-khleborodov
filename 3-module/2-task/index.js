function filterRange(arr, a, b) {
  let filteredArr = arr
    .slice()
    .filter(elem => a <= elem && elem <= b);
  return filteredArr;
}
