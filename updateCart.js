const AWS = require('aws-sdk');

// Configure the AWS SDK to use the local DynamoDB endpoint
AWS.config.update({
  region: 'local',
  endpoint: 'http://localhost:8000'
});

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.updateCart = async (event) => {
    console.log('Event:', event);
    const { quantity } = JSON.parse(event.body);
    const { productId } = event.pathParameters; // Extract productId from path parameters
    console.log('Parsed Body:', productId, quantity);
  
    const params = {
      TableName: 'cart',
      Key: {
        productId: productId
      },
      UpdateExpression: 'SET quantity = :quantity',
      ExpressionAttributeValues: {
        ':quantity': quantity
      },
      ReturnValues: 'UPDATED_NEW'
    };
  
    try {
      const data = await dynamoDb.update(params).promise();
      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Item updated in cart successfully', data: data.Attributes })
      };
    } catch (error) {
      console.error('Error:', error);
      return {
        statusCode: 500,
        body: JSON.stringify({ message: 'Failed to update item in cart' })
      };
    }
};
