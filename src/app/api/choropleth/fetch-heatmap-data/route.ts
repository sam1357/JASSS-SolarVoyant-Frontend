import LambdaInvoker from "@utils/lambdaInvoker";
import { DEFAULT_ANALYTICS_LAMBDA } from "@src/constants";

export async function POST(request: Request): Promise<Response> {
  const body = await request.json();
  const { condition } = body;
  if (!condition) {
    return Response.json({ error: "Condition is required" }, { status: 400 });
  }

  const lambdaInvoker = new LambdaInvoker();

  const res = await lambdaInvoker.invokeLambda(
    {
      httpMethod: "GET",
      path: `/${process.env.STAGING_ENV}/data-analytics/analyse-heatmap`,
      queryStringParameters: { condition },
    },
    DEFAULT_ANALYTICS_LAMBDA
  );

  const resBody = await res.json();

  if (res.status === 200) {
    return Response.json(resBody);
  } else {
    return Response.json({ error: resBody.message }, { status: res.status });
  }
}
