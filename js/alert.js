// Alert controller
class Alert {

    /*
        Initializes the alert with a ViewContainer and default values for delay and the template
        @param  view    {ViewContainer}         -> Object that will contain the alert message
        @param  delay   {number} default 3000   -> Delay in milliseconds before the message is removed, 3 seconds
        @param  templateId {string} default alertTemplate  -> Id of the HTML template used to display the message
    */
    constructor(view, delay = 3 * 1000, templateId = 'alertTemplate') {
        this.view = view;
        this.template = document.getElementById(templateId);
        this.delay = delay;    // 3 seconds
    }

    error(message, label = '') {  // shortcut to show an error alert
        if(typeof message !== 'string') {  // if message is not a string it needs to be processed by ERROR
            message = ERROR.message(message, label);
        }
        this.show(message, 'alert-danger');
    }

    success(message, view, delay) {  // shortcut to show a success alert 
        this.show(message, 'alert-success');
    }

    /*
        creates alert and sets the timeout
        @param  message     {string}        -> Message that will be displayed in the alert
        @param  className   {string}        -> Classes used by bootstrap to set the style        
    */
    show(message, className) {
        // check if there is an open alert
        let alert = this.view.get('#message.alert');
        if(alert) { // if already exists we removed before adding a new one
            alert.remove();
        }
        // create a clone from the <template>
        let template = this.template.content.cloneNode(true);
        alert = template.querySelector('#message'); // get div#message to add our message and class
        alert.innerText = message;  
        alert.classList.add(className); 
        // add alert message DOM to the view's form or main container
        this.view.get('form,.main').prepend(alert);
        setTimeout(() => {  // prepare the removal with a delay
            if(alert) alert.remove();  // only remove if the DOM exists                
        }, this.delay);
    }

    /*
        Sets the ViewContainer for the message
        @param view {ViewContainer} -> Container for the message
        @return {this}              -> Returns the instance itself to chaing methods
    */
    setView(view) {
        this.view = view;
        return this;
    }

    /*
        Sets the delay time in milliseconds for the message
        @param delay {number} -> Milliseconds of delay
        @return {this}        -> Returns the instance itself to chaing methods
    */
    setDelay(delay) {
        this.delay = delay;
        return this;
    }
}

