import { capitalizeFirstLetter } from "./utils";
import LambdaInvoker from "./lambdaInvoker";
import { DEFAULT_USER_DATA_LAMBDA } from "@src/constants";

export class Api {
  /**
   * Handles an OAuth operation for a user
   * @returns {Promise<Response>} - The status and JSON of the return
   */
  static async handleOauth(
    email: string,
    provider: string,
    username: string
  ): Promise<Response> {
    const lambdaInvoker = new LambdaInvoker();
    const res = await lambdaInvoker.invokeLambda(
      {
        httpMethod: "POST",
        path: `/${process.env.STAGING_ENV}/user-data/handle-oauth`,
        body: JSON.stringify({
          email: email,
          provider: capitalizeFirstLetter(provider),
          username: username,
        }),
      },
      DEFAULT_USER_DATA_LAMBDA
    );
    return res;
  }

  /**
   * Gets the ID of a user
   * @returns {Promise<Response>} - The status and JSON of the return
   */
  static async getId(
    email: string,
    provider: string,
    username: string
  ): Promise<Response> {
    const res = await Api.handleOauth(email, provider, username);
    return (await res.json()).id;
  }

  /**
   * Registers a user
   * @returns {Promise<Response>} - The status and JSON of the return
   */
  static async register(
    username: string,
    email: string,
    password: string
  ): Promise<Response> {
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });

    return res;
  }

  // static async setUserData(
  //   userID: string,
  //   info: { [field: string]: string },
  // ): Promise<Response> {
  //   console.log('OHOHIHO')
  //   const lambdaInvoker = new LambdaInvoker();
  //   const res = await lambdaInvoker.invokeLambda(
  //     {
  //       httpMethod: "PATCH",
  //       path: `/${process.env.STAGING_ENV}/user-data/set`,
  //       body: JSON.stringify({
  //         userID: userID,
  //         info: info,
  //       }),
  //     },
  //     DEFAULT_USER_DATA_LAMBDA
  //   );
  //   return res;
  // }
}

//handleGetInfo