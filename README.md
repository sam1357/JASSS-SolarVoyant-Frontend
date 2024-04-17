<div align="center">
  <img src="logo.png" alt="Solarvoyant Logo" width="100" height="100">
</div>

![CI](https://github.com/cseteaching-unsw-edu-au/JASSS-SolarVoyant-Frontend/actions/workflows/ci.yml/badge.svg)

# JASSS SolarVoyant Frontend

![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Next JS](https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Chakra](https://img.shields.io/badge/chakra-%234ED1C5.svg?style=for-the-badge&logo=chakraui&logoColor=white)
![PNPM](https://img.shields.io/badge/pnpm-%234a4a4a.svg?style=for-the-badge&logo=pnpm&logoColor=f69220)
![cypress](https://img.shields.io/badge/-cypress-%23E5E5E5?style=for-the-badge&logo=cypress&logoColor=058a5e)
![AWS](https://img.shields.io/badge/AWS-%23FF9900.svg?style=for-the-badge&logo=amazon-aws&logoColor=white)

## Getting Started

### Installing pnpm and packages

`pnpm` can be installed by simply running:

`npm install -g pnpm`

Then, install all packages using `pnpm i`.

### Setting up env variables

Copy the `.env.template` into a `.env` file and fill out the values.

| **Key**                                                            | **Description**                                                                                                                                                  |
| ------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `GOOGLE_CLIENT_ID`<br>`GOOGLE_CLIENT_SECRET`                       | Google OAuth Client ID and Secret. Learn more at: https://developers.google.com/identity/protocols/oauth2                                                        |
| `NEXTAUTH_URL`                                                     | Base URL of website. If developing locally, this would be http://localhost:3000                                                                                  |
| `NEXTAUTH_SECRET`                                                  | A random string of letters and numbers for Next Auth to process with. Can generate one by running the following in terminal:<br>`$ openssl rand -base64 32`      |
| `DEFAULT_REGION`<br>`AWS_ACCESS_KEY_ID`<br>`AWS_SECRET_ACCESS_KEY` | AWS environment variables.                                                                                                                                       |
| `STAGING_ENV`                                                      | The staging environment that the website is currently running in. Used for calling the correct AWS Lambda functions. In development, this would simply be 'dev'. |

### Starting the server

You can start the development server using:

```bash
pnpm dev
```

The development server will compile in realtime, so any changes you make will be reflected live.

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Testing

Testing is handled by the Cypress library. To run the tests, simply run `pnpm cypress:run`.
Alternatively, if you would like to spin up a browser instance and have a GUI for running cypress like
the one below, run `pnpm cypress:open`.

![alt text](component-under-test.png)

> [!IMPORTANT]
> If you are using WSL, the GUI requires WSL to be setup to handle GUI applications. Follow [this guide](https://gist.github.com/pjobson/6b9fb926c59f58aa73d4efa10fe13654) to set this up.
>
> If you are using a native Linux, Windows or macOS machine, then there is no need to perform this step.

### Deployment

Deployment is automatically handled by **AWS Amplify**. You can access the deployment [here.](https://main.d36mkbqarhvx1i.amplifyapp.com/)
