import { DEFAULT_USER_DATA_LAMBDA } from "@src/constants";
import LambdaInvoker from "@src/utils/lambdaInvoker";

export async function PATCH(request: Request): Promise<Response> {
  const body = await request.json();

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

  const resBody = await res.json();

  if (res.status === 200) {
    return Response.json({ user: resBody });
  } else {
    return Response.json({ error: resBody.message }, { status: res.status });
  }
}
