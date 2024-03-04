const AWS = require('aws-sdk');

// Configure the AWS SDK to use the local DynamoDB endpoint
AWS.config.update({
  region: 'local',
  endpoint: 'http://localhost:8000'
});

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.removeFromCart = async (event) => {
    console.log('Event:', event);
    const { productId } = event.pathParameters;
    console.log('Path Parameters:', productId);

    
    const params = {
      TableName: 'cart',
      Key: {
        productId: productId
      }
    };
  
    try {
      await dynamoDb.delete(params).promise();
      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Item removed from cart successfully' })
      };
    } catch (error) {
      console.error('Error:', error);
      return {
        statusCode: 500,
        body: JSON.stringify({ message: 'Failed to remove item from cart' })
      };
    }
  };
  