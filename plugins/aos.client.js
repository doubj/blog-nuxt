import AOS from 'aos'
import 'aos/dist/aos.css'

export default ({ app }) => {
  app.AOS = new AOS.init({
    // https://github.com/michalsnik/aos
    disableMutationObserver: false, // disables automatic mutations' detections (advanced)
    debounceDelay: 50, // the delay on debounce used while resizing window (advanced)
    throttleDelay: 99, // the delay on throttle used while scrolling the page (advanced)
  });
};