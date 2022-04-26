const panier = [];
let prixProduit = 0;
let urlImageLocal, altTxtLocal, nomProduit;
// requete vers l'API, recuperation de tous les produits
function recuperationDesCanapes() {
  return fetch(`http://localhost:3000/api/products/`)
    .then((reponse) => reponse.json())
    .then((api) => (tousLesCanapes = api));
}

async function recuperationCache() {
  let canapesLocalStorage = JSON.parse(localStorage.getItem("canapesStockes"));

  // utilisation de la propriete await (requete donc attente de réponse)
  let canapesAPI = await recuperationDesCanapes();
  // je fais une boucle sur les canape du localStorage
  canapesLocalStorage.forEach(function (canape) {
    // Je récupere le position du canape dans l'index avec la propriete findIndex
    const canapIndex = canapesAPI.findIndex((item) => item._id === canape.id);

    const canapeAGarder = Object.assign(canape, canapesAPI[canapIndex]);

    panier.push(canapeAGarder);
  });
  // }
  panier.forEach((produit) => ajoutProduit(produit));
}

recuperationCache();

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
  console.log(total);
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
}

function ajoutSettings(produit) {
  const settings = document.createElement("div");
  settings.classList.add("cart__item__content__settings");

  ajoutQuantite(settings, produit);
  ajoutSupprimer(settings, produit);
  return settings;
}

function ajoutSupprimer(settings, produit) {
  const div = document.createElement("div");
  div.classList.add("cart__item__content__settings__delete");
  div.addEventListener("click", () => suppressionProduit(produit));

  const p = document.createElement("p");
  p.textContent = "supprimer";
  div.appendChild(p);
  settings.appendChild(div);
}

function suppressionProduit(produit) {
  const suppressionProduit = panier.findIndex(
    (item) => item.id === produit.id && item.color === produit.color
  );
  panier.splice(suppressionProduit, 1);
  affichageQuantiteTotal();
  affichagePrixTotal();
  sauvegardePanier();
  suppressionArticlePagePanier(produit);
}

function suppressionArticlePagePanier(produit) {
  const articleSupprime = document.querySelector(
    `article[data-id="${produit.id}"][data-color="${produit.color}"]`
  );
  articleSupprime.remove();
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
    gestionQuantitePrix(input.value, produit)
  );

  quantite.appendChild(input);
  settings.appendChild(quantite);
}

function gestionQuantitePrix(nouvelleValeur, produit) {
  const produitActualise = panier.find(
    (item) => item.id === produit.id && item.color === produit.color
  );
  produitActualise.quantity = Number(nouvelleValeur);
  produit.quantity = produitActualise.quantity;
  affichageQuantiteTotal();
  affichagePrixTotal();
  sauvegardePanier();
}

function sauvegardePanier() {
  localStorage.setItem("canapesStockes", JSON.stringify(panier));
}

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

// $$$$$$$$ FORMULAIRE $$$$$$$$

const boutonFormulaire = document.querySelector("#order");
boutonFormulaire.addEventListener("click", (e) => envoiFormulaire(e));

function envoiFormulaire(e) {
  e.preventDefault();
  if (panier.length === 0) {
    alert("Sélectionnez un produit");
    return;
  }

  if (formulaireInvalide()) return;
  if (emailInvalide()) return;

  const pagePanier = requette();
  fetch("http://localhost:3000/api/products/order", {
    method: "POST",
    body: JSON.stringify(pagePanier),
    headers: {
      "content-Type": "application/json",
    },
  })
    .then((reponse) => reponse.json())
    .then((donnee) => {
      const orderId = donnee.orderId;

      window.location.href = "./confirmation.html" + "?orderId=" + orderId;
    });
}

function formulaireInvalide() {
  const formulaire = document.querySelector(".cart__order__form");
  const inputs = Array.from(formulaire.querySelectorAll("input:required"));
  const isInvalide = inputs.every((input) => input.value !== "");
  if (!isInvalide) {
    alert("Remplissez tout les champs du fomulaire");
    return true;
  }
  return false;
}

function emailInvalide() {
  const email = document.querySelector("#email").value;
  const regex =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (regex.test(email) === false) {
    alert("Entrez une adresse email valide");
    return true;
  }
  return false;
}

function requette() {
  const formulaire = document.querySelector(".cart__order__form");
  const firstName = formulaire.elements.firstName.value;
  const lastName = formulaire.elements.lastName.value;
  const address = formulaire.elements.address.value;
  const city = formulaire.elements.city.value;
  const email = formulaire.elements.email.value;
  const pagePanier = {
    contact: {
      firstName: firstName,
      lastName: lastName,
      address: address,
      city: city,
      email: email,
    },
    products: recuperationIds(),
  };
  console.log(pagePanier);
  return pagePanier;
}

function recuperationIds() {
  const nombreProduit = localStorage.length;
  const ids = [];
  for (let i = 0; i < nombreProduit; i++) {
    const key = localStorage.key(i);
    const id = key.split("-")[0];
    ids.push(id);
  }
  return ids;
}
