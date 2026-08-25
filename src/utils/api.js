const fetchSongs = async (search) => {

  // 1. Fix: Return an empty array or null instead of undefined when search is empty
  if (!search || search.trim().length === 0) return [];

  try {
    // 2. Fix: 'content-type' belongs inside a 'headers' object, not the root
    const res = await fetch(`/api/search?q=${encodeURIComponent(search)}`, {
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

const fetchArtist = async (artistId) => {

  // 1. Fix: Return an empty array or null instead of undefined when search is empty
  if (!artistId || artistId?.trim().length === 0) return [];

  try {
    // 2. Fix: 'content-type' belongs inside a 'headers' object, not the root
    const res = await fetch(`/api/artist?q=${encodeURIComponent(artistId)}`, {
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
    console.error("Error fetching artist:", error);
    return []; // Return empty array on failure so your UI doesn't crash
  }
};

const fetchAlbumData = async (albumId) => {

  if (!albumId || albumId?.trim().length === "") return [];
try {
  
    const res = await fetch(`/api/album?q=${encodeURIComponent(albumId)}`, {
      method: "GET",
      headers : {
        "Content-Type": "application/json",
      },
    })
  
    if (!res.ok){
      throw new Error(`HTTP errro album: ${res.status}`)
    }
    
    const data = await res.json()
  
    return data
} catch (error) {
  console.log("Error while fetching album:", error)
}

}

const fetchLyricsData = async (videoId) => {

  if (videoId?.trim === "") return [];

  try {

    const res = await fetch(`/api/lyric?q=${videoId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      }
    )

    if (!res.ok) {
      throw new Error(`HTTP error status: ${res.status}`)
    };

    const data = await res.json();

    return data

  } catch (error) {
    console.log("Error while fetching lyrics:", error)
  }
}

const fetchSongsData = async (songName) => {

  if (songName?.trim() === "") return;

  try {
    
    const res = await fetch(`/api/songs?q=${songName}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    });

    if (!res.ok) {
      throw new Error("Error while fetching songs")
    };

    const data = await res.json();

    return data;

  } catch (error) {
    console.log(error)
  }
};

export { fetchSongs, fetchArtist, fetchAlbumData, fetchLyricsData, fetchSongsData};

// https://radio-tune-two.vercel.app/

