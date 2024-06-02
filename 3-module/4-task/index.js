function showSalary(users, age) {
  let result = [];
  const filteredUsers = users.filter(user => user.age <= age);
  
  for (const user of filteredUsers) {
    const {balance, name} = user;
    result.push(`${name}, ${balance}`);
  }
  
  return result.join('\n');
}
