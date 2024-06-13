function hideSelf() {
  const btn = document.querySelector('.hide-self-button');
  
  btn.addEventListener('click', (event) => event.currentTarget.hidden = true, {once: true});
}
