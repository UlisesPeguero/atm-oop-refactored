//Control the view container and the buttons associated with it        
class ViewContainer {

    /*
        +constructor
        @param domId    {string} -> id for the DOM element of the view container
        @param buttons  {object} -> functions for confirmation buttons(accept, cancel) if the view has them
    */
    constructor(domId, buttonsView) {
        // constansts
        this.BUTTON_SELECTORS = ["accept", "cancel"]; // accept and cancel selectors
        // DOM will hold the DOM element of the view
        this.DOM = document.getElementById(domId);
        // hold the buttons used at the footer of the views
        this.Button = {};
        this.setButtons(buttonsView);
    }

    setButtons(buttons) {
        // if buttons is passed as an object we assign the DOM elements and 
        // and the functions to the onclick event
        if(typeof buttons === 'object') {    
            // create and assign buttons
            this.BUTTON_SELECTORS.forEach(name => {
                this.Button[name] = this.DOM.querySelector('.' + name); // assign DOM to button, we add '.' to make it a class selector
                this.Button[name].onclick = buttons[name]; // get the function from buttons
            });        
        }
    }

    /*
        Sets container visibility
        @param visible  {boolean} default true -> defines if should be visible or not. true:visible | false:not visible
    */
    setVisible(visible = true) {
        this.DOM.style.display = visible ? 'block' : 'none';
        if(visible) {
            // get input that will be given the focus
            let input = this.DOM.querySelector('[autofocus]');
            if(input) { // if exists                
                input.focus();  // focus the input
                input.scrollIntoView(); // scroll the window to the make the input viewed
            }
        }
    }

    // shortcut for setVisible(true)
    open() {
        this.setVisible();        
    }

    // shortcut for setVisible(false)
    close() {
        this.setVisible(false);
    }
    
    /*
        Allows to set text value to any children DOM of the container
        @param selector {string} -> Uses querySelector rules for DOM search
        @param text    {string} -> String that will be set to the textContent of the DOM element selected
    */
    setText(selector, text) {
        this.get(selector).textContent = text;
    }
        
    /*
        Allows to set a value for elements with name attribute
        @param  name    {string}        -> Name attribute to search for
        @param  value   {string|number} -> Value to be assign to the element
    */
    setValue(name, value) {
        this.get('[name=' + name + ']').value = value; 
    }

    /*
        Allows to set a value for elements with name attribute
        @param  name    {string}    -> Name attribute to search for        
        @return {string}            -> Value from the element found
    */
    getValue(name) {
        return this.get('[name=' + name + ']').value;
    }

    /*
        Allows to get any children DOM of the container
        @param selector {string} -> Uses querySelector rules for DOM search        
        @return         {DOM} -> Returns the DOM element selected
    */
    get(selector) {
        return this.DOM.querySelector(selector);
    }

    // Shortcut to get the form from the view
    getForm(selector = 'form') {
        return this.get(selector);
    }

    // Set all named elements to ""
    clearForm() {
        this.getForm().querySelectorAll('[name]').forEach(element => {
            element.value = '';
        });
    }

    /*
        Checks the form in the view for validity according to HTML5
        @return {boolean}   -> Determines if the form has validation issues, true:valid | false:invalid
    */
    validateForm() {
        let form = this.getForm();
        if(!form)  {    // null return if there is no Form in the view    
            return null;
        }
        // returns validity according to HTML5
        return form.checkValidity();
    }

    /*  
        Gets all the named values into an object literal
        @return {object}    -> All named elements values contained int he Form
    */
    getValues() {
        let values = {};
        this.getForm().querySelectorAll('[name]').forEach(element => { // search and add to the values object
            values[element.name] = element.value;
        });
        return values;
    }
    
}