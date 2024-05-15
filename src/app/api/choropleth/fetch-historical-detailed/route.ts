import LambdaInvoker from "@utils/lambdaInvoker";
import { DEFAULT_RETRIEVAL_LAMBDA, HISTORY_CUTOFF_DAY_CHOROPLETH } from "@src/constants";
import { addDays, formatDate } from "@src/utils/utils";

// Handles POST request to fetch historical detailed data on this route
export async function POST(request: Request): Promise<Response> {
  const { body, condition } = await request.json();
  const lambdaInvoker = new LambdaInvoker();

  // Invoking lambda function for fetching historical detailed data
  const res = await lambdaInvoker.invokeLambda(
    {
      httpMethod: "GET",
      path: `/${process.env.STAGING_ENV}/data-retrieval/retrieve-history`,
      queryStringParameters: {
        ...body,
        startDate: HISTORY_CUTOFF_DAY_CHOROPLETH,
        endDate: formatDate(addDays(new Date(), -2)),
        attributes: condition,
      },
    },
    DEFAULT_RETRIEVAL_LAMBDA
  );

  // Returning response with data from lambda invocation and status code
  const resBody = await res.json();

  // Checking if data retrieval was successful
  if (res.status === 200) {
    return Response.json(resBody);
  } else {
    return Response.json({ error: resBody.message }, { status: res.status });
  }
}
