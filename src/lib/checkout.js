const CHECKOUT_EVENT = "sama-boutique:checkout";
const PLAN_NAMES = {
  solo: "Solo",
  "3-caisses": "3 Caisses",
};

export function startCheckout(plan) {
  const name = PLAN_NAMES[plan];
  if (!name) throw new Error(`Offre inconnue : ${plan}`);

  window.dispatchEvent(
    new CustomEvent(CHECKOUT_EVENT, { detail: { plan, name } }),
  );
}

export function subscribeToCheckout(callback) {
  const handleCheckout = (event) => callback(event.detail);
  window.addEventListener(CHECKOUT_EVENT, handleCheckout);
  return () => window.removeEventListener(CHECKOUT_EVENT, handleCheckout);
}
