// styles
import '../css/reset.css';
import '../css/index.css';

// modules
import analytics from './modules/_analytics';

(() => {
  const app = {
    init() {
      this.isLocal = location.href.includes('localhost') || location.href.includes('127.0.0.1');

      !this.isLocal && analytics.init();

      this.cacheDOM();
    },

    cacheDOM() {
      this.form = document.querySelector('form');
      this.input = document.getElementById('base64string');
      this.previewContainer = document.querySelector('.preview');
      this.downloadButton = document.getElementById('download');
      this.footerYear = document.getElementById('footerYear');

      this.bindEvents();
    },

    bindEvents() {
      this.form.addEventListener('submit', event => {
        event.preventDefault();

        this.previewImage();
      });

      this.downloadButton.addEventListener('click', () => this.downloadImage());

      this.currentYear();
    },

    previewImage() {
      const base64string = this.input.value;

      this.previewContainer.removeAttribute('style');
      this.previewContainer.classList.add('preview--active');
      this.previewContainer.querySelector('img').setAttribute('src', base64string);

      if (!this.isLocal) {
        analytics.sendEvent({
          hitType: 'event',
          eventCategory: 'Preview',
          eventAction: 'Preview base64',
          eventLabel: base64string
        });
      }
    },

    downloadImage() {
      const link = document.createElement('a');
      const image = this.input.value;
      const timestamp = new Date().getTime();

      link.download = `image${timestamp}`;
      link.href = image;
      link.target = '_blank';

      link.click();

      if (!this.isLocal) {
        analytics.sendEvent({
          hitType: 'event',
          eventCategory: 'Download',
          eventAction: 'Download base64',
          eventLabel: image
        });
      }
    },

    currentYear() {
      this.footerYear.innerText = new Date().getFullYear();
    }
  };

  app.init();
})();
