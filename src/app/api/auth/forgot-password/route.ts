import { DEFAULT_USER_DATA_LAMBDA } from "@src/constants";
import LambdaInvoker from "@src/utils/lambdaInvoker";

// Handles POST request to generate password reset token on this route
export async function POST(request: Request): Promise<Response> {
  const body = await request.json();

  const lambdaInvoker = new LambdaInvoker();

  // Invoking lambda function for password reset token generation
  const res = await lambdaInvoker.invokeLambda(
    {
      httpMethod: "POST",
      path: `/${process.env.STAGING_ENV}/user-data/pw-reset-token`,
      body: JSON.stringify({ email: body.email }),
    },
    DEFAULT_USER_DATA_LAMBDA
  );

  const resBody = await res.json();
  // Returning response with message from lambda invocation and status code
  return Response.json({ message: resBody.message }, { status: res.status });
}

// Handles PATCH request to reset password on this route
export async function PATCH(request: Request): Promise<Response> {
  const body = await request.json();

  // Invoking lambda function for password reset
  const lambdaInvoker = new LambdaInvoker();

  const res = await lambdaInvoker.invokeLambda(
    {
      httpMethod: "PATCH",
      path: `/${process.env.STAGING_ENV}/user-data/pw-reset`,
      body: JSON.stringify({ email: body.email, token: body.token, newPassword: body.newPassword }),
    },
    DEFAULT_USER_DATA_LAMBDA
  );

  const resBody = await res.json();

  // Returning response with message from lambda invocation and status code
  return Response.json({ message: resBody.message }, { status: res.status });
}
