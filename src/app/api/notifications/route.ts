import { DEFAULT_USER_DATA_LAMBDA } from "@src/constants";
import LambdaInvoker from "@src/utils/lambdaInvoker";

export async function GET(request: Request): Promise<Response> {
  const userID = request.url.split("?userID=")[1];

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

  const resBody = await res.json();

  if (res.status === 200) {
    return Response.json({ user: resBody });
  } else {
    return Response.json({ error: resBody.message }, { status: res.status });
  }
}

export async function DELETE(request: Request): Promise<Response> {
  const userID = request.url.split("?userID=")[1];

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

  const resBody = await res.json();

  if (res.status === 200) {
    return Response.json({ user: resBody });
  } else {
    return Response.json({ error: resBody.message }, { status: res.status });
  }
}
