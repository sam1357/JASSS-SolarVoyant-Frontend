import { DEFAULT_USER_DATA_LAMBDA } from "@src/constants";
import LambdaInvoker from "@src/utils/lambdaInvoker";

// Handles POST request to register user on this route
export async function POST(request: Request): Promise<Response> {
  const body = await request.json();

  const lambdaInvoker = new LambdaInvoker();

  // Invoking lambda function for user registration
  const res = await lambdaInvoker.invokeLambda(
    {
      httpMethod: "POST",
      path: `/${process.env.STAGING_ENV}/user-data/register`,
      body: JSON.stringify({
        email: body.email,
        password: body.password,
        username: body.username,
      }),
    },
    DEFAULT_USER_DATA_LAMBDA
  );

  const resBody = await res.json();

  // Checking if registration was successful
  if (res.status === 200) {
    return Response.json({ user: resBody });
  } else {
    return Response.json({ error: resBody.message }, { status: res.status });
  }
}
