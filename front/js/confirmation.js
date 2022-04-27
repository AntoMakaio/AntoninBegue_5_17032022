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
  numeroCommande.innerHTML = `<br/><br/>${orderId}<br/><p>Merci pour votre achat<br/><br/>À bientôt !</p>`;
}

function suppressionCache() {
  const cache = window.localStorage;
  cache.clear();
}
