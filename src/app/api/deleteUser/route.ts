import { DEFAULT_USER_DATA_LAMBDA } from "@src/constants";
import LambdaInvoker from "@src/utils/lambdaInvoker";

// Handles DELETE request to delete user data on this route
export async function DELETE(request: Request): Promise<Response> {
  const body = await request.json();

  // Invoking lambda function for deleting user data
  const lambdaInvoker = new LambdaInvoker();
  const res = await lambdaInvoker.invokeLambda(
    {
      httpMethod: "DELETE",
      path: `/${process.env.STAGING_ENV}/user-data/delete`,
      body: JSON.stringify({
        userID: body.userID,
      }),
    },
    DEFAULT_USER_DATA_LAMBDA
  );

  // Returning response with data from lambda invocation and status code
  const resBody = await res.json();

  // Checking if user data deletion was successful
  if (res.status === 200) {
    return Response.json({ user: resBody });
  } else {
    return Response.json({ error: resBody.message }, { status: res.status });
  }
}
