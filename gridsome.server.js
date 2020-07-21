const fs = require('fs');
const faunadb = require('faunadb');
const q = faunadb.query;
// Create FaunaDB client with the token from the .env file
const client = new faunadb.Client({ secret: process.env.FAUNADB_SECRET });
const Utils = require('@apicart/js-utils');

module.exports = function (api) {
   // If the app runs on the dev environment, set Webpack mode to development
   if (process.env.ENV === 'dev') {
       api.chainWebpack(config => {
           config.mode('development')
       });
   }

  api.createManagedPages(async ({ createPage }) => {
    // 1. Preload data from the Fauna Database
    const getTranslations = async () => {
        const response = await client.query(
            q.Map(
                q.Paginate(q.Match(q.Index('allTranslations'))),
                q.Lambda(x => q.Get(x))
            )
        );
        const translations = {};
        response.data.forEach((translation) => {
            const translationData = translation.data;
            Utils.Objects.assign(
                translations, translationData.lang + '.categories', JSON.parse(translationData.translations)
            );
        });
        return translations;
    };

    const getProducts = async () => {
        const response = await client.query(
            q.Map(
                q.Paginate(q.Match(q.Index('allProducts'))),
                item => q.Get(item)
            )
        );

        const products = [];
        response.data.forEach((product) => {
            const dataProvider = process.env.DATA_PROVIDER;
            const productData = product.data;
            Utils.Objects.assign(
                productData,
                'images.primary.url', dataProvider + '/category/product-images/' + productData.id + '.png'
            );
            products.push({
                dataUrl: process.env.DATA_PROVIDER + '/category/product-' + productData.id + '.json',
                data: productData,
                pageUrl: productData.pageUrl
            })
        });

        return products;
    };

    const getCategoryProducts = (products) => {
        const categories = {};
        products.forEach((product) => {
            const productData = product.data;
            let category = Utils.Objects.find(categories, productData.categoryKeyPath);

            if (!category) {
                category = [];
            }
            category.push({
                dataUrl: process.env.DATA_PROVIDER + '/category/product-' + productData.id + '.json',
                data: productData,
                pageUrl: productData.pageUrl
            });
            Utils.Objects.assign(categories, productData.categoryKeyPath, category);
        });

        return categories;
    };

    const products = await getProducts();
    const categoryProducts = getCategoryProducts(products);
    const translations = await getTranslations();

    // 2. Save preloaded data into data files
    fs.writeFileSync("./static/category/products.json", JSON.stringify(categoryProducts));
    fs.writeFileSync("./static/category/translations.json", JSON.stringify(translations));

    products.forEach((product) => {
        fs.writeFileSync('./static/category/product-' + product.data.id +'.json', JSON.stringify(product.data));
    });

    // 3. Create the homepage
    createPage({
        path: '/',
        component: './src/components/Homepage.vue'
    });

    // 4. Create product pages
    const productPages = [];
    products.forEach((product) => {
        productPages.push({
            path: product.pageUrl,
            component: './src/components/ProductDetail.vue',
            context: {
                productUrl: product.dataUrl,
                productData: product.data
            }
        })
    });

    productPages.forEach((pageConfig) => {
        createPage(pageConfig);
    });
});
}