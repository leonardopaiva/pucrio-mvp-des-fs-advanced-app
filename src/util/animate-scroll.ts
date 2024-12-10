/* 
  Function to scroll to the top with a bounce effect 
  usefull when changing routes, so the scroll will reset
*/
export function smoothScrollToTopWithBounce() {
  const currentScrollPosition = window.scrollY;
  const bounceDistance = 30;  // Bounce distance downwards
  const bounceTime = 50;      // Bounce time duration
  const scrollStep = bounceDistance / (bounceTime / 15);  // Scroll speed for bounce downwards
  let scrollInterval: number = 0;

  /*
   * If the user is between 0 and 50 pixels from the top, apply the bounce effect
   */
  if (currentScrollPosition < 0 || currentScrollPosition > 50) return;

  // First animation: scroll downwards
  scrollInterval = setInterval(() => {
    if (window.scrollY >= bounceDistance) {
      clearInterval(scrollInterval); // Stop when bounce is reached
      // Second animation: scroll back to the top
      scrollToTop();
    } else {
      window.scrollBy(0, scrollStep);  // Scroll downward
    }
  }, 15);
}

/* Function to smoothly scroll to the top */
export function scrollToTop() {
  const scrollDuration = 100; // Duration to scroll to the top
  const scrollStep = -window.scrollY / (scrollDuration / 15); // Divide by the animation time
  let scrollInterval = setInterval(() => {
    if (window.scrollY === 0) {
      clearInterval(scrollInterval); // Stop animation when reaching the top
    } else {
      window.scrollBy(0, scrollStep); // Scroll smoothly upwards
    }
  }, 15);
}
