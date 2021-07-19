const binaries = {

};

const activateTitleAnimation = () => {
   let currentLetter = 0;
   const text = 'BINARIES';
   const TEXT_CHANGE_MS = 500;
   setInterval(() => {
      currentLetter++;
      const start = text.substring(0, currentLetter - 1);
      const mid = `<span>${text[currentLetter - 1]}</span>`;
      const end = text.substring(currentLetter, text.length);
      const newText = start + mid + end;
      getElement('header').querySelector('h1').innerHTML = newText;
      if (currentLetter >= text.length) currentLetter = 0;
   }, TEXT_CHANGE_MS);
}

window.onload = () => {
   activateTitleAnimation();
}