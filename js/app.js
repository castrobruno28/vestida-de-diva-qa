const products = [
  {id:1,name:"Vestido Amarelo",category:"Vestidos",price:179.99,oldPrice:null,tag:"DESTAQUE",description:"Vestido amarelo claro com detalhe franzido, para um visual leve e elegante.",sizes:["P","M","G"],colors:["Cor da foto — consultar disponibilidade"],art:"Vestido Amarelo",image:"./assets/vestido-amarelo.png"},
  {id:2,name:"Vestido Azul",category:"Vestidos",price:139.99,oldPrice:null,tag:"DESTAQUE",description:"Vestido azul de modelagem fluida, ideal para compor um look delicado.",sizes:["P","M","G"],colors:["Cor da foto — consultar disponibilidade"],art:"Vestido Azul",image:"./assets/vestido-azul-longo.png"},
  {id:3,name:"Conjunto Rosa de Poá",category:"Conjuntos",price:169.99,oldPrice:null,tag:"CONJUNTO",description:"Conjunto rosa de poá com blusa e short para um visual moderno.",sizes:["P","M","G"],colors:["Cor da foto — consultar disponibilidade"],art:"Conjunto Rosa de Poá",image:"./assets/conjunto-rosa-poa.png"},
  {id:4,name:"Saia Envelope Longa",category:"Saias",price:139.99,oldPrice:null,tag:"CORES VARIADAS",description:"Saia envelope longa. Publicação da loja informa disponibilidade em cores variadas.",sizes:["P","M","G"],colors:["Consultar cores disponíveis"],art:"Saia Envelope Longa",image:"./assets/saia-azul-floral.png"},
  {id:5,name:"Conjunto Lilás",category:"Conjuntos",price:179.99,oldPrice:null,tag:"CONJUNTO",description:"Conjunto lilás com blusa e short, para um look delicado e confortável.",sizes:["P","M","G"],colors:["Consultar cores disponíveis"],art:"Conjunto Lilás",image:"./assets/vestido-lilas-curto.png"},
  {id:6,name:"Conjunto de Linho",category:"Conjuntos",price:199.99,oldPrice:null,tag:"LINHO",description:"Conjunto de linho. A publicação informa tamanhos M e G e cores variadas.",sizes:["M","G"],colors:["Consultar cores disponíveis"],art:"Conjunto de Linho",image:"./assets/conjunto-amarelo.png"},
  {id:7,name:"Calça Pantalona Luna",category:"Calças",price:179.90,oldPrice:null,tag:"DESTAQUE",description:"Calça pantalona de modelagem ampla para conforto e estilo no cotidiano.",sizes:["36","38","40","42","44"],colors:["Consultar cores disponíveis"],art:"Calça Pantalona Luna",image:"./assets/conjunto-alfaiataria-bege.png"}
];

const money = value => value.toLocaleString("pt-BR",{style:"currency",currency:"BRL"});
const $ = selector => document.querySelector(selector);
const productGrid = $("#product-grid");
const cart = new Map();
let activeCategory = "Todas";
let searchTerm = "";
let toastTimer;

