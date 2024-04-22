import { DEFAULT_USER_DATA_LAMBDA } from "@src/constants";
import LambdaInvoker from "@src/utils/lambdaInvoker";

// Handles GET request to get user notifications on this route
export async function GET(request: Request): Promise<Response> {
  const userID = request.url.split("?userID=")[1];

  // Invoking lambda function for getting user data
  const lambdaInvoker = new LambdaInvoker();
  const res = await lambdaInvoker.invokeLambda(
    {
      httpMethod: "GET",
      path: `/${process.env.STAGING_ENV}/user-data/get`,
      body: JSON.stringify({
        userID,
        fields: "notifications",
      }),
    },
    DEFAULT_USER_DATA_LAMBDA
  );

  // Returning response with data from lambda invocation and status code
  const resBody = await res.json();

  if (res.status === 200) {
    return Response.json({ user: resBody });
  } else {
    return Response.json({ error: resBody.message }, { status: res.status });
  }
}

// Handles DELETE request to clear user notifications on this route
export async function DELETE(request: Request): Promise<Response> {
  const userID = request.url.split("?userID=")[1];

  // Invoking lambda function for clearing user notifications
  const lambdaInvoker = new LambdaInvoker();
  const res = await lambdaInvoker.invokeLambda(
    {
      httpMethod: "POST",
      path: `/${process.env.STAGING_ENV}/user-data/clear-notifications`,
      body: JSON.stringify({
        userID,
      }),
    },
    DEFAULT_USER_DATA_LAMBDA
  );

  // Returning response with data from lambda invocation and status code
  const resBody = await res.json();

  // Checking if user notifications were cleared successfully
  if (res.status === 200) {
    return Response.json({ user: resBody });
  } else {
    return Response.json({ error: resBody.message }, { status: res.status });
  }
}
