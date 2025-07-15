cart = [];
couponCodes = ["SAVE50", "FRESH10", "GET20NOW"];
isApplied = false;
let discount = 0;
const cartButtons = document.querySelectorAll(".add-btn");
cartButtons.forEach((btn) =>{
    btn.addEventListener("click",() => {
        const classContainer = btn.closest(".food-item")
        const itemName = classContainer.querySelector(".item-name").innerHTML
        const itemPrice = parseFloat(classContainer.querySelector(".item-price").innerHTML)
        cart.push({
            "name": itemName, 
            "price": itemPrice 
        })
        const cartItems = document.getElementById("cart-items")
        cartItems.innerHTML = ""
        cart.forEach((item) => {
            const emptyMsg = document.getElementById("empty-msg");
            if (cart.length === 0) {
                emptyMsg.style.display = "block";
            } else {
                emptyMsg.style.display = "none";
            }

            const newDiv = document.createElement("div")
            newDiv.textContent = `${item.name} - ${item.price}`
            cartItems.appendChild(newDiv);
        })
        const totalPrice = calculatePrice(cart)
        document.querySelector(".subtotal-value").textContent = totalPrice
        document.querySelector(".final-total-value").textContent = (totalPrice - discount).toFixed(2);
    })
})

function calculatePrice(cart){
    let price = 0.00;
    cart.forEach((item) => {
        price += item.price
    })
    return price.toFixed(2)
}

document.querySelector(".apply-btn").addEventListener("click", ()=>{
    const couponCode = document.getElementById("coupon").value.trim()
    if(checkValidCoupon(couponCode) && checkApply()){
        const sub = parseFloat(document.querySelector(".subtotal-value").textContent)
        if(couponCode === "SAVE50") discount = sub*0.5
        else if(couponCode === "FRESH10") discount = sub*0.1
        else discount = sub*0.2
        isApplied = true
        document.querySelector(".discount-amount-value").textContent = discount.toFixed(2)
        document.querySelector(".final-total-value").textContent = (sub - discount).toFixed(2);
        console.log(cart)
    }
})

function checkValidCoupon(couponCode){
    for(let i=0;i<couponCodes.length;i++){
        if(couponCodes[i] === couponCode) return true;
    }
    return false;
}

function checkApply(){
    if(isApplied) {
        alert("Coupon Code already applied")
    }else return true;    
}


document.querySelector(".order-btn").addEventListener("click", ()=>{
    createOrder(cart)
    .then(function(order){
        console.log(order)
        return proceedToPayment()
    })
    .then(function(payment){
        console.log(payment)
        return showOrderSummary(cart)
    })
    .then(function(listOfItems){
        console.log(listOfItems)
        const total = document.querySelector(".final-total-value").textContent
        return updateWallet(total)
    })
    .then(function(wallet){
        console.log(wallet)
    })
    .catch(function(err){
        console.log(err.message)
    })
    
})

function createOrder(cart){
    const promise = new Promise(function(resolve, reject){
        if(cart.length === 0) reject("Please add items to cart to generate your order")
        else{
            let orderId = "123";
            resolve(`Order Placed! Your order id is ${orderId}`)
        }  
    })

    return promise
}

function proceedToPayment(){
    const paymentStatus = new Promise(function(resolve, reject){
        const success = true
        if(success) resolve(`Payment Successful for order id : 123!`)
        else reject(new Error("Payment Failed")) 
    })
    return paymentStatus 
}

function showOrderSummary(cart){
    return new Promise(function(resolve, reject){
        if(cart.length === 0) reject(new Error("Can't generate order summary due to empty cart"))
        else{
            resolve(cart)
        }    
    })
}

function updateWallet(cost){
    return new Promise(function(resolve, reject){
        if(cost === 0.00) reject(new Error("No changes made to wallet"))
        else resolve(`Amount of ${cost} deducted from your balance`)
    })
}