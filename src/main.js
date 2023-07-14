//obtención de productos:

async function getProducts() {
    try{
        const data= await fetch("https://ecommercebackend.fundamentos-29.repl.co/");
        const res= await data.json();
        window.localStorage.setItem("products", JSON.stringify(res));
        return res;
    } catch(error){
        console.log(error);
    } 
};

//funcion para dibujar los productos:

function printProducts(database){
    const products_secHTML = document.querySelector(".contenedor_products");
    let html="";
    
    for (const product of database.products) {
        if(product.quantity==0){ //if para pintar si nohay stock
            html+= `
        <div class="product_item">
            <div class="item_img">
                <img class="sinstock2" src="./src/img/outofstock.png">
                <img clas="rr"src="${product.image}" alt="imagen" id="imag" />
            </div>
            <div class="product_info">
                <h3>${product.name}</h3>
                <span>$${product.price}.00 
                    <div class="bx" id="bxsq"><i class='bx bxs-plus-square bx-lg' id="${product.id}"></i></div>
                    <span class="sinstock"><b>Stock</b>: Out of Stock</span>
                </span>
            </div>    
        </div>
        `;

        } else{
            html+= `
        <div class="product_item">
            <div class="item_img">
                <span class="vermas" id="${product.id}" ><i class='bx bxs-zoom-in bx-lg'></i></span>
                <img clas="rr"src="${product.image}" alt="imagen" id="imag" />
            </div>
            <div class="product_info">
                <h3>${product.name}</h3>
                <span>$${product.price}.00 
                    <div class="bx" id="bxsq"  ><i class='bx bxs-plus-square bx-lg' id="${product.id}"></i></div>
                    <span><b>Stock</b>: ${product.quantity}</span>
                </span>
            </div>    
        </div>
        `;
        };
    };
    products_secHTML.innerHTML=html;
    filter(database); //filter debe ir ahi
};

//funcion para añadir productos al carro: falta cuando no hay stock no dejar agregar

function addtoCart(database){
    let productsHTML=document.querySelector(".contenedor_products");
    let accioncarritoHTML=document.querySelector("#accionarcarrito");
    productsHTML.addEventListener("click", function (e) {
        
        const clikmeHTML=e.target.classList.contains("bxs-plus-square")
        if(clikmeHTML){
            const idd=Number(e.target.id);
            const productFound=database.products.find((product) => product.id===idd);
            const a=productFound.quantity;
            if(a>0) {
                if(database.cart[productFound.id]){
                    if(database.cart[productFound.id].quantity>database.cart[productFound.id].amount){
                    database.cart[productFound.id].amount+=1
                } else {window.alert("No hay suficiente Stock")
                };

                } else {
                    database.cart[productFound.id]= {
                        ...productFound,amount:1};
                };
        

                
            } else {
                window.alert("No hay suficiente Stock");
            };
            
            let carstoragelo=JSON.stringify(database.cart);
            window.localStorage.setItem("cart",carstoragelo);
            calculations(database);


        };

        //animación de boton añadir a carro
                const boxHTML = document.querySelector(".carritocompras");

                
                    if(clikmeHTML){
                        boxHTML.animate(
                            [
                                { transform: "scale(1)" },
                                { transform: "scale(2)" },
                                { transform: "scale(1)" },
                            ],
                            {
                                duration: 200,
                            }
                        );
                    }
                

        
        const prodencarroHTML =document.querySelector(".productosencarro");
        let html ="";
        
        for(const key in database.cart){
            const{amount, id, image,name,price}=database.cart[key];
            html+= `
                <div class="item_in_cart">
                    <img src="${image}" alt="" />
                    <div class="imagbrother">
                        <div class="calculationsbro">
                            <div class="info_item">
                                <span>${name}</span>
                                <span>Precio 1und= $${price}.00 </span>
                            </div>
                                <div class="cantidades" id="${id}">
                                    <div >
                                        <i class='bx bx-minus' ></i>
                                        Cantidad:${amount}
                                        <i class='bx bx-plus'></i>
                                    </div>
                                    <i class='bx bxs-trash bx-md'></i>
                                </div>
                        </div>
                        <div class="calculations"> 
                            <b>SubTotal</b>=1UndPrice X Cantidad= <b>$${price*amount}</b>
                        </div>
                        
                    </div>
                </div>
            `; 
        };
        prodencarroHTML.innerHTML=html;   
    });
};

