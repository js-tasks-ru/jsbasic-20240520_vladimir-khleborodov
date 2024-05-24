function factorial(n) {
  if (n === 0 || n === 1) return 1;
  
  const arg = n;
  let result = n;
  
  for (let i = 1; i < arg; i++) {
    result *= arg - i;
  }
  
  return result;
}
