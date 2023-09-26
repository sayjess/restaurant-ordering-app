import {menuArray} from './data.js'

const form = document.getElementById("modal");

let orders = []
let hasPayed = false
let payorName = ''



document.addEventListener('click', function(e){
    if(e.target.dataset.order){
        handleOrder(Number(e.target.dataset.order))
    } else if(e.target.id === 'complete-order') {
        onCompleteOrderClick()
    } else if(e.target.dataset.remove){
        handleRemoveOrder(e.target.dataset.remove)
    }
})


function handleOrder(menuId){
    // check if menu exist in the data and store in a variable
    hasPayed = false
    const targetMenuObj = menuArray.filter(function(menu){
        return menuId === menu.id
    })[0]

    // check if the targetMenuObj exist in the orders array, if it exists add up the prices, if not push the new object to the array
    const foundItem = orders.find((item) => item.id === targetMenuObj.id);

    if (foundItem) {
      foundItem.price += targetMenuObj.price;
      foundItem.quantity = (foundItem.quantity || 1) + 1; // Increment quantity or set to 1
    } else {
      orders.push({ ...targetMenuObj, quantity: 1 }); // Add quantity with initial value 1
    }
    render()
}

function onCompleteOrderClick(){
    document.getElementById('modal').classList.add('visible')
}


function handleForm(event) { 
    event.preventDefault()
    document.getElementById('modal').classList.remove('visible')
    hasPayed = true
    payorName = document.getElementById('name').value
    render()
    orders = []
    document.querySelectorAll('input').forEach(x => x.value = '');
}

function handleRemoveOrder(id){
    const indexToRemove = orders.findIndex(item => item.id === id);
    orders.splice(indexToRemove, 1);
    render()

}


function getHTMLData(){
    let feedHTML = ''
    const totalprice = orders.reduce(function(total, currentItem){
        return total + currentItem.price
    },0)


    feedHTML = menuArray.map(function(menu){
        const {name, ingredients, id, price, emoji} = menu
        return `
            <div class='item-container'>
                <p>${emoji}</p>
                <div class='details-container'>
                    <h3>${name}</h3>
                    <p class='ingredients'>${ingredients.join(', ')}</p>
                    <p>${price}</p>
                </div>
                <div class='add-to-cart-container' data-order='${id}'>
                    <i class="fa-regular fa-circle-xmark" data-order='${id}'></i>
                </div>
            </div>
        `
    }).join('')

    
    const ordersHTML = orders.map(function(order){
        const {name, price, quantity, id} = order
        return `
            <div class='order-container'> 
            <p class='quantity'>${quantity}</p>       
            <h3>${name}</h3>
            <button data-remove='${id}'>remove</button>
            <p class='price'>${price}</p>
            </div>
        `
    }).join('')

    if(orders.length != 0 && hasPayed === false){
        feedHTML += `
            <div class='checkout-container'>
                <h3>Your Order</h3>
                ${ordersHTML}
                <div class="total-container">
                    <h3>Total price:</h3>
                    <p>${totalprice}</p>
                </div>
                <button id='complete-order'>Complete Order</button>
            </div>
            `
    } else if (orders.length != 0 && hasPayed === true){
        feedHTML += `
            <p class='onpayment'>Thanks ${payorName}! Your order is on its way!</p>
        `
    }


    return feedHTML
}


function render(){
    document.querySelector('.items-container').innerHTML = getHTMLData()
}

render()
form.addEventListener('submit', handleForm);

