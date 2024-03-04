const AWS = require('aws-sdk');

// Configure the AWS SDK to use the local DynamoDB endpoint
AWS.config.update({
  region: 'local',
  endpoint: 'http://localhost:8000'
});

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.removeAllFromCart = async (event) => {
    console.log('Event:', event);
  
    const scanParams = {
      TableName: 'cart'
    };
  
    try {
      const { Items } = await dynamoDb.scan(scanParams).promise();
      const deletePromises = Items.map(item => {
        const deleteParams = {
          TableName: 'cart',
          Key: {
            productId: item.productId
          }
        };
        return dynamoDb.delete(deleteParams).promise();
      });
  
      await Promise.all(deletePromises);
  
      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'All items removed from cart successfully' })
      };
    } catch (error) {
      console.error('Error:', error);
      return {
        statusCode: 500,
        body: JSON.stringify({ message: 'Failed to remove all items from cart' })
      };
    }
  };
  