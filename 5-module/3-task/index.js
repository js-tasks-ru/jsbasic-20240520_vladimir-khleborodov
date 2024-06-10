function initCarousel() {
  const carousel = document.querySelector('.carousel');
  const carouselArrowRight = carousel.querySelector('.carousel__arrow_right');
  const carouselArrowLeft = carousel.querySelector('.carousel__arrow_left');
  const carouselInner = carousel.querySelector('.carousel__inner');
  const carouselSlidesArr = Array.from(carouselInner.children);
  
  carouselArrowLeft.style.display = 'none';
  let counter = 0;
  let dynamicSlideWidth = 0;
  
  carousel.addEventListener('click', (event) => {
    let target = event.target;
    
    if (target.closest('.carousel__arrow_right')) {
      counter++;
      if (counter === carouselSlidesArr.length - 1) carouselArrowRight.style.display = 'none';
      
      carouselArrowLeft.style.display = '';
      dynamicSlideWidth += carouselSlidesArr[counter].offsetWidth;
      carouselInner.style.transform = `translateX(-${dynamicSlideWidth}px)`;
    }
    
    if (target.closest('.carousel__arrow_left')) {
      counter--;
      if (counter === 0) carouselArrowLeft.style.display = 'none';
      
      carouselArrowRight.style.display = '';
      dynamicSlideWidth -= carouselSlidesArr[counter].offsetWidth;
      carouselInner.style.transform = `translateX(-${dynamicSlideWidth}px)`;
    }
  });
}
