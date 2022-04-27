const panier = [];
let prixProduit = 0;
let urlImageLocal, altTxtLocal, nomProduit;

/*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
requete vers l'API, recuperation des données de tous les produits
*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*/

function recuperationDesCanapes() {
  return fetch(`http://localhost:3000/api/products/`)
    .then((reponse) => reponse.json())
    .then((api) => (tousLesCanapes = api));
}

/*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
description
*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*/

async function recuperationCache() {
  let canapesLocalStorage = JSON.parse(localStorage.getItem("canapesStockes"));
  if (!canapesLocalStorage) {
    document.querySelector("#totalQuantity").innerHTML = "0";
    document.querySelector("#totalPrice").innerHTML = "0";
    document.querySelector("h1").innerHTML = "Votre panier est vide";
    return;
  }
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

/*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
description
*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*/

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

/*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
description
*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*/

function affichageQuantiteTotal() {
  const quantiteTotal = document.querySelector("#totalQuantity");

  //transforme l'array panier en une seule valeur total
  const total = panier.reduce((total, produit) => total + produit.quantity, 0);
  // console.log(total);
  quantiteTotal.textContent = total;
}

/*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
description
*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*/

function affichagePrixTotal() {
  const prixTotal = document.querySelector("#totalPrice");

  //transforme l'array panier en une seule valeur total
  const total = panier.reduce(
    (total, produit) => total + produit.price * produit.quantity,
    0
  );
  prixTotal.textContent = total;
}

/*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
description
*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*/

function ajoutContenuPanier(produit) {
  const elementProduit = document.createElement("div");
  elementProduit.classList.add("cart__item__content");
  const description = ajoutDescription(produit);
  const settings = ajoutSettings(produit);

  elementProduit.appendChild(description);
  elementProduit.appendChild(settings);
  return elementProduit;
}

/*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
description
*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*/

function ajoutSettings(produit) {
  const settings = document.createElement("div");
  settings.classList.add("cart__item__content__settings");

  ajoutQuantite(settings, produit);
  ajoutSupprimer(settings, produit);
  return settings;
}

/*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
description
*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*/

function ajoutSupprimer(settings, produit) {
  const div = document.createElement("div");
  div.classList.add("cart__item__content__settings__delete");
  div.addEventListener("click", () => suppressionProduit(produit));

  const p = document.createElement("p");
  p.textContent = "supprimer";
  div.appendChild(p);
  settings.appendChild(div);
}

/*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
description
*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*/

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

/*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
description
*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*/

function suppressionArticlePagePanier(produit) {
  const articleSupprime = document.querySelector(
    `article[data-id="${produit.id}"][data-color="${produit.color}"]`
  );
  articleSupprime.remove();
}

/*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
description
*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*/

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
  input.addEventListener("change", () => {
    const quantite = input.value;
    if (quantite == 0 || quantite < 0 || quantite > 100) {
      alert("Choisissez un nombre d'article entre 1 et 100");
      return;
    }
    gestionQuantitePrix(quantite, produit);
  });

  quantite.appendChild(input);
  settings.appendChild(quantite);
}

/*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
description
*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*/

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

/*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
description
*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*/

function sauvegardePanier() {
  localStorage.setItem("canapesStockes", JSON.stringify(panier));
}

/*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
description
*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*/

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

/*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
description
*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*/

function affichageArticle(article) {
  document.querySelector("#cart__items").appendChild(article);
}

/*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
description
*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*/

function ajoutArticle(produit) {
  const article = document.createElement("article");
  article.classList.add("cart__item");
  article.dataset.id = produit.id;
  article.dataset.color = produit.color;

  return article;
}

/*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
description
*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*/

function ajoutImage(produit) {
  const div = document.createElement("div");
  div.classList.add("cart__item__img");

  const image = document.createElement("img");
  image.src = produit.imageUrl;
  image.alt = produit.altTxt;
  div.appendChild(image);

  return div;
}

//- - - - - - - FORMULAIRE - - - - - - - - - - - - - -

const boutonFormulaire = document.querySelector("#order");
// au clic sur le bouton commander j'envoi le formualaire avec la fonction envoiFormulaire()
boutonFormulaire.addEventListener("click", (e) => envoiFormulaire(e));

/*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
description
*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*/

function envoiFormulaire(e) {
  e.preventDefault();
  if (panier.length === 0) {
    alert("Sélectionnez un produit");
    return;
  }
  if (formulaireInvalide()) return;
  if (inputPrenomInvalide()) return;
  if (inputNomInvalide()) return;
  if (inputAdresseInvalide()) return;
  if (inputVilleInvalide()) return;
  if (emailInvalide()) return;

  // j'envoi la requete POST au back-end
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

/*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
description
*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*/

function requette() {
  const formulaire = document.querySelector(".cart__order__form");
  const firstName = formulaire.elements.firstName.value;
  const lastName = formulaire.elements.lastName.value;
  const address = formulaire.elements.address.value;
  const city = formulaire.elements.city.value;
  const email = formulaire.elements.email.value;

  // en-tête de la requete
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

/*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
description
*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*/

function recuperationIds() {
  const ids = [];
  panier.forEach(function (elt) {
    ids.push(elt.id);
  });
  return ids;
}

/*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
description
*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*/

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

/*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
description
*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*/

function inputPrenomInvalide() {
  const prenom = document.querySelector("#firstName").value;
  // regex de validation des caratères speciaux
  // espaces et tiret maximum caractère 31 et pas sensible à la casse
  const regex = /^[a-záàâäãåçéèêëíìîïñóòôöõúùûüýÿæœ\s-]{1,31}$/i;
  if (regex.test(prenom) === false) {
    document.querySelector("#firstNameErrorMsg").style.color = "white";
    firstNameErrorMsg.textContent = "❌ - Votre prénom n'est pas valide";
    return true;
  }
  return false;
}

/*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
description
*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*/

function inputNomInvalide() {
  const nom = document.querySelector("#lastName").value;
  const regex = /^[a-záàâäãåçéèêëíìîïñóòôöõúùûüýÿæœ\s-]{1,31}$/i;
  if (regex.test(nom) === false) {
    document.querySelector("#lastNameErrorMsg").style.color = "white";
    lastNameErrorMsg.textContent = "❌ - Votre nom n'est pas valide";
    return true;
  }
  return false;
}

/*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
description
*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*/

function inputAdresseInvalide() {
  const adresse = document.querySelector("#address").value;
  const regex = /^[a-z0-9áàâäãåçéèêëíìîïñóòôöõúùûüýÿæœ\s-]{1,60}$/i;
  if (regex.test(adresse) === false) {
    document.querySelector("#addressErrorMsg").style.color = "white";
    addressErrorMsg.textContent = "❌ - Entrez une adresse valide";
    return true;
  }
  return false;
}

/*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
description
*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*/

function inputVilleInvalide() {
  const ville = document.querySelector("#city").value;
  const regex = /^[a-záàâäãåçéèêëíìîïñóòôöõúùûüýÿæœ\s-]{1,31}$/i;
  if (regex.test(ville) === false) {
    document.querySelector("#cityErrorMsg").style.color = "white";
    cityErrorMsg.textContent = "❌ - Entrez un nom de ville valide";
    return true;
  }
  return false;
}

/*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
description
*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*/

function emailInvalide() {
  const email = document.querySelector("#email").value;
  const regex =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (regex.test(email) === false) {
    document.querySelector("#emailErrorMsg").style.color = "white";
    emailErrorMsg.textContent = "❌ - Entrez une adresse email valide";
    return true;
  }
  return false;
}
