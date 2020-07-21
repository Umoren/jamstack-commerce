<template>
  <div class="layout">
    <header class="container header">
      <div class="header__brand">
        <g-image class="header__brand-image" width="50" src="~/assets/images/apicart-logo.png" alt="" />
        <h1 class="header__brand-title"> JAMstack E-commerce</h1>
      </div>
      <apicart-cart-dropdown @toggle-button-click="openCheckout" @footer-button-click="openCheckout" />
    </header>
    <main class="container">
      <slot />
    </main>

       <apicart-checkout-dialog ref="apicartCheckoutDialog" />
       <apicart-cart-dialog ref="apicartCartDialog" />
       <apicart-order-dialog ref="apicartOrderDialog" />
  </div>
</template>

<script>
import { ApicartCartDropdown, ApicartCheckoutDialog, ApicartCartDialog, ApicartOrderDialog } from '~/assets/js/app.js';

export default {
   components: {
        ApicartCartDropdown,
        ApicartCartDialog,
        ApicartCheckoutDialog,
        ApicartOrderDialog
   },
   methods: {
       openCheckout() {
           this.$refs.apicartCheckoutDialog.open();
       }
   }
}
</script>

<style>
body, html {
   margin: 0;
   padding: 0;
}
* {
   box-sizing: border-box;
}
body {
   font-family: Arial, Helvetica, sans-serif;
}
.container {
   max-width: 1240px;
   margin: 0 auto;
}
.header {
   display: flex;
   align-items: center;
   justify-content: space-between;
}
.header__brand {
   display: flex;
   align-items: center;
}
.header__brand-image {
   width: 50px;
   margin-right: 10px;
}
.header__brand-title {
   margin: 0;
   font-weight: normal;
}
.header__wrapper {
   border-bottom: 1px solid #eee;
   padding: 20px 10px
}
</style>