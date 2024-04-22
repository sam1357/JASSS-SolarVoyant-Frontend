// fetch lat long for a given address
export async function POST(request: Request): Promise<Response> {
  {
    const body = await request.json();

    // Use Google Geocode API to get latlong for an address
    const address = body.address;
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string;
    const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&key=${apiKey}`;

    // Fetching latlong for the address
    const response = await fetch(geocodeUrl);
    const data = await response.json();

    // Returning response with latlong and status code
    if (data.status === "OK") {
      // Extracting latlong from the response
      const lat = data.results[0].geometry.location.lat;
      const lng = data.results[0].geometry.location.lng;

      return new Response(JSON.stringify({ lat, lng }), { status: 200 });
    } else {
      return new Response(JSON.stringify({ error: "Failed to fetch latlong for the address" }), {
        status: 400,
      });
    }
  }
}
