const numberToCurrency = (num, currency) => {

    let format = "en-US"
    if (currency == "EUR") format = "de-DE"
    // Create our number formatter.
    const formatter = new Intl.NumberFormat(format, {
        style: 'currency',
        currency: currency,
    });

    return formatter.format(num)
}
function arrayToObject(array) {
    const obj = {};

    for (let i = 0; i < array.length; i++) {
        const item = array[i];

        if (typeof item === 'object' && !Array.isArray(item)) {
            Object.assign(obj, item);
        } else {
            obj[i] = item;
        }
    }

    return obj;
}

export { numberToCurrency, arrayToObject }