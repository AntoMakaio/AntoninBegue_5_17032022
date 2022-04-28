/**
 * Je récupère l'Id produit depuis l'url et déclare les variables globales du produit
 */
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const productId = urlParams.get("id");
let prixProduit = 0;
let urlImageLocal, altTxtLocal, nomProduit;

// Je récupère les données de l'API avec fetch
fetch(`http://localhost:3000/api/products/${productId}`)
  .then((reponse) => reponse.json())
  .then((api) => donneeProduit(api));

/**
 * J'affiche sur la page le produit retourné par l'API
 * @param {object} canape
 */
function donneeProduit(canape) {
  const colors = canape.colors;
  const name = canape.name;
  const price = canape.price;
  const imageUrl = canape.imageUrl;
  const description = canape.description;
  const altTxt = canape.altTxt;
  prixProduit = canape.price;
  urlImageLocal = imageUrl;
  altTxtLocal = altTxt;
  nomProduit = name;
  ajoutImage(imageUrl, altTxt);
  ajoutTitre(name);
  ajoutPrix(price);
  ajoutContenuPanier(description);
  ajoutCouleurs(colors);
}

/**
 * description
 * @param {string} imageUrl
 * @param {string} altTxt
 */
function ajoutImage(imageUrl, altTxt) {
  const image = document.createElement("img");
  image.src = imageUrl;
  image.alt = altTxt;
  const parent = document.querySelector(".item__img");
  parent.appendChild(image);
}

/**
 * description
 * @param {string} name
 */
function ajoutTitre(name) {
  document.querySelector("#title").textContent = name;
}

/**
 * description
 * @param {number} price
 */
function ajoutPrix(price) {
  document.querySelector("#price").textContent = price;
}

/**
 * J'ajoute le texte description dans la carte produit
 * @param {string} description
 */
function ajoutContenuPanier(description) {
  document.querySelector("#description").textContent = description;
}

/**
 * description
 * @param {object} colors
 */
function ajoutCouleurs(colors) {
  const selectionCouleur = document.querySelector("#colors");

  colors.forEach((couleur) => {
    const option = document.createElement("option");
    option.value = couleur;
    option.textContent = couleur;
    selectionCouleur.appendChild(option);
  });
}

/**
 * description
 */
const button = document.querySelector("#addToCart");
let canapesStockes = JSON.parse(localStorage.getItem("canapesStockes"));
if (!canapesStockes) [(canapesStockes = [])];

/**
 * description
 */
button.addEventListener("click", (e) => {
  const couleur = document.querySelector("#colors").value;
  const quantite = document.querySelector("#quantity").value;
  if (couleur === "" && quantite == 0) {
    alert("Choisissez une couleur et une quantité");
    return;
  } else if (couleur === "") {
    alert("Choisissez une couleur");
    return;
  } else if (quantite == 0 || quantite < 0 || quantite > 100) {
    alert("Choisissez un nombre d'article entre 1 et 100");
    return;
  }

  const produitActualise = canapesStockes.find(
    (item) => item.id === productId && item.color === couleur
  );

  if (!produitActualise) {
    const donnee = {
      id: productId,
      color: couleur,
      quantity: Number(quantite),
    };
    canapesStockes.push(donnee);
  } else {
    const quantiteActualise =
      Number(produitActualise.quantity) + Number(quantite);
    produitActualise.quantity = quantiteActualise;
  }

  localStorage.setItem("canapesStockes", JSON.stringify(canapesStockes));
  window.location.href = "./cart.html";
});
