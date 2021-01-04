// Holds the relevant information of the account and methods to work with the balance
class Account{
    
    /*
        Initializes Account instance and set the starting values for pin, name and balance
        @param  data   {Object}     -> {pin, name, balance} starting values for the Account
    */    
    constructor({pin, name, balance}) { // destructuring object 
        this.pin = pin;
        this.name = name;
        this.balance = parseFloat(balance) || 0.00; // if not balance is provided we intialize on 0.00        
    }

    /*
        Check if the deposit is a valid ammount and deposits it, returns true if so or false if is not
        @param deposit  {number}    -> Ammount to be deposited in the balance
        @return         {boolean}   -> flag that indicates if the deposit happened
    */
    deposit(deposit) {
        deposit = parseFloat(deposit);
        if(deposit < 0) {
            return false;
        }
        this.balance += deposit;
        return true;
    }

    /*
        Check if the withdraw is a valid ammount(no overdraft) and withdraws it,returns true if so or false if is not
        @param deposit  {number}    -> Ammount to be withdrawn from the balance
        @return         {boolean}   -> flag that indicates if the withdrawal happened
    */
    withdraw(withdrawal) {
        withdrawal = parseFloat(withdrawal);
        if(this.balance - withdrawal < 0) {
            return false;
        }
        this.balance -= withdrawal;
        return true;
    }

    //  @return     {number}    -> Returns the current balance in the account
    getBalance() {
        return parseFloat(this.balance);
    }

    //  @return     {number}    -> Returns the PIN for the account
    getPin() {
        return this.pin;
    } 

    //  @param      {number}    -> Updates the current pin
    setPin(newPin) {
        this.pin = newPin;
    }
    
    // @return      {string}    -> Returns the name for the account
    getName() {
        return this.name;
    } 

    //  @return     {object}    -> Returns the data in the account in JSON format
    getJSON() { 
        return {
        pin: this.pin,
        name: this.name,
        balance: parseFloat(this.balance).toFixed(2) // set the decimal precision to 2 
        };
    }    
}   