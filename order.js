let axios = require("axios").default;

const options = require('./config/axios');

const getShopifyOrder = async (cursor, limit) => {
  try {

    let query = '';

    if(cursor) {
      query = `query {
        orders ( query: "created_at:>=2022-12-12 AND created_at:<2022-12-29", first: ${limit}, after: "${cursor}", sortKey: CREATED_AT ) {
          edges {
            node {
              id
              name
              email
            }
          }pageInfo {
            hasNextPage
            endCursor
          }
        }
      }`;
    } else {
      query = `query {
        orders ( query: "created_at:>=2022-12-12 AND created_at:<2022-12-29", first: ${limit}, sortKey: CREATED_AT) {
          edges {
            node {
              id
              name
              email
            }
          }pageInfo {
            hasNextPage
            endCursor
          }
        }
      }`;
    }

    options.params = {
      query
    };

    const allOrders = await axios.request(options);

    const { edges, pageInfo } = allOrders.data.data.orders;


    const orders = edges.map(x => {

      return x.node;

    })

    return {
      orders, 
      pageInfo
    }

  } catch (error) {
    console.log("error from get product from shopify", error.message);

    throw error;
  }
}

const getOrders = async (page, orderLimit) => {

    try {

      let limit = orderLimit ? orderLimit : 5;

      const pageNumber = page ? page  : 1;

      let offset = 5;

      if(pageNumber === 1) {

       const { orders, pageInfo } = await getShopifyOrder(null, limit);

        console.log("orders", orders);

        return;
        
      }
      
      offset = limit * (pageNumber - 1);

      let endCursor = '';

      let query = `query {
        orders (query: "created_at:>=2022-12-12 AND created_at:<2022-12-29", first: ${offset}, sortKey: CREATED_AT ) {
          edges {
            node {
              id
            }
          }pageInfo {
            hasNextPage
            endCursor
          }
        }
      }`;

      options.params = {
        query
      };

      const allOrders = await axios.request(options);

      const { pageInfo } = allOrders.data.data.orders;

      if(pageInfo.hasNextPage) {

        endCursor = pageInfo.endCursor;

        const { orders } = await getShopifyOrder(endCursor, limit);

        console.log("orders", orders);

      }

    } catch (error) {

        console.log(error);

    }

}

getOrders(1,5); // add page and order limit 