import { DEFAULT_USER_DATA_LAMBDA } from "@src/constants";
import LambdaInvoker from "@src/utils/lambdaInvoker";

export async function POST(request: Request): Promise<Response> {
  const body = await request.json();
  const { userID, fields } = body;
  if (!userID) {
    return Response.json({ error: "userID is required" }, { status: 400 });
  }

  const lambdaInvoker = new LambdaInvoker();
  const lambdaResponse = await lambdaInvoker.invokeLambda(
    {
      httpMethod: "GET",
      path: `/${process.env.STAGING_ENV}/user-data/get`,
      body: JSON.stringify({ userID, fields }),
    },
    DEFAULT_USER_DATA_LAMBDA
  );

  if (lambdaResponse.ok) {
    const resBody = await lambdaResponse.json();
    return new Response(JSON.stringify({ user: resBody }), { status: 200 });
  } else {
    const resBody = await lambdaResponse.json();
    return new Response(JSON.stringify({ error: resBody.message }), {
      status: lambdaResponse.status,
    });
  }
}
