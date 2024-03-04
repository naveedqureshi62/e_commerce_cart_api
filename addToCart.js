const AWS = require('aws-sdk');

// Configure the AWS SDK to use the local DynamoDB endpoint
AWS.config.update({
  region: 'local',
  endpoint: 'http://localhost:8000'
});

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.addToCart = async (event) => {
  console.log('Event:', event);
  const { productId, quantity } = JSON.parse(event.body);
  console.log('Parsed Body:', productId, quantity);
  
  const params = {
    TableName: 'cart',
    Item: {
      productId: productId,
      quantity: quantity
    }
  };

  try {
    await dynamoDb.put(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Item added to cart successfully' })
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to add item to cart' })
    };
  }
};
