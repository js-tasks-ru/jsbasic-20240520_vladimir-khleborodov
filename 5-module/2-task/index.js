function toggleText() {
  const btn = document.querySelector('.toggle-text-button');
  const text = document.getElementById('text');
  
  btn.addEventListener('click', () => {
    text.hidden = (text.hasAttribute('hidden')) ? '': true;
  });
}
