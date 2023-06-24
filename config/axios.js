require('dotenv').config();

const axiosOptions = {
    method: 'post',
    headers: {
        'content-type': 'application/json',
        'X-Shopify-Access-Token': process.env.ACCESS_TOKEN
    },
    url: `https://${process.env.STORE_NAME}.myshopify.com/admin/api/2022-04/graphql.json`,
};

module.exports = axiosOptions