import { DEFAULT_USER_DATA_LAMBDA } from "@src/constants";
import LambdaInvoker from "@src/utils/lambdaInvoker";

export async function POST(request: Request): Promise<Response> {
  const body = await request.json();

  const lambdaInvoker = new LambdaInvoker();

  const res = await lambdaInvoker.invokeLambda(
    {
      httpMethod: "POST",
      path: `/${process.env.STAGING_ENV}/user-data/pw-reset-token`,
      body: JSON.stringify({ email: body.email }),
    },
    DEFAULT_USER_DATA_LAMBDA
  );

  const resBody = await res.json();

  return Response.json({ message: resBody.message }, { status: res.status });
}

export async function PATCH(request: Request): Promise<Response> {
  const body = await request.json();

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

  return Response.json({ message: resBody.message }, { status: res.status });
}
