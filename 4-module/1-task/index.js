function makeFriendsList(friends) {
  const friendsList = document.createElement('ul');
  
  for (let friend of friends) {
    const friendsListElem = document.createElement('li');
    const {firstName, lastName} = friend;
    friendsListElem.textContent = `${firstName} ${lastName}`;
    friendsList.append(friendsListElem);
  }
  
  return friendsList;
}
