const AWS = require('aws-sdk');
const PRODUCTS_TABLE_NAME = 'products'; // Update with your products table name

// Configure the AWS SDK to use the local DynamoDB endpoint
AWS.config.update({
  region: 'local',
  endpoint: 'http://localhost:8000'
});

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.addToCart = async (event) => {
  const { productId, quantity, price } = JSON.parse(event.body);

  
  // Convert price to a number
  const parsedPrice = parseFloat(price.replace('$', ''));

  // Fetch the price of the product
  const productParams = {
    TableName: PRODUCTS_TABLE_NAME,
    Key: { productId }
  };

  try {
    const { Item: product } = await dynamoDb.get(productParams).promise();
    if (!product) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'Product not found' })
      };
    }

    const totalPrice = parsedPrice * quantity;

    // Print totalPrice in the console
    console.log('Total Price:', totalPrice);


    // Add item to cart
    const cartParams = {
      TableName: 'cart',
      Item: {
        productId,
        quantity,
        price: parsedPrice,
        totalPrice
      }
    };

    await dynamoDb.put(cartParams).promise();

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Item added to cart successfully', totalPrice })
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to add item to cart' })
    };
  }
};
