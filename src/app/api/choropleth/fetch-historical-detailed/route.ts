import LambdaInvoker from "@utils/lambdaInvoker";
import { DEFAULT_RETRIEVAL_LAMBDA, HISTORY_CUTOFF_DAY } from "@src/constants";
import { addDays, formatDate } from "@src/utils/utils";

export async function POST(request: Request): Promise<Response> {
  const { body, condition } = await request.json();
  const lambdaInvoker = new LambdaInvoker();

  const res = await lambdaInvoker.invokeLambda(
    {
      httpMethod: "GET",
      path: `/${process.env.STAGING_ENV}/data-retrieval/retrieve-history`,
      queryStringParameters: {
        ...body,
        startDate: HISTORY_CUTOFF_DAY,
        endDate: formatDate(addDays(new Date(), -2)),
        attributes: condition,
      },
    },
    DEFAULT_RETRIEVAL_LAMBDA
  );

  const resBody = await res.json();

  if (res.status === 200) {
    return Response.json(resBody);
  } else {
    return Response.json({ error: resBody.message }, { status: res.status });
  }
}
