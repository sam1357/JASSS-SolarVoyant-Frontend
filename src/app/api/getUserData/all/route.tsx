import { DEFAULT_USER_DATA_LAMBDA } from "@src/constants";
import LambdaInvoker from "@src/utils/lambdaInvoker";

// Handles POST request to get all user data on this route
export async function POST(request: Request): Promise<Response> {
  const body = await request.json();
  const { userID } = body;

  // Invoking lambda function for getting all user data
  if (!userID) {
    return Response.json({ error: "userID is required" }, { status: 400 });
  }

  // Invoking lambda function for getting all user data
  const lambdaInvoker = new LambdaInvoker();
  const lambdaResponse = await lambdaInvoker.invokeLambda(
    {
      httpMethod: "GET",
      path: `/${process.env.STAGING_ENV}/user-data/get-all`,
      body: JSON.stringify({ userID }),
    },
    DEFAULT_USER_DATA_LAMBDA
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
