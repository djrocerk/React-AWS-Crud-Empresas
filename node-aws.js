//Estas son las funciones desplegadas en AWS-LAMBDA FUNCTIONS

const AWS = require("aws-sdk");

const dynamo = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event, context) => {
  let body;
  let statusCode = 200;
  const headers = {
    "Content-Type": "application/json",
  };

  try {
    switch (event.routeKey) {
      case "DELETE /empresas/{id}":
        await dynamo
          .delete({
            TableName: "empresa",
            Key: {
              id: event.pathParameters.id,
            },
          })
          .promise();
        body = `Deleted item ${event.pathParameters.id}`;
        break;
      case "GET /empresas/{id}":
        body = await dynamo
          .get({
            TableName: "empresa",
            Key: {
              id: event.pathParameters.id,
            },
          })
          .promise();
        break;
      case "GET /empresas":
        body = await dynamo
          .scan({ TableName: "empresa" })
          .promise();
        break;
      case "PUT /empresas":
        let requestJSON = JSON.parse(event.body);
        await dynamo
          .put({
            TableName: "empresa",
            Item: {
              id: requestJSON.id,
              nombre: requestJSON.nombre,
              direccion: requestJSON.direccion,
              nit: requestJSON.nit,
              telefono: requestJSON.telefono
            },
          })
          .promise();
        body = `Put item ${requestJSON.id}`;
        break;
      default:
        throw new Error(`Unsupported route: "${event.routeKey}"`);
    }
  } catch (err) {
    statusCode = 400;
    body = err.message;
  } finally {
    body = JSON.stringify(body);
  }

  return {
    statusCode,
    body,
    headers,
  };
};
