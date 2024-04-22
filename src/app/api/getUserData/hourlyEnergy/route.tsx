import { DEFAULT_RETRIEVAL_LAMBDA } from "@src/constants";
import LambdaInvoker from "@src/utils/lambdaInvoker";

// Handles POST request to retrieve energy data on this route
export async function POST(request: Request): Promise<Response> {
  const body = await request.json();
  const { userID } = body;

  // Invoking lambda function for retrieving energy data
  if (!userID) {
    return Response.json({ error: "userID is required" }, { status: 400 });
  }

  // Invoking lambda function for retrieving energy data
  const lambdaInvoker = new LambdaInvoker();
  const lambdaResponse = await lambdaInvoker.invokeLambda(
    {
      httpMethod: "GET",
      path: `/${process.env.STAGING_ENV}/data-retrieval/retrieve-energy-data`,
      queryStringParameters: {
        userID,
      },
    },
    DEFAULT_RETRIEVAL_LAMBDA
  );

  // Returning response with data from lambda invocation and status code
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
