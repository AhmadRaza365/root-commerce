export const showHideCartDrawer = () => {
  const cartDrawer = document.getElementById('cart-drawer') as HTMLInputElement;

  if (cartDrawer) {
    cartDrawer.click();
  }
};
