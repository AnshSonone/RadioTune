const fetchSongs = async (search) => {

  const apiKey = process.env.NEXT_BACKEND_API;

  // 1. Fix: Return an empty array or null instead of undefined when search is empty
  if (!search || search.trim().length === 0) return [];

  try {
    // 2. Fix: 'content-type' belongs inside a 'headers' object, not the root
    const res = await fetch(`${process.env.NEXT_ENV === "production" ? apiKey : "http://localhost:3000"}/api/search?q=${encodeURIComponent(search)}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
  
    return data;

  } catch (error) {
    console.error("Error fetching songs:", error);
    return []; // Return empty array on failure so your UI doesn't crash
  }
};

export { fetchSongs };

