import { DEFAULT_USER_DATA_LAMBDA } from "@src/constants";
import LambdaInvoker from "@src/utils/lambdaInvoker";

// Handles PATCH request to change password on this route
export async function PATCH(request: Request): Promise<Response> {
  const body = await request.json();

  // Invoking lambda function for changing password
  const lambdaInvoker = new LambdaInvoker();
  const res = await lambdaInvoker.invokeLambda(
    {
      httpMethod: "PATCH",
      path: `/${process.env.STAGING_ENV}/user-data/change-pw`,
      body: JSON.stringify({
        email: body.email,
        oldPassword: body.oldPassword,
        newPassword: body.newPassword,
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
