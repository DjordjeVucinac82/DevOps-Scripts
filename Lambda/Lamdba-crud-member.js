const AWS = require('aws-sdk');
AWS.config.update( {
  region: 'ap-south-1'
});
const dynamodb = new AWS.DynamoDB.DocumentClient();
const dynamodbTableName = 'member_table';

const userPath = '/user';
const usersPath = '/users';

exports.handler = async function(event) {
  console.log('Request event: ', event);
  let response;
  switch(true) {
    
    case event.httpMethod === 'GET' && event.path === userPath:
      response = await getUser(event.queryStringParameters.MemberId);
      break;
    case event.httpMethod === 'GET' && event.path === usersPath:
      response = await getUsers();
      break;
    case event.httpMethod === 'POST' && event.path === userPath:
      response = await saveUser(JSON.parse(event.body));
      break;
    case event.httpMethod === 'PATCH' && event.path === userPath:
      const requestBody = JSON.parse(event.body);
      response = await modifyUser(requestBody.MemberId, requestBody.updateKey, requestBody.updateValue);
      break;
    case event.httpMethod === 'DELETE' && event.path === userPath:
      response = await deleteUser(JSON.parse(event.body).MemberId);
      break;
    default:
      response = buildResponse(404, '404 Not Found');
  }
  return response;
}

async function getUser(MemberId) {
  const params = {
    TableName: dynamodbTableName,
    Key: {
      'MemberId': MemberId
    }
  }
  return await dynamodb.get(params).promise().then((response) => {
    return buildResponse(200, response.Item);
  }, (error) => {
    console.error('Do your custom error handling here. I am just gonna log it: ', error);
  });
}

async function getUsers() {
  const params = {
    TableName: dynamodbTableName
  }
  const allUsers = await scanDynamoRecords(params, []);
  const body = {
    users: allUsers
  }
  return buildResponse(200, body);
}

async function scanDynamoRecords(scanParams, itemArray) {
  try {
    const dynamoData = await dynamodb.scan(scanParams).promise();
    itemArray = itemArray.concat(dynamoData.Items);
    if (dynamoData.LastEvaluatedKey) {
      scanParams.ExclusiveStartkey = dynamoData.LastEvaluatedKey;
      return await scanDynamoRecords(scanParams, itemArray);
    }
    return itemArray;
  } catch(error) {
    console.error('Do your custom error handling here. I am just gonna log it: ', error);
  }
}

async function saveUser(requestBody) {
  const params = {
    TableName: dynamodbTableName,
    Item: requestBody
  }
  return await dynamodb.put(params).promise().then(() => {
    const body = {
      Operation: 'SAVE',
      Message: 'SUCCESS',
      Item: requestBody
    }
    return buildResponse(200, body);
  }, (error) => {
    console.error('Do your custom error handling here. I am just gonna log it: ', error);
  })
}

async function modifyUser(MemberId, updateKey, updateValue) {
  const params = {
    TableName: dynamodbTableName,
    Key: {
      'MemberId': MemberId
    },
    UpdateExpression: `set ${updateKey} = :value`,
    ExpressionAttributeValues: {
      ':value': updateValue
    },
    ReturnValues: 'UPDATED_NEW'
  }
  return await dynamodb.update(params).promise().then((response) => {
    const body = {
      Operation: 'UPDATE',
      Message: 'SUCCESS',
      UpdatedAttributes: response
    }
    return buildResponse(200, body);
  }, (error) => {
    console.error('Do your custom error handling here. I am just gonna log it: ', error);
  })
}

async function deleteUser(MemberId) {
  const params = {
    TableName: dynamodbTableName,
    Key: {
      'MemberId': MemberId
    },
    ReturnValues: 'ALL_OLD'
  }
  return await dynamodb.delete(params).promise().then((response) => {
    const body = {
      Operation: 'DELETE',
      Message: 'SUCCESS',
      Item: response
    }
    return buildResponse(200, body);
  }, (error) => {
    console.error('Do your custom error handling here. I am just gonna log it: ', error);
  })
}

function buildResponse(statusCode, body) {
  return {
    statusCode: statusCode,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  }
}