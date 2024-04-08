import {
  LambdaClient,
  InvokeCommand,
  InvocationType,
} from "@aws-sdk/client-lambda";
import { GROUP_NAME } from "@src/constants";
import { testJSON } from "@utils/utils";
import { NextResponse } from "next/server";

/**
 * Represents a class for invoking AWS Lambda functions with concurrency control.
 */
class LambdaInvoker {
  private lambda: LambdaClient;
  public static _DEFAULT_FUNCTION_PREFIX = `${GROUP_NAME}_${process.env.STAGING_ENV}_`;

  /**
   * Constructs a new LambdaInvoker instance.
   */
  constructor() {
    this.lambda = new LambdaClient({
      region: process.env.DEFAULT_REGION,
    });
  }

  /**
   * Invokes an AWS Lambda function with the provided payload.
   * @param payload The payload to send to the Lambda function.
   * @returns A Promise that resolves with the result of the Lambda invocation.
   */
  async invokeLambda(payload: any, functionName: string): Promise<Response> {
    try {
      const params = {
        FunctionName: `${LambdaInvoker._DEFAULT_FUNCTION_PREFIX}${functionName}`,
        InvocationType: InvocationType.RequestResponse,
        Payload: JSON.stringify(payload),
      };

      const lambdaRes = await this.lambda.send(new InvokeCommand(params));

      if (!lambdaRes || Object.keys(lambdaRes).length === 0) {
        return NextResponse.json(
          {
            error: "No return object received from lambda.",
          },
          {
            status: 500,
          }
        );
      }

      const summarisedRes = JSON.parse(
        lambdaRes?.Payload?.transformToString() as string
      );

      if (!summarisedRes || summarisedRes.statusCode === 500) {
        return NextResponse.json(
          {
            error: testJSON(summarisedRes.body)
              ? JSON.parse(summarisedRes.body).message
              : "An unknown error occurred",
          },
          {
            status: summarisedRes?.statusCode || 500,
          }
        );
      }

      return NextResponse.json(JSON.parse(summarisedRes.body), {
        status: summarisedRes?.statusCode,
      });
    } catch (err: any) {
      return NextResponse.json(
        {
          error: `An error occurred when invoking lambda ${functionName}. Error: ${err.message}`,
        },
        {
          status: err.statusCode || 500,
        }
      );
    }
  }
}

export default LambdaInvoker;
