// control the application UI and data management
class Atm {

    constructor() {
        // constants
        // localStorage data name
        this.DATA_ATM = 'data_atm';
        // balance actions
        this.NONE = 0;
        this.SHOW = 1;
        this.DEPOSIT = 2;
        this.WITHDRAW = 3;
        // private properties
        this.accounts = [];
        // current values being used
        this.current = {        
            view: null,
            account: null,
            action: this.NONE
        };
        // previous values, using an object for consistency with current
        this.previous = {
            view: null
        };
        
        // View will hold all the DOM for the UI views
        this.View = {
            login: new ViewContainer('loginView'), // home screen
            new: new ViewContainer('newAccountView'), // new account creation 
            account: new ViewContainer('accountView'), // account menu
            balance: new ViewContainer('balanceView'), // perform any action related to the balance (get, deposit, withdraw)
            changePIN: new ViewContainer('changePinView') // change current pin
        };

        // controls
        this.Button = {
            login: document.getElementById('loginButton'),
            new: document.getElementById('newAccountButton'),
            balance: document.getElementById('balanceButton'),
            changePIN: document.getElementById('changePinButton'),
            deposit: document.getElementById('depositButton'),
            withdraw: document.getElementById('withdrawButton'),
            logout: document.getElementById('logoutButton')        
        };  

        // alert system
        this.Alert = new Alert(null); // initialized with no view attached

        // initializes application and UI
        // prepare related controls
        this.prepareControls();
        // load accounts from localStorage into accounts:Array
        this.loadData();
        // initializes the UI to show the login view
        this.View.login.clearForm();
        this.openView(this.View.login);
        console.log('ATM Ready.');    
    }

    // assigns control DOM elements and attaches events
    prepareControls() {
        // login view
        this.Button.login.onclick = () => this.login();
        this.Button.new.onclick = () => this.openNewAccount();
        // new account view
        this.View.new.setButtons({
            accept: () => this.createAccount(),
            cancel: () => this.goBack()
        });
        // account menu view
        this.Button.changePIN.onclick = () => this.openChangePIN();
        this.Button.balance.onclick = () => this.openBalance(this.SHOW);
        this.Button.deposit.onclick = () => this.openBalance(this.DEPOSIT);
        this.Button.withdraw.onclick = () => this.openBalance(this.WITHDRAW);
        this.Button.logout.onclick = () => this.logout();
        // balance form view
        this.View.balance.setButtons({
            accept: () => this.updateBalance(),
            cancel: () => this.goBack()
        });
        // change pin view
        this.View.changePIN.setButtons({
            accept: () => this.updatePIN(),
            cancel: () => this.goBack()
        });
    }

    // attemps to login by looking for the PIN provided
    login() {
        // check for validity
        if(!this.View.login.validateForm()) {
            return; // if the input is not valid we return the method, and HTML5 will handle the error message
        }
        let pin = this.View.login.getValues().pin;
        // find in accounts for account.pin == pin
        let validAccount = this.accounts.find(account => account.getPin() == pin); // pin is private in account, we use a getter
        if(validAccount) {  // if found
            this.openAccountSession(validAccount);
        } else { // if not validAccount is undefined therefore falsy
            new Alert(this.View.login).error(ERROR.ACCOUNT_NOT_FOUND);
        }
    }

    /*
        Sets current account in use and opens the account menu
        @param  account {Account}   -> sets the current account for the session
    */
    openAccountSession(account) {
        this.current.account = account;
        this.View.account.setText('#nameAccount', account.getName());
        this.openView(this.View.account);
    }

    // closes current session and returns to login screen
    logout() {
        this.View.login.clearForm();
        this.current.account = null; // removes the currently open account 
        this.openView(this.View.login);
    }

    // open view to create new account
    openNewAccount() {
        this.View.new.clearForm(); // clear form inputs
        this.openView(this.View.new);
    }

    // validates the form an adds an account
    createAccount() {
        // check for validity on the this.View.new's {ViewContainer} form
        if(!this.View.new.validateForm()) {
            return; // stop method if anything in the form is invalid, HTML5 will handle error messages
        }
        let errorMessage = null;
        let values = this.View.new.getValues();  // get form values
        if(this.doesPINExist(values.pin)) { // if PIN is already used by another account
            errorMessage = ERROR.message(ERROR.INVALID_PIN); // sent error message 
        } else if(isNaN(values.balance)) { // if balance is not a valid number different than blank
            errorMessage = ERROR.message(ERROR.INVALID_NUMBER, 'Balance');// sent error message and specified input                          
        } else if(parseFloat(values.balance) < 0) { // if balance is < than 0
            errorMessage = ERROR.message(ERROR.NEGATIVE_NUMBER, 'Balance');                         
        }         
        // check for errors to show
         if(errorMessage !== null) {
            new Alert(this.View.new).error(errorMessage);
            return; // stop
        } else {
            values.balance = parseFloat(values.balance);
        }
        // if balance is blank, the account will have a starting balance of 0
        let account = new Account(values);  
        this.updateData(account);
        // open session
        this.openAccountSession(account);
    }

    /*
        Displays balance view for showing, deposit or withdraw
        @param action   {number} default SHOW -> Identify the action we will be providing on the view
    */
    openBalance(action = this.SHOW) {
        this.current.action = action;
        let title = ''; // will let us change the title of the view accordingly
        let readOnly = false; // for deposit and withdraw we change the input to writable                            
        switch(this.current.action) {
            case this.SHOW:     title = 'Balance'; 
                                this.View.balance.setValue('amount', this.current.account.getBalance().toFixed(2));
                                // for show we change the input to readonly
                                readOnly = true;
                                break;
            case this.DEPOSIT:  title = 'Deposit';
                                this.View.balance.clearForm();
                                break;
            case this.WITHDRAW: title = 'Withdraw';
                                this.View.balance.clearForm();
                                break;
        }
        // set title of the view
        this.View.balance.get('[name=amount]').readOnly = readOnly;
        this.View.balance.setText('#title', title);
        this.openView(this.View.balance);
    }

