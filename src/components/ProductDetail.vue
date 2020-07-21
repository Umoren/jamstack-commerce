<template>
 <Layout>
     <p class="breadcrumb">
       <g-link to="/" class="breadcrumb__link">
           <strong class="breadcrumb__icon apicart-icon-arrow-left-circle"></strong>
           <strong>Back to category</strong>
       </g-link>
     </p>
     <div>
       <apicart-product-detail :productUrl="$context.productUrl" :productData="$context.productData" />
     </div>
 </Layout>
</template>

<script>
import { ApicartProductDetail } from '~/assets/js/app.js';

export default {
   components: {
       'apicart-product-detail': ApicartProductDetail
   },
   metaInfo() {
       return {
           title: this.$context.productData.name,
           meta: [
               { key: 'description', name: 'description', content: this.$context.productData.description }
           ]
       }
   }
}
</script>

<style>
.breadcrumb {
   margin: 24px 0;
}
.breadcrumb__icon {
   margin-right: 4px;
}
.breadcrumb__link {
   display: flex;
   padding-bottom: 2px;
   align-items: center;
   color: inherit;
   text-decoration: none;
   border-bottom: 1px solid;
   display: inline-block;
}
</style>