require('dotenv').config();
let axios = require("axios").default;

const options = require('./config/axios')

const getProducts = async () => {
    try {
        let hasNextPage = true;
        let endCursor = '';
        const allProducts = [];

        // as we can not get all products at a same time from shopify graphql i make loop
        // then after made sorting

        while (hasNextPage) {
            let query = `query {
                products(first: 250 , sortKey: TITLE) {
                  edges {cursor
                    node {
                      id
                      title
                      description
                    }
                  }pageInfo {
                    hasNextPage
                    endCursor
                  }
                }
              }`;

              const variables = {
                cursor: endCursor
              };

              options.params = {
                query,
                variables
              };

              const allOrders = await axios.request(options);

              const {edges, pageInfo } = allOrders.data.data.products;

              allProducts.push(...edges);

              hasNextPage = pageInfo.hasNextPage;

              if (hasNextPage) {
                endCursor = pageInfo.endCursor;
              }

        }

        console.log(allProducts);

        allProducts.sort(function(a, b){
            if(a.title < b.title) { return -1; }
            if(a.title > b.title) { return 1; }
            return 0;
        })

        console.log(allProducts);

    } catch (error) {
        console.log(error);
    }

}

getProducts();