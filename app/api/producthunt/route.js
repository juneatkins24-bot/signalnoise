async function getPHToken() {
  const res = await fetch("https://api.producthunt.com/v2/oauth/token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: process.env.PH_CLIENT_ID,
      client_secret: process.env.PH_CLIENT_SECRET,
      grant_type: "client_credentials",
    }),
  });
  const data = await res.json();
  return data.access_token;
}

export async function GET() {
  try {
    if (!process.env.PH_CLIENT_ID || !process.env.PH_CLIENT_SECRET) {
      return Response.json({ brands: [], source: "no_ph_key" });
    }
    const token = await getPHToken();
    const query = `
      query {
        posts(first: 15, order: VOTES) {
          edges {
            node {
              name
              tagline
              website
              votesCount
              thumbnail { url }
            }
          }
        }
      }
    `;
    const res = await fetch("https://api.producthunt.com/v2/api/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
      body: JSON.stringify({ query }),
    });
    const data = await res.json();
    const posts = data?.data?.posts?.edges || [];
    const brands = posts.map(({ node }) => ({
      name: node.name,
      tagline: node.tagline,
      image: node.thumbnail?.url || null,
      votes: node.votesCount || 0,
      source: "producthunt",
      wiki: null,
      fallbackColor: "#1A1A2E",
    }));
    return Response.json({ brands, source: "producthunt" });
  } catch (e) {
    console.error("PH error:", e);
    return Response.json({ brands: [], source: "error" });
  }
}
