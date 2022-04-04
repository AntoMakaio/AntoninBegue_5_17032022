const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const productId = urlParams.get("id");
let prixProduit = 0;

fetch(`http://localhost:3000/api/products/${productId}`)
  .then((reponse) => reponse.json())
  .then((api) => donneeProduit(api));

function donneeProduit(canape) {
  const colors = canape.colors;
  const name = canape.name;
  const price = canape.price;
  const imageUrl = canape.imageUrl;
  const description = canape.description;
  const altTxt = canape.altTxt;
  prixProduit = canape.price;
  ajoutImage(imageUrl, altTxt);
  ajoutTitre(name);
  ajoutPrix(price);
  ajoutDescription(description);
  ajoutCouleurs(colors);
  //   console.log(canape);
}

function ajoutImage(imageUrl, altTxt) {
  const image = document.createElement("img");
  image.src = imageUrl;
  image.alt = altTxt;
  const parent = document.querySelector(".item__img");
  parent.appendChild(image);
}

function ajoutTitre(name) {
  document.querySelector("#title").textContent = name;
}

function ajoutPrix(price) {
  document.querySelector("#price").textContent = price;
}

function ajoutDescription(description) {
  document.querySelector("#description").textContent = description;
}

function ajoutCouleurs(colors) {
  const selectionCouleur = document.querySelector("#colors");
  colors.forEach((couleur) => {
    const option = document.createElement("option");
    option.value = couleur;
    option.textContent = couleur;
    selectionCouleur.appendChild(option);
  });
}

const button = document.querySelector("#addToCart");

button.addEventListener("click", (e) => {
  const couleur = document.querySelector("#colors").value;
  const quantite = document.querySelector("#quantity").value;
  if (couleur == null || couleur === "") {
    alert("Choisissez une couleur");
  } else if (quantite == null || quantite == 0) {
    alert("Choisissez une quantité");
  }

  const donnee = {
    id: productId,
    price: prixProduit,
    color: couleur,
    quantity: Number(quantite),
  };
  localStorage.setItem(productId, JSON.stringify(donnee));
  window.location.href = "./cart.html";
});