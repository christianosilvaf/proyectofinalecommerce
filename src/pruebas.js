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



async function main(){
    const data= await fetch("https://ecommercebackend.fundamentos-29.repl.co/");
    const res= await data.json();
    const database={ res,cart: {}};
    console.log(database.res); 
};

main()