function safeText(value) {
  return String(value).replace(/[&<>"']/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));
}
function visibleProducts() {
  let list = products.filter(product => (activeCategory === "Todas" || product.category === activeCategory) &&
    `${product.name} ${product.category} ${product.description}`.toLocaleLowerCase("pt-BR").includes(searchTerm.toLocaleLowerCase("pt-BR")));
  const sort = $("#sort-filter").value;
  if (sort === "price-asc") list.sort((a,b)=>a.price-b.price);
  if (sort === "price-desc") list.sort((a,b)=>b.price-a.price);
  if (sort === "name") list.sort((a,b)=>a.name.localeCompare(b.name,"pt-BR"));
  return list;
}
function renderProducts() {
  const list = visibleProducts();
  productGrid.innerHTML = list.map(product => `
    <article class="product-card">
      <div class="product-image" data-details="${product.id}" tabindex="0" role="button" aria-label="Ver detalhes de ${safeText(product.name)}">
        ${product.image ? `<img src="${safeText(product.image)}" alt="${safeText(product.name)}" loading="lazy">` : ""}<div class="product-placeholder" ${product.image ? "hidden" : ""}>${safeText(product.art)}</div><span class="product-tag">${safeText(product.tag)}</span>
      </div>
      <div class="product-info"><span class="product-category">${safeText(product.category)}</span>
        <h3>${safeText(product.name)}</h3><p class="product-description">${safeText(product.description)}</p>
        <p class="product-price">${money(product.price)}</p>
        <p class="product-installments">${product.oldPrice ? `<s>${money(product.oldPrice)}</s> · ` : ""}Preço publicado pela loja</p>
        <div class="product-actions"><button class="add-button" type="button" data-details="${product.id}">ESCOLHER OPÇÕES</button><button class="details-button" type="button" data-details="${product.id}" aria-label="Detalhes de ${safeText(product.name)}">Detalhes</button></div>
      </div>
    </article>`).join("");
  $("#results-message").textContent = `${list.length} ${list.length === 1 ? "produto encontrado" : "produtos encontrados"}`;
  $("#empty-state").hidden = list.length !== 0;
}
function notify(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(()=>toast.classList.remove("show"),2400);
}
function addToCart(id, size, color) {
  const product = products.find(item=>item.id===Number(id));
  if (!product) return;
  const chosenSize = size || product.sizes[0];
  const chosenColor = color || product.colors[0];
  const key = `${product.id}|${chosenSize}|${chosenColor}`;
  const current = cart.get(key) || {...product,quantity:0,size:chosenSize,color:chosenColor,key};
  current.quantity += 1;
  cart.set(key,current);
  renderCart();
  notify(`${product.name} adicionado à sacola.`);
}
function renderCart() {
  const items = [...cart.values()];
  const count = items.reduce((sum,item)=>sum+item.quantity,0);
  const total = items.reduce((sum,item)=>sum+item.price*item.quantity,0);
  $("#cart-count").textContent = count;
  $("#cart-total").textContent = money(total);
  $("#cart-items").innerHTML = items.length ? items.map(item=>`
    <div class="cart-item"><div class="cart-item-art">${safeText(item.art)}</div>
      <div><h3>${safeText(item.name)}</h3><p>${safeText(item.size)} · ${safeText(item.color)}<br>${money(item.price)}</p>
        <div class="quantity-controls"><button type="button" data-quantity="${safeText(item.key)}" data-delta="-1" aria-label="Diminuir quantidade">−</button><span>${item.quantity}</span><button type="button" data-quantity="${safeText(item.key)}" data-delta="1" aria-label="Aumentar quantidade">+</button></div>
        <button class="remove-item" type="button" data-remove="${safeText(item.key)}">Remover</button>
      </div><strong>${money(item.price*item.quantity)}</strong>
    </div>`).join("") : '<p class="cart-empty">Sua sacola está vazia. Que tal encontrar um look favorito?</p>';
  $("#checkout-button").disabled = count === 0;
  $("#checkout-button").style.opacity = count === 0 ? ".55" : "1";
}
function openCart() {
  $("#cart-drawer").hidden = false;
  $("#drawer-backdrop").hidden = false;
  $("#close-cart").focus();
}
function closeCart() {
  $("#cart-drawer").hidden = true;
  $("#drawer-backdrop").hidden = true;
  $("#open-cart").focus();
}
function showProduct(id) {
  const product = products.find(item=>item.id===Number(id));
  if (!product) return;
  $("#product-detail").innerHTML = `<div class="detail-layout"><div class="detail-art">${product.image ? `<img src="${safeText(product.image)}" alt="${safeText(product.name)}" style="width:100%;height:100%;max-height:420px;object-fit:cover">` : safeText(product.art)}</div><div class="detail-copy"><span class="product-category">${safeText(product.category)}</span><h2>${safeText(product.name)}</h2><p>${safeText(product.description)}</p><p class="detail-price">${money(product.price)}</p><p class="demo-note">Preço informado nas publicações da loja. Confirme disponibilidade antes de finalizar o pedido.</p>
    <label for="detail-size">Tamanho</label><select id="detail-size">${product.sizes.map(size=>`<option value="${safeText(size)}">${safeText(size)}</option>`).join("")}</select>
    <label for="detail-color">Cor</label><select id="detail-color">${product.colors.map(color=>`<option value="${safeText(color)}">${safeText(color)}</option>`).join("")}</select>
    <button class="primary-button checkout-button" type="button" id="detail-add">ADICIONAR À SACOLA</button></div></div>`;
  $("#product-dialog").showModal();
  $("#detail-add").addEventListener("click",()=>{addToCart(product.id,$("#detail-size").value,$("#detail-color").value);$("#product-dialog").close();});
}
$("#search-form").addEventListener("submit",event=>{event.preventDefault();searchTerm=$("#search-input").value.trim();renderProducts();$("#produtos").scrollIntoView({behavior:"smooth"});});
$("#search-input").addEventListener("input",()=>{searchTerm=$("#search-input").value.trim();renderProducts();});
$("#category-filter").addEventListener("change",event=>{activeCategory=event.target.value;renderProducts();});
$("#sort-filter").addEventListener("change",renderProducts);
document.querySelectorAll(".main-nav [data-category]").forEach(link=>link.addEventListener("click",()=>{activeCategory=link.dataset.category;$("#category-filter").value=activeCategory;renderProducts();}));
productGrid.addEventListener("click",event=>{
  const add=event.target.closest("[data-add]");
  const details=event.target.closest("[data-details]");
  if(add)showProduct(add.dataset.add);
  if(details)showProduct(details.dataset.details);
});
productGrid.addEventListener("keydown",event=>{if((event.key==="Enter"||event.key===" ")&&event.target.matches("[data-details]")){event.preventDefault();showProduct(event.target.dataset.details);}});
$("#clear-filters").addEventListener("click",()=>{activeCategory="Todas";searchTerm="";$("#search-input").value="";$("#category-filter").value="Todas";$("#sort-filter").value="featured";renderProducts();});
$("#open-cart").addEventListener("click",openCart);
$("#close-cart").addEventListener("click",closeCart);
$("#drawer-backdrop").addEventListener("click",closeCart);
$("#cart-items").addEventListener("click",event=>{
  const remove=event.target.closest("[data-remove]");
  const quantity=event.target.closest("[data-quantity]");
  if(remove){cart.delete(remove.dataset.remove);renderCart();return;}
  if(quantity){const item=cart.get(quantity.dataset.quantity);if(!item)return;item.quantity+=Number(quantity.dataset.delta);if(item.quantity<=0)cart.delete(item.key);else cart.set(item.key,item);renderCart();}
});
$("#checkout-button").addEventListener("click",()=>{if(cart.size===0){notify("Adicione um produto antes de continuar.");return;}$("#checkout-error").textContent="";$("#checkout-success").hidden=true;$("#checkout-form").hidden=false;$("#checkout-dialog").showModal();});
$("#close-product-dialog").addEventListener("click",()=>$("#product-dialog").close());
$("#close-checkout-dialog").addEventListener("click",()=>$("#checkout-dialog").close());
$("#checkout-form").addEventListener("submit",event=>{
  event.preventDefault();
  const name=$("#customer-name").value.trim();
  const email=$("#customer-email").value.trim();
  const emailValid=/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if(name.length<3){$("#checkout-error").textContent="Informe seu nome completo (mínimo de 3 caracteres).";$("#customer-name").focus();return;}
  if(!emailValid){$("#checkout-error").textContent="Informe um e-mail válido.";$("#customer-email").focus();return;}
  const orderTotal=[...cart.values()].reduce((sum,item)=>sum+item.price*item.quantity,0);
  $("#checkout-form").hidden=true;
  $("#checkout-success").hidden=false;
  $("#checkout-success").innerHTML=`<strong>Validação concluída!</strong><br>Olá, ${safeText(name)}. O pedido demonstrativo de ${money(orderTotal)} passou pelas validações básicas.<br><br>Nenhuma compra foi realizada e nenhum pagamento foi processado.`;
});
document.addEventListener("keydown",event=>{if(event.key==="Escape"&&!$("#cart-drawer").hidden)closeCart();});
$("#year").textContent=new Date().getFullYear();
renderProducts();
renderCart();