//animacion añadir al carro


//funcion para pintar los elementos revisando las modificaciones del cart, se implementa en la funciona de arriba y la de abajo y se llama en main para pintar el locarl storage
function addlocalproducts(database) {
    const prodencarroHTML =document.querySelector(".productosencarro");
        let html ="";
        for(const key in database.cart){
            const{amount, id, image,name,price}=database.cart[key];
            html+= `
                <div class="item_in_cart">
                    <img src="${image}" alt="" />
                    <div class="imagbrother">
                        <div class="calculationsbro">
                            <div class="info_item">
                                <span>${name}</span>
                                <span>Precio 1und= $${price}.00 </span>
                            </div>
                                <div class="cantidades" id="${id}">
                                    <div >
                                        <i class='bx bx-minus' ></i>
                                        Cantidad:${amount}
                                        <i class='bx bx-plus'></i>
                                    </div>
                                    <i class='bx bxs-trash bx-md'></i>
                                </div>
                        </div>
                        <div class="calculations"> 
                            <b>SubTotal</b>=1UndPrice X Cantidad= <b>$${price*amount}</b>
                        </div>
                        
                    </div>
                </div>
            `; 
        };
        prodencarroHTML.innerHTML=html;
        calculations(database);
};

//funcion para la quitar  o poner articulos al carro
function addremovecart(database){
    const cartproductsHMTL=document.querySelector(".productosencarro");
    cartproductsHMTL.addEventListener("click",function(e){
        if(e.target.classList.contains("bx-plus")){
            const idd=Number(e.target.parentElement.parentElement.id);
            const productFind=database.products.find(
                (product)=>product.id===idd);
            if (productFind.quantity===database.cart[productFind.id].amount)
                return alert("No hay más en Stock");

            database.cart[idd].amount++;

            let carstoragelo=JSON.stringify(database.cart);//ojo
            window.localStorage.setItem("cart",carstoragelo); //ojo
        };

        if(e.target.classList.contains("bx-minus")){
            const idd=Number(e.target.parentElement.parentElement.id);
            if(database.cart[idd].amount===1){
                const response = confirm("¿Desea Eliminar este Producto?");
                if(!response) return;
                delete database.cart[idd];

            } else{
                database.cart[idd].amount--;
            }; 

            let carstoragelo=JSON.stringify(database.cart);//ojo
            window.localStorage.setItem("cart",carstoragelo); //ojo
        };

        if(e.target.classList.contains("bxs-trash")){
            const idd=Number(e.target.parentElement.id);
            delete database.cart[idd];

            let carstoragelo=JSON.stringify(database.cart);//ojo
            window.localStorage.setItem("cart",carstoragelo); //ojo
        };
        addlocalproducts(database);//para cada listener pinta las modificaciones en el cart
    });

    const vaciarHTML=document.querySelector(".total");
    vaciarHTML.addEventListener("click",function(e){
        if(e.target.classList.contains("sup")){
            const response = confirm("¿Desea Vaciar su Carrito?");
            if(!response) return;
            database.cart={};
        };

        window.localStorage.setItem("cart",JSON.stringify(database.cart));
        addlocalproducts(database);
    });

    
};

