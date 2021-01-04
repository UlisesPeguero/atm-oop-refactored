// errors map
const ERROR = {
    ACCOUNT_NOT_FOUND: {
        code: '',
        message(){ // not code for the login error
            return 'Account was not found.';
        }
    },
    INVALID_NUMBER: {
        code: '01',
        message(label) {
            return `${this.code}. ${label} must be a valid number.`;
        }
    },
    NEGATIVE_NUMBER: {
        code: '02',
        message(label) {
            return `${this.code}. ${label} must not be less than 0.`;
        }
    },
    NEGATIVE_0_NUMBER: {
        code: '03',
        message(label) {
            return `${this.code}. ${label} must not be less or equal than 0.`;
        }
    },
    INVALID_OPERATION: {
        code: '04',
        message(label) {
            return `${this.code}. Couldn\'t execute ${label}.`;
        }
    },
    INCORRECT_PIN: {
        code: '05',
        message() {
            return `${this.code}. The current PIN is incorrect.`;
        }
    },
    NEWPIN_NOT_MATCH: {
        code: '06',
        message() {
            return `${this.code}. The new PIN doesn't match.`;
        }
    }, 
    INVALID_PIN: {
        code: '07',
        message(label = '') {
            return `${this.code}. The ${label} PIN is invalid, choose a different one.`; // PIN is totally not used by another account
        }
    },
    INVALID_WITHDRAWAL: {
        code: '08',
        message(label) {
            return `${this.code}. The amount to withdraw cannot exceed the balance. (${label})`;
        }
    },
    /*  Prepare message to be send
        @param  error   {Object}    -> Takes one of the ERROR objects to determine the message sent
        @param  label   {string}    -> Depending on the type of error message it might need an extra argument 
        @return         {string}    -> Prepared error message, containes the code and processed message text
    */
    message(error, label = '') {
        let message;
        if(typeof error.message === 'function') {
            message = error.message(label); // if message is a function, execute it with param label
        } else {
            message = error.message; // if not pass it as is
        }
        return message;
    }
};