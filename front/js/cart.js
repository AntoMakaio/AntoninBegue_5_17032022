const panier = [];

recuperationCache();

console.log(panier);

panier.forEach((produit) => ajoutProduit(produit));

function recuperationCache() {
  const nombreArticle = localStorage.length;
  for (let i = 0; i < nombreArticle; i++) {
    const produit = localStorage.getItem(localStorage.key(i));
    const objetProduit = JSON.parse(produit);
    panier.push(objetProduit);
  }
}

function ajoutProduit(produit) {
  const article = ajoutArticle(produit);
  const divImage = ajoutImage(produit);
  article.appendChild(divImage);

  const elementProduit = ajoutContenuPanier(produit);
  article.appendChild(elementProduit);
  affichageArticle(article);
  affichageQuantiteTotal();
  affichagePrixTotal();
}

function affichageQuantiteTotal() {
  const quantiteTotal = document.querySelector("#totalQuantity");

  //transforme l'array panier en une seule valeur total
  const total = panier.reduce((total, produit) => total + produit.quantity, 0);
  quantiteTotal.textContent = total;
}

function affichagePrixTotal() {
  const prixTotal = document.querySelector("#totalPrice");

  //transforme l'array panier en une seule valeur total
  const total = panier.reduce(
    (total, produit) => total + produit.price * produit.quantity,
    0
  );
  prixTotal.textContent = total;
}

function ajoutContenuPanier(produit) {
  const elementProduit = document.createElement("div");
  elementProduit.classList.add("cart__item__content");
  const description = ajoutDescription(produit);
  const settings = ajoutSettings(produit);

  elementProduit.appendChild(description);
  elementProduit.appendChild(settings);
  return elementProduit;
  //   elementProduit.appendChild(settings)
}

function ajoutSettings(produit) {
  const settings = document.createElement("div");
  settings.classList.add("cart__item__content__settings");

  ajoutQuantite(settings, produit);
  ajoutSupprimer(settings);
  return settings;
}

function ajoutSupprimer(settings) {
  const div = document.createElement("div");
  div.classList.add("cart__item__content__settings__delete");
  const p = document.createElement("p");
  p.textContent = "supprimer";
  div.appendChild(p);
  settings.appendChild(div);
}

function ajoutQuantite(settings, produit) {
  const quantite = document.createElement("div");
  quantite.classList.add("cart__item__content__settings__quantity");
  const p = document.createElement("p");
  p.textContent = "Qté : ";
  quantite.appendChild(p);
  const input = document.createElement("input");
  input.type = "number";
  input.classList.add("itemQuantity");
  input.name = "itemQuantity";
  input.min = "1";
  input.max = "100";
  input.value = produit.quantity;
  input.addEventListener("input", () =>
    updatePriceAndQuantity(produit.id, input.value)
  );

  quantite.appendChild(input);
  settings.appendChild(quantite);
}

function updatePriceAndQuantity(id, newValue) {
  const itemToUpdate = panier.find((produit) => produit.id === id);
  itemToUpdate.quantity = Number(newValue);
  affichageQuantiteTotal();
  affichagePrixTotal();
}

// function gestionQuantitePrix(id) {
//   console.log(id);
//   const miseAjourProduit = panier.find((produit) => produit.id === id);
//   console.log(miseAjourProduit);
// }

function ajoutDescription(produit) {
  const description = document.createElement("div");
  description.classList.add("card__item__content__description");

  const h2 = document.createElement("h2");
  h2.textContent = produit.name;

  const pColor = document.createElement("p");
  pColor.textContent = produit.color;

  const pPrice = document.createElement("p");
  pPrice.textContent = produit.price + " €";

  description.appendChild(h2);
  description.appendChild(pColor);
  description.appendChild(pPrice);

  return description;
}

function affichageArticle(article) {
  document.querySelector("#cart__items").appendChild(article);
}

function ajoutArticle(produit) {
  const article = document.createElement("article");
  article.classList.add("cart__item");
  article.dataset.id = produit.id;
  article.dataset.color = produit.color;

  return article;
}

function ajoutImage(produit) {
  const div = document.createElement("div");
  div.classList.add("cart__item__img");

  const image = document.createElement("img");
  image.src = produit.imageUrl;
  image.alt = produit.altTxt;
  div.appendChild(image);

  return div;
}
