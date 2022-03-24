//Récupération données de l'API
fetch("http://localhost:3000/api/products")
  .then((reponse) => reponse.json())
  .then((api) => {
    console.log(api);
    return ajoutProduits(api);
  });

// déclaration variable des informations carte produit
function ajoutProduits(api) {
  const id = api[0]._id;
  const imageUrl = api[0].imageUrl;
  const altTxt = api[0].altTxt;
  const name = api[0].name;
  const description = api[0].description;

  // ajout des paramètres
  const lienCarte = ajoutLien(id);
  const article = ajoutArticle();
  const image = ajoutImage(imageUrl, altTxt);
  const h3 = ajoutH3(name);
  const p = ajoutTexte(description);

  article.appendChild(image);
  article.appendChild(h3);
  article.appendChild(p);
  ajoutBalise(lienCarte, article);
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
  console.log(items);
}

// ajout de l'image et du alt texte dans la carte produit
function ajoutImage(imageUrl, altTxt) {
  const image = document.createElement("img");
  image.src = imageUrl;
  image.alt = altTxt;
  return image;
}

// ajout de la balise article
function ajoutArticle() {
  const article = document.createElement("article");
  console.log(article);
  return article;
}

// ajout de la balise h3
function ajoutH3(name) {
  const h3 = document.createElement("h3");
  h3.textContent = name;
  h3.classList.add("productName");
  return h3;
}

// ajout ddu texte descrition produit
function ajoutTexte(description) {
  const p = document.createElement("p");
  p.textContent = description;
  p.classList.add("productDescrition");
  return p;
}
