const fetchSongs = async (search) => {
  // 1. Fix: Return an empty array or null instead of undefined when search is empty
  if (!search || search.trim().length === 0) return [];

  try {
    // 2. Fix: 'content-type' belongs inside a 'headers' object, not the root
    const res = await fetch(`http://localhost:3000/api/search?q=${encodeURIComponent(search)}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    // console.log("Data fetched successfully:", data);
    return data;

  } catch (error) {
    console.error("Error fetching songs:", error);
    return []; // Return empty array on failure so your UI doesn't crash
  }
};

export { fetchSongs };



//   const fetchSongs = async (search) => {

//     // if(search?.length <= 0 && search.trim() === "") return;

//    try {
//      const res = await fetch(
//       `http://localhost:3000/api/search?q=${search}`,
//       {
//         method: "GET",
//         headers: {
//         "content-type": "application/json",
//         } 
//       },
//     )
    
//     const data = await res.json()

//     console.log(data)

//     return data
//    } catch (error) {
//     console.error("Error fetching songs:", error);
//     return [];
//    }
    
//   }

// export {fetchSongs}