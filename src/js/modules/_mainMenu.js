 function dataSetToggler(set, el) {
   if (el.hasAttribute(`data-${set}`)) {
     el.removeAttribute(`data-${set}`);
   } else {
     el.dataset[set] = '';
   }
 }


 const mainMenu = {
   DOMe: document.querySelector('.mainMenuCont ul'),
   CL: window.location.href,
   BTN: document.querySelector('#mainMenuToggle')
 };

 mainMenu.init = function () {
   this.BTN.addEventListener('touchstart', this.handleMainMenuToggle);
   this.BTN.addEventListener('click', this.handleMainMenuToggle);
   this.checkPath();
 }

 mainMenu.checkPath = function () {
   console.dir(this);

   Array.from(this.DOMe.children).map(li => {
     let link = li.querySelector('a');

     if (link.href === this.CL) {
       li.dataset.active = '';
       link.dataset.active = '';
       return
     } else {
       if (li.dataset.active) {
         delete li.dataset.active
       }
       if (link.dataset.active) {
         delete link.dataset.active
       }
       return
     }
   })
 }

 mainMenu.handleMainMenuToggle = function name(e) {
   e.preventDefault();
   console.dir(this);
   let innerMain = this.parentElement.querySelector('.mainMenuInner');
   dataSetToggler('open', this);
   dataSetToggler('open', this.firstElementChild);
   dataSetToggler('open', innerMain);
   dataSetToggler('open', this.parentElement);
 }

 export {
   mainMenu,
   dataSetToggler
 };