    // Validates values given and attempts to do Deposit and Withdrawal
    // @param   operation {function}    -> Account method to execute for the ammount
    // @return  {boolean}               -> Determines if the operation was executed
    balanceOperation(operation) {
        // check for validity on the this.View.balances's {ViewContainer} form
        if(!this.View.balance.validateForm()) {
            return false;// return that form is not valid, HTML5 will handle error messages
        }
        let amount = this.View.balance.getValues().amount;  // get ammount value
        let errorMessage = null;
        if(isNaN(amount)) { // if amount is not a valid number different than blank
            errorMessage = ERROR.message(ERROR.INVALID_NUMBER, 'Amount');
        } else if(parseFloat(amount) <= 0) { // if ammount is <= than 0
            errorMessage = ERROR.message(ERROR.NEGATIVE_0_NUMBER, 'Amount');            
        } else if(!operation(amount)){// attempt to execute operation, if works continue
            // if doesnt work
            if(this.current.action === this.DEPOSIT) errorMessage = ERROR.message(ERROR.INVALID_OPERATION, 'operation');           
            else errorMessage = ERROR.message(ERROR.INVALID_WITHDRAWAL, this.current.account.getBalance());
        }
        // check for errors to show
        if(errorMessage !== null) {
            // sent error message about not being a number and set invalid
            new Alert(this.View.balance).error(errorMessage);
            return false;
        }        
        // if function ends normally all data is valid
        return true;
    }
    
    // update balance of the current account 
    updateBalance() {        
        // determine the action
        let operation;
        switch(this.current.action) {                    
            case this.SHOW:     break; // do nothing
            case this.DEPOSIT:  operation = (value) => this.current.account.deposit(value); // operation will be deposit, need to create anonymous function to keep scope of this
            case this.WITHDRAW: if(!operation) operation = (value) => this.current.account.withdraw(value); // if operation wasn't defined on deposit, is now withdraw
                                if(!this.balanceOperation(operation)) return; // if there was an error we stop execution
                                // show new balance on Account menu view for 4 seconds    
                                new Alert(this.View.account, 4 * 1000).success('Current balance: ' + this.current.account.getBalance().toFixed(2));
                                // update data
                            this.updateData();
                            break;
        }        
        this.current.action = this.NONE;
        this.goBack();
    }

    openChangePIN() {        
        this.View.changePIN.clearForm();
        this.openView(this.View.changePIN);
    }

    updatePIN() {
        // check for validity on the this.View.changePin's {ViewContainer} form
        // TODO: Think of a reusable more efficient way to do this
        if(!this.View.changePIN.validateForm()) {
            return;// stop execution, HTML5 will handle error messages
        }
        let errorMessage = null;
        let values = this.View.changePIN.getValues(); // get values from changePin Form
        if(values.pin !== this.current.account.getPin()) { // validate the current pin before performing a change
            errorMessage = ERROR.message(ERROR.INCORRECT_PIN);
        } else if(this.doesPINExist(values.newPin)) { // checks if new PIN is already used by another account
                errorMessage = ERROR.message(ERROR.INVALID_PIN, 'new'); 
        } else if(values.newPin !== values.confirmNewPin) {// validate the newPin matches the confirmation
            errorMessage = ERROR.message(ERROR.NEWPIN_NOT_MATCH);
        } 
        // check for errors to show
        let alert = new Alert(this.View.changePIN);
        if(errorMessage !== null) {
            // sent error message about not being a number and set invalid
            alert.error(errorMessage);
            return;
        }      
        // procede with the change
        this.current.account.setPin(values.newPin);
        // show message of success on account menu    
        alert.setView(this.View.account).success('PIN changed succesfully.');                            
        // udpate data
        this.updateData();
        this.goBack();
    }

    /*
        Searchs and determinates if the pin given already exists in the Account's list
        @parameter  pin {string}    -> PIN to be searched
        #return {boolean}           -> Flag to determinate if the value was found
    */
    doesPINExist(pin) {
        let exist = this.accounts.find(account => account.getPin() == pin); // find the first account that satisfies account.getPin() == pin
        return Boolean(exist); // gives a return in strict boolean value
    }

    /*
        Updates the array that contains the accounts and the localStorage 
        @param  account {Account}   -> new account to be added to the array and storage
    */
    updateData(account) {
        if(account) this.accounts.push(account); 
        // TODO: find a more efficient way of storing the information on localStorage
        // Maps accounts into a JSON Array to storage as a string in the localStorage data_atm        
        localStorage.setItem(this.DATA_ATM, JSON.stringify(this.accounts.map(item => item.getJSON())));
    }

    // Initial load of the data from localStorage data_atm
    loadData() {
        // initialize data from localStorage if there is not data sets an empty array
        let data = JSON.parse(localStorage.getItem(this.DATA_ATM)) || [];
        if(data.length > 0){ // if there is data we need to map into an array of {Account}
            data = data.map(item => new Account(item));
        }
        // data loaded
        this.accounts = data;
    }

    // hides current view and goes back to the previous View
    goBack() {
        if(this.previous.view !== null) {
           this.openView(this.previous.view);
        }
    }

    /*
        Hides the view containers that is currently visible and displays the specified one
        @param  container   {ViewContainer} -> Object that holds the container to be shown
    */
    openView(view) {
        if(this.current.view !== null) {
            this.previous.view = this.current.view;
            this.current.view.close(); // closes current view
        }
        this.current.view = view;
        this.current.view.open(); // display requested view
    }
    
}