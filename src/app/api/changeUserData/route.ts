import { DEFAULT_USER_DATA_LAMBDA } from "@src/constants";
import LambdaInvoker from "@src/utils/lambdaInvoker";

// Handles PATCH request to change user data on this route
export async function PATCH(request: Request): Promise<Response> {
  const body = await request.json();

  // Invoking lambda function for changing user data
  const lambdaInvoker = new LambdaInvoker();
  const res = await lambdaInvoker.invokeLambda(
    {
      httpMethod: "PATCH",
      path: `/${process.env.STAGING_ENV}/user-data/set`,
      body: JSON.stringify({
        userID: body.userID,
        info: body.info,
      }),
    },
    DEFAULT_USER_DATA_LAMBDA
  );

  // Returning response with data from lambda invocation and status code
  const resBody = await res.json();

  // Checking if user data change was successful
  if (res.status === 200) {
    return Response.json({ user: resBody });
  } else {
    return Response.json({ error: resBody.message }, { status: res.status });
  }
}
