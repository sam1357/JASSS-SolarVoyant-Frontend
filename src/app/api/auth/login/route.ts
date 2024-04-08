import LambdaInvoker from "@utils/lambdaInvoker";
import { DEFAULT_USER_DATA_LAMBDA } from "@src/constants";

export async function POST(request: Request): Promise<Response> {
  const body = await request.json();

  const lambdaInvoker = new LambdaInvoker();

  const res = await lambdaInvoker.invokeLambda(
    {
      httpMethod: "POST",
      path: `/${process.env.STAGING_ENV}/user-data/authenticate`,
      body: JSON.stringify({ email: body.email, password: body.password }),
    },
    DEFAULT_USER_DATA_LAMBDA
  );

  const resBody = await res.json();

  if (res.status === 200) {
    return Response.json({ user: resBody });
  } else {
    return Response.json({ error: resBody.message }, { status: res.status });
  }
}
