const AWS = require('aws-sdk');

// Configure the AWS SDK to use the local DynamoDB endpoint
AWS.config.update({
  region: 'local',
  endpoint: 'http://localhost:8000'
});

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.getAllCart = async (event) => {
  console.log('Event:', event);

  const params = {
    TableName: 'cart',
  };

  try {
    const { Items } = await dynamoDb.scan(params).promise();

    // Calculate total price
    const totalPrice = Items.reduce((total, item) => total + parseFloat(item.totalPrice), 0);

    // Print total price in the console
    console.log('Total Price:', totalPrice);

    return {
      statusCode: 200,
      body: JSON.stringify({ items: Items, totalPrice })
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to retrieve cart items' })
    };
  }
};
