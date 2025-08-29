function getApiBase() {
    var base =
      (typeof process !== "undefined" &&
        process.env &&
        process.env.REACT_APP_API_BASE_URL) ||
      "http://127.0.0.1:8000";
    return String(base).replace(/\/+$/, "");
  }
  
  export async function fetchPartners() {
    const url = getApiBase() + "/api/partners/";
    const res = await fetch(url, { headers: { Accept: "application/json" } });
    if (!res.ok) throw new Error("Partners API failed: " + res.status);
    const json = await res.json();
    // eslint-disable-next-line no-console
    console.log("Partners API raw:", json);
    return json;
  }
  