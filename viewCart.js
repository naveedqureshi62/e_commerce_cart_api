const AWS = require('aws-sdk');

// Configure the AWS SDK to use the local DynamoDB endpoint
AWS.config.update({
  region: 'local',
  endpoint: 'http://localhost:8000'
});

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.viewCart = async (event) => {
  console.log('Event:', event);

  const params = {
    TableName: 'cart',
  };

  try {
    const { Items } = await dynamoDb.scan(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify(Items)
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to retrieve cart items' })
    };
  }
};