//calcular cantidad y valores totales de items y los pinta 
function calculations(database){

    const totalprodHTML=document.querySelector(".Total_prod");
    const totalpriceHTML=document.querySelector(".Total_price");
    const totalAmountProductsHTML=document.querySelector(".totalAmountProducts");
    const entucarroHTML=document.querySelector(".entucarro");
    let totalprod=0;
    let totalprice=0;
    for (const product in database.cart) {
        totalprod+=database.cart[product].amount;
        totalprice+=database.cart[product].amount*database.cart[product].price;
    } 
    totalprodHTML.textContent="Total Products ="+ totalprod+ "  Items";
    totalpriceHTML.textContent="Total=  $"+ totalprice+ ".00";
    totalAmountProductsHTML.textContent=totalprod;
    entucarroHTML.textContent="EN TU CARRO: " +totalprod+ "  Items"
};

//funcion para comprar
function comprando(database){
    const comprarHTML=document.querySelector(".total");
    const totalprodHTML=document.querySelector(".Total_prod");
    const totalpriceHTML=document.querySelector(".Total_price");
    comprarHTML.addEventListener("click",function(e){
        if(e.target.classList.contains("Comprar")){
            if(!Object.values(database.cart).length)
                return alert("No tienes Items en tu Carrito");

            const response= confirm(`${totalprodHTML.textContent} for a: ${totalpriceHTML.textContent} 
                                        ¿Confirmas tu compra?`);
            if(!response) return;

            let array={} //array para identificar productos endatabase y borrar
            for (const product in database.cart) {
                for (const product2 in database.products){
                    const idbought= database.cart[product].id;
                    const amountbought=database.cart[product].amount;
                    const prodinstock= database.products[product2];
                    if(prodinstock.id===idbought){
                        prodinstock.quantity-=amountbought;
                    };
                };

            let carstoragelo=JSON.stringify(database.products); //para arreglar el local storage
            window.localStorage.setItem("products",carstoragelo);
            database.cart={}; //se limpia el carrito despues de comprar
            window.localStorage.setItem("cart",JSON.stringify(database.cart)); //junto con esto
            addlocalproducts(database); //y esto para borrar el carro
            printProducts(database);//ojoojisimo daña el filter 
            };
        };
    });
};

//Funcion filtro  (perfecto)
function filter(database) {
    const productosHTML=document.querySelectorAll(".product_info");
    const filterHTML=document.querySelector(".filters");
    
    filterHTML.addEventListener("click", function (e) {
        if(e.target.classList.contains("Camisetas")){
            for (const product of productosHTML) { //esto devuelve un string del tipo camisa o sweeter
                
                const arrayzero=product.firstElementChild.textContent.split(" ")[0]

                if(!arrayzero.includes("Camiseta")){
                    product.parentElement.classList.add("product_item_hide");
                } else{product.parentElement.classList.remove("product_item_hide");};
            };
        };
        
        if(e.target.classList.contains("Hodies")){
            for (const product of productosHTML) { //esto devuelve un string del tipo camisa o sweeter
                const arrayzero=product.firstElementChild.textContent.split(" ")[0]
                if(!arrayzero.includes("Hoddie")){
                    product.parentElement.classList.add("product_item_hide");
                } else{product.parentElement.classList.remove("product_item_hide");};
            };
        };

        
        if(e.target.classList.contains("Sweaters")){
            for (const product of productosHTML) { //esto devuelve un string del tipo camisa o sweeter
                const arrayzero=product.firstElementChild.textContent.split(" ")[0]
                if(!arrayzero.includes("Sweater")){
                    product.parentElement.classList.add("product_item_hide");
                }else{product.parentElement.classList.remove("product_item_hide");};
            };
        };

        if(e.target.classList.contains("Todo")){
            for (const product of productosHTML) { //esto devuelve un string del tipo camisa o sweeter
                product.parentElement.classList.remove("product_item_hide");
            };
        };
    });
    
}

