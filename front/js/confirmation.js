const orderId = recuperationId();
ajoutNumeroCommande(orderId);
suppressionCache();

function recuperationId() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get("orderId");
}

function ajoutNumeroCommande(orderId) {
  const numeroCommande = document.getElementById("orderId");
  numeroCommande.textContent = orderId;
}

function suppressionCache() {
  const cache = window.localStorage;
  cache.clear();
}

// console.log(orderId);
