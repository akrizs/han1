export default class loadingScreen {
  constructor({
    run = true,
    text = 'Default Placeholder text for the loader!',
    animation = 'scroller',
    mainContent = 'MainContent'
  } = {
    run: true,
    text: 'Default Placeholder text for the loader!',
    animation: 'scroller',
    mainContent: 'MainContent'
  }) {
    this.active = false;
    this.originalText = text;
    this.text = document.createTextNode(text);
    this.run = run
    this.animation = animation
    this.icon = {};
    this.createSVGicon();
    this.createDivs();

    if (document.querySelector(`#${mainContent}`)) {
      this.mainContainer = document.querySelector(`#${mainContent}`)
    }

    if (this.run) {
      this.enable();
    }
  }

  createSVGicon() {
    let xmlns = 'http://www.w3.org/2000/svg';

    this.icon.d = 'M3.13,188a3.13,3.13,0,0,1-2.88-4.35l35.1-83.38H3.13a3.14,3.14,0,0,1-2.8-4.54l47-94A3.14,3.14,0,0,1,50.13,0h50.14a3.14,3.14,0,0,1,2.65,4.81L66.27,62.67H103.4a3.12,3.12,0,0,1,2.84,1.81,3.15,3.15,0,0,1-.44,3.34L5.53,186.89A3.15,3.15,0,0,1,3.13,188'

    this.icon.path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    this.icon.path.id = 'backPath';
    this.icon.path.classList.add('backPath');
    this.icon.path.setAttributeNS(null, 'd', this.icon.d);

    this.icon.backRect = document.createElementNS(xmlns, 'rect');
    this.icon.backRect.classList.add('backRect');

    this.icon.mask = document.createElementNS(xmlns, 'mask');
    this.icon.mask.id = 'iconMask';
    this.icon.mask.classList.add('iconMask');
    this.icon.mask.appendChild(this.icon.backRect);
    this.icon.mask.appendChild(this.icon.path);


    this.icon.frontRect = document.createElementNS(xmlns, 'rect');
    this.icon.frontRect.setAttributeNS(null, 'mask', 'url(#iconMask)')
    this.icon.frontRect.setAttributeNS(null, 'y', '-200')
    this.icon.frontRect.setAttributeNS(null, 'width', '100%')
    this.icon.frontRect.setAttributeNS(null, 'height', '100%')
    this.icon.frontRect.classList.add('frontRect');
    this.icon.frontRect.id = 'iconDisplay';
    if (this.animation === 'scroller') {
      this.icon.frontRect.classList.add('scroller');
    }

    this.icon.outline = document.createElementNS(xmlns, 'path');
    this.icon.outline.id = 'outline';
    this.icon.outline.classList.add('outline');
    this.icon.outline.setAttributeNS(null, 'd', this.icon.d);
    if (this.animation === 'trace') {
      this.icon.outline.classList.add('trace')
    }

    this.icon.svg = document.createElementNS(xmlns, 'svg')
    this.icon.svg.setAttributeNS(null, 'viewBox', '0 0 106.53 188')
    this.icon.svg.classList.add('iconSvg')
    this.icon.svg.appendChild(this.icon.outline);
    this.icon.svg.appendChild(this.icon.mask);
    this.icon.svg.appendChild(this.icon.frontRect);

    return this.icon.svg;
  }

  createDivs() {
    this.background = document.createElement('div')
    this.background.classList.add('phase', 'phaseBack')
    this.iconWrapper = document.createElement('div');
    this.iconWrapper.classList.add('iconPlace');
    this.iconWrapper.appendChild(this.icon.svg);

    this.textCont = document.createElement('h3')
    this.textCont.appendChild(this.text);

    this.wrapper = document.createElement('div')
    this.wrapper.classList.add('phase', 'phaseNote')
    this.wrapper.appendChild(this.iconWrapper);
    this.wrapper.appendChild(this.textCont);
    this.background.insertAdjacentElement('beforeend', this.wrapper);
  }

  enable(text) {
    if (!!text) {
      this.text.nodeValue = text;
    }

    if (!this.active) {
      this.active = true;
      document.body.insertAdjacentElement('afterbegin', this.background);
      document.body.classList.add('disScroll');

      setTimeout(() => {
        this.background.setAttribute('data-display', '');
        if (!!this.mainContainer && !this.mainContainer.dataset.blurred) {
          this.mainContainer.dataset.blurred = '';
        }
      }, 10)

      setTimeout(() => {
        if (this.isActive) {
          this.text.nodeValue = "It's taking a longer time than expected to get data.";
          setTimeout(() => {
            if (this.isActive) {
              this.text.nodeValue = "Uhm... I guess there is something wrong...";
            }
          }, 10000);
        }
      }, 10000)

    }
  }

  disable() {
    if (this.active) {
      delete this.background.dataset.display
      this.background.setAttribute('data-hidden', '');
      if (!!this.mainContainer && !!this.mainContainer.dataset) {
        this.mainContainer.dataset.blurred = 'off';
      }

      setTimeout(() => {
        document.body.classList.remove('disScroll');
        this.background.parentNode.removeChild(this.background);
        this.active = false;
        this.text.nodeValue = this.originalText;
        if (!!this.mainContainer && !!this.mainContainer.dataset) {
          delete this.mainContainer.dataset.blurred;
        }
        delete this.background.dataset.hidden
      }, 1000);
    }
  }

  get isActive() {
    return this.active;
  }
}