async function main(){
    const database={ 
        products:JSON.parse(window.localStorage.getItem("products")) ||  await getProducts(),
        cart: JSON.parse(window.localStorage.getItem("cart")) || {}
    };
    
    printProducts(database);
    
    addlocalproducts(database)
    addtoCart(database);
    addremovecart(database);
    calculations(database);
    comprando(database);
    carromodal(database);

    
};
main()

//para pantalla de carga
window.addEventListener("load", function(){
    setTimeout(function(){
        document.querySelector(".content_loader").classList.add("content_loader_hidden")
    },3500);

});

//para el navbar:
const navbarshowHTML=document.querySelector(".navbar");
window.addEventListener("scroll", function(){
    if(document.documentElement.scrollTop>0){
        navbarshowHTML.classList.add("navbar_show");
    } else{
        navbarshowHTML.classList.remove("navbar_show");
    } 
});

//para el navbar menu home products
window.addEventListener("scroll", function(){
    let homeHTML=this.document.getElementById("home");
    let posicionb=homeHTML.getBoundingClientRect().top;
    const menuhHTML=document.querySelector("#homecolor");
    const menuh2HTML=document.querySelector("#home2");
    const menupHTML=document.querySelector("#productscolor");
    const menup2HTML=document.querySelector("#products2");
    if(posicionb>=0){
        menuhHTML.classList.add("navbar_icons_scroll");
        menuh2HTML.classList.add("navbar_icons_scroll");
        menupHTML.classList.remove("navbar_icons_scroll");
        menup2HTML.classList.remove("navbar_icons_scroll");
    } else{ 
        menupHTML.classList.add("navbar_icons_scroll");
        menup2HTML.classList.add("navbar_icons_scroll");
        menuhHTML.classList.remove("navbar_icons_scroll");
        menuh2HTML.classList.remove("navbar_icons_scroll");
    };
});

//para mostrar y cerrar el carro
const carroHTML=document.querySelector(".carro");
const carritocomprasHTML=document.querySelector(".carritocompras");
const iconcerrarHTML=document.querySelector("#iconcerrar");
const buttoncomprarHTML=document.querySelector("#btnseguir");

carritocomprasHTML.addEventListener("click",function(){
    carroHTML.classList.toggle("carro_show");
});

iconcerrarHTML.addEventListener("click",function(){
    carroHTML.classList.toggle("carro_show");
});

buttoncomprarHTML.addEventListener("click",function(){
    carroHTML.classList.toggle("carro_show");
});

//para mostrar y cerrar menu2
const minimenuHTML=document.querySelector(".minimenu");
const menuresponsiveHTML=document.querySelector(".menuresponsive");
const home2HTML=document.querySelector("#home2");
const products2HTML=document.querySelector("#products2");
const languaje2HTML=document.querySelector("#lan2");

minimenuHTML.addEventListener("click",function(){
    menuresponsiveHTML.classList.toggle("menuresponsive_show");
});

home2HTML.addEventListener("click",function(){
    menuresponsiveHTML.classList.toggle("menuresponsive_show");
});

products2HTML.addEventListener("click",function(){
    menuresponsiveHTML.classList.toggle("menuresponsive_show");
});

languaje2HTML.addEventListener("click",function(){
    menuresponsiveHTML.classList.toggle("menuresponsive_show");
});

//dark mode
const darkHTML=document.querySelector(".darkmode");
const bodyHTML=document.querySelector("body");
let Dmo= JSON.parse(localStorage.getItem("dark-mode"));
bodyHTML.classList.toggle("dark-theme",Dmo);

darkHTML.addEventListener("click", function(){
    if(!JSON.parse(localStorage.getItem("dark-mode"))){
        bodyHTML.classList.add("dark-theme");
        localStorage.setItem("dark-mode",JSON.stringify(true));
    } else{
        bodyHTML.classList.remove("dark-theme");
        localStorage.setItem("dark-mode",JSON.stringify(false));
    }
});

