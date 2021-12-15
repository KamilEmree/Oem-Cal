const inputProduct = document.getElementById('input-product');
const inputPrice = document.getElementById('input-price');
const orderList = document.getElementById('order-list');
let orders = [
    {
        name: 'A box of butter',
        price: 30
    }
    ,
    {
        name: '2 packs of eggs',
        price: 100
    }
];

init();

function init(){
    writeAllOrders();
}

function addItem(){
    if (inputProduct.value === '') {
        alert('Please fill product name!');
        return false;
    }
    if (inputPrice.value === '') {
        alert('Please fill product price!');
        return false;
    }
    orders.push({
        name: inputProduct.value,
        price: inputPrice.value
    })
    inputProduct.value="";
    inputPrice.value="";
    writeAllOrders();
}

function deleteItem(i) {
    orders.splice(i, 1);
    writeAllOrders();
}

function pushOrderToHtml(i) {
    item = orders[i] ?? null;
    if(item) {
        const tr = document.createElement('tr');
        tr.innerHTML = 
            `
            <td id="item-name">${item.name}</td>
            <td id="item-price">${item.price}</td>
            <td id="item-actions">
                <button id="btn-edit" onclick="editItem(${i})" class="bi bi-pencil-square" />
                <button id="btn-action-edit" onclick="editItemAction(${i})" class="bi bi-check-square" style="display:none" />
                <button id="btn-delete" onclick="deleteItem(${i})" class="bi bi-x-square" />
            </td>
            `;
        orderList.appendChild(tr);
    }
}

function writeAllOrders() {
    orderList.innerHTML = '';
    for (let i = 0; i < orders.length; i++) {
        pushOrderToHtml(i);
    }
    calculatePrices();
}

function deleteAll(){
    if(confirm('Are you sure you want to delete all ?') === true){
        orders = [];
        writeAllOrders();
    }
}

function calculatePrices() {
    moneyApi()
    .then(data => {
        const Try = data.try.inverseRate;
        const Euro = data.eur.inverseRate;
        const usdTotal = orders.reduce((acc, obj) => acc + parseFloat(obj.price), 0);
        document.getElementById('calculation-usd').innerText = usdTotal.toFixed(4);
        const euroTotal = orders.reduce((acc, obj) => acc + parseFloat(obj.price / Euro), 0); 
        document.getElementById('calculation-euro').innerText = euroTotal.toFixed(4);
        const tryTotal = orders.reduce((acc, obj) => acc + parseFloat(obj.price / Try), 0); 
        document.getElementById('calculation-try').innerText = tryTotal.toFixed(4);
    })  
}

function editItem(i) {
    item = orders[i] ?? null;
    if (item) {
        const itemNameTd = document.querySelector('#order-list tr:nth-child(' + (i + 1) + ') #item-name');
        const itemPriceTd = document.querySelector('#order-list tr:nth-child(' + (i + 1) + ') #item-price');
        const itemBtnEdit = document.querySelector('#order-list tr:nth-child(' + (i + 1) + ') #item-actions #btn-edit');
        const itemActionBtnEdit = document.querySelector('#order-list tr:nth-child(' + (i + 1) + ') #item-actions #btn-action-edit');
        itemNameTd.innerHTML = '<input value="'+ item.name +'" id="input-edit-product" class="form-control" type="text">';
        itemPriceTd.innerHTML = '<input value="'+ item.price +'" id="input-edit-price" class="form-control" type="number">';
        itemBtnEdit.style.display = "none";        
        itemBtnEdit.style.marginTop = "4px";
        itemActionBtnEdit.style.display = "";
        itemActionBtnEdit.style.marginTop = "4px";
    }
}

function editItemAction(i) {
    item = orders[i] ?? null;
    if (item) {
        const inputEditProduct = document.querySelector('#order-list tr:nth-child(' + (i + 1) + ') #input-edit-product');
        const inputEditPrice = document.querySelector('#order-list tr:nth-child(' + (i + 1) + ') #input-edit-price');
        orders[i].name = inputEditProduct.value
        orders[i].price = inputEditPrice.value
        writeAllOrders()
    }
}

async function moneyApi() {
    const response = await fetch('http://www.floatrates.com/daily/usd.json')
    const data = await response.json();
    return data;
}