const INVOKE_URL = "https://visualisations.aemo.com.au/aemo/apps/api/report/5MIN";

export async function GET(): Promise<Response> {
  try {
    const lambdaResponse = await fetch(INVOKE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Referer": "https://visualisations.aemo.com.au/aemo/apps/visualisations/index.html",
        "DNT": "1",
        "Sec-GPC": "1",
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "Pragma": "no-cache",
        "Expires": "0",
        "Timestamp": new Date().getTime().toString(),
      },
      body: JSON.stringify({ timeScale: ["5MIN", "30MIN"] }),
    });

    // Returning response with data from lambda invocation and status code
    if (lambdaResponse.ok) {
      const resBody = await lambdaResponse.json();
      return new Response(JSON.stringify(resBody["5MIN"]), { status: 200 });
    } else {
      const resBody = await lambdaResponse.json();
      return new Response(JSON.stringify({ error: resBody.message }), {
        status: lambdaResponse.status,
      });
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to fetch data" }), {
      status: 500,
    });
  }
}
