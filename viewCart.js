const AWS = require('aws-sdk');

// Configure the AWS SDK to use the local DynamoDB endpoint
AWS.config.update({
  region: 'local',
  endpoint: 'http://localhost:8000'
});

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.viewCart = async (event) => {
  const { cartItemId } = event.pathParameters;

  const params = {
    TableName: 'cart',
    Key: {
      cartItemId: cartItemId
    }
  };
  
  try {
    const { Item } = await dynamoDb.get(params).promise();
    if (!Item) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'Cart item not found' })
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(Item)
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to retrieve cart item' })
    };
  }
};
