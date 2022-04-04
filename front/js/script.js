//Récupération données de l'API
fetch("http://localhost:3000/api/products")
  .then((reponse) => reponse.json())
  .then((api) => {
    console.log(api);
    return ajoutProduits(api);
  });

// fonction création carte produit
function ajoutProduits(api) {
  // création boucle produit sur l'api
  for (let i = 0; i < api.length; i++) {
    // récupération données api et déclaration
    // variable des informations carte produit
    const id = api[i]._id;
    const imageUrl = api[i].imageUrl;
    const altTxt = api[i].altTxt;
    const name = api[i].name;
    const description = api[i].description;

    // ajout de paramètre aux variables
    const lienCarte = ajoutLien(id);
    const article = document.createElement("article");
    const image = ajoutImage(imageUrl, altTxt);
    const h3 = ajoutH3(name);
    const p = ajoutTexte(description);

    // ajout de l'image, titre et description
    // à la carte produit (article) + ajout lien et carte
    article.appendChild(image);
    article.appendChild(h3);
    article.appendChild(p);
    ajoutBalise(lienCarte, article);
  }
}

// ajout de l'id du produit dans le lien
function ajoutLien(id) {
  const lienCarte = document.createElement("a");
  lienCarte.href = "./product.html?id=" + id;
  return lienCarte;
}

//ajout du lien et de la carte produit
function ajoutBalise(lienCarte, article) {
  const items = document.querySelector("#items");
  items.appendChild(lienCarte);
  lienCarte.appendChild(article);
}

// ajout de l'image et du alt texte dans la carte produit
function ajoutImage(imageUrl, altTxt) {
  const image = document.createElement("img");
  image.src = imageUrl;
  image.alt = altTxt;
  return image;
}

// ajout de la balise h3 dans la carte produit
function ajoutH3(name) {
  const h3 = document.createElement("h3");
  h3.textContent = name;
  h3.classList.add("productName");
  return h3;
}

// ajout du texte descrition dans la carte produit
function ajoutTexte(description) {
  const p = document.createElement("p");
  p.textContent = description;
  p.classList.add("productDescrition");
  return p;
}