//modal
const productsHTML=document.querySelector(".products_section");
productsHTML.addEventListener("click",function(e){

    const modalHTML=document.querySelector(".modal");
    const database={ 
            products:JSON.parse(window.localStorage.getItem("products"))};

    let html="";
    if(e.target.classList.contains("bxs-zoom-in")){
        const idd=Number(e.target.parentElement.id);
        
        const productFind=database.products.find((product) => product.id===idd);  
        html+= `
            <div class="product_item">
                <div class="item_img_modal">
                    <div class="vermasx"> <span class="cerrarmodal" >X</span> </div>
                    <img clas="rr"src="${productFind.image}" alt="imagen" id="imag" />
                </div>
                <div class="product_info2">
                    <h3>${productFind.name}</h3>
                    <span>$${productFind.price}.00 
                        <div class="bx" id="bxsq"  ><i class='bx bxs-plus-square bx-lg' id="${productFind.id}"></i></div>
                        <span><b>Stock</b>: ${productFind.quantity}</span>
                    </span>
                </div>    
            </div>
        `;
        
        modalHTML.classList.add("modal_show");
    }
    
        modalHTML.innerHTML=html;
    

});

//cerrar modal
const modalHTML2=document.querySelector(".modal");

modalHTML2.addEventListener("click",function(e) {
    
    modalHTML2.classList.remove("modal_show");
    if(e.target.classList.contains("cerrarmodal")){
        modalHTML2.classList.remove("modal_show");
    };
});

//añadir al carro por modal
function carromodal(database){
    const modal3HTML=document.querySelector(".modal");
    modal3HTML.addEventListener("click",function(e) {
        
        

        const clikmeHTML=e.target.classList.contains("bxs-plus-square");
            if(clikmeHTML){
                const idd=Number(e.target.id);
                const productFound=database.products.find((product) => product.id===idd);
                const a=productFound.quantity;
                if(a>0) {
                    if(database.cart[productFound.id]){
                        if(database.cart[productFound.id].quantity>database.cart[productFound.id].amount){
                        database.cart[productFound.id].amount+=1
                    } else {window.alert("No hay suficiente Stock")
                    };

                    } else {
                        database.cart[productFound.id]= {
                            ...productFound,amount:1};
                    };
            

                    
                } else {
                    window.alert("No hay suficiente Stock");
                };
                
                let carstoragelo=JSON.stringify(database.cart);//ojo
                window.localStorage.setItem("cart",carstoragelo); //ojo
                calculations(database);
            };

            //animación de boton añadir a carro
                    const boxHTML = document.querySelector(".carritocompras");

                    
                        if(clikmeHTML){
                            boxHTML.animate(
                                [
                                    { transform: "scale(1)" },
                                    { transform: "scale(2)" },
                                    { transform: "scale(1)" },
                                ],
                                {
                                    duration: 200,
                                }
                            );
                        }
                    

            
            const prodencarroHTML =document.querySelector(".productosencarro");
            let html ="";
            
            for(const key in database.cart){
                const{amount, id, image,name,price}=database.cart[key];
                html+= `
                    <div class="item_in_cart">
                        <img src="${image}" alt="" />
                        <div class="imagbrother">
                            <div class="calculationsbro">
                                <div class="info_item">
                                    <span>${name}</span>
                                    <span>Precio 1und= $${price}.00 </span>
                                </div>
                                    <div class="cantidades" id="${id}">
                                        <div >
                                            <i class='bx bx-minus' ></i>
                                            Cantidad:${amount}
                                            <i class='bx bx-plus'></i>
                                        </div>
                                        <i class='bx bxs-trash bx-md'></i>
                                    </div>
                            </div>
                            <div class="calculations"> 
                                <b>SubTotal</b>=1UndPrice X Cantidad= <b>$${price*amount}</b>
                            </div>
                            
                        </div>
                    </div>
                `; 
            };
            prodencarroHTML.innerHTML=html;

});
};