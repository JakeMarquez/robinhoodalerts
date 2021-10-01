export class Alert {
    ticker = '';
    price = 1;
    rising = false;
    constructor(ticker, price, rising) {
        this.ticker = ticker;
        this.price = price;
        this.rising = rising;
    }
}