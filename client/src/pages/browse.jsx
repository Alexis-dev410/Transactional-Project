import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Browse() {
  const [listings, setListings] = useState([]);
  const [filters, setFilters] = useState({
    city: "",
    minPrice: "",
    maxPrice: "",
  });

  const navigate = useNavigate();

  // 🔹 Protect route
  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
    }
  }, [navigate]);

  // 🔹 Fetch listings
  const fetchListings = (query = "") => {
    fetch(`http://localhost:3000/api/listings${query}`)
      .then(res => res.json())
      .then(data => setListings(data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchListings();
  }, []);

  // 🔹 Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // 🔹 Handle filter submit
  const handleSearch = (e) => {
    e.preventDefault();
    const query = new URLSearchParams(filters).toString();
    fetchListings(`?${query}`);
  };

  return (
    <div>
      {/* 🔹 Header */}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h2>Listings</h2>
        <button onClick={handleLogout}>Logout</button>
      </div>

      {/* 🔹 Filters */}
      <form onSubmit={handleSearch}>
        <input
          placeholder="City"
          onChange={(e) =>
            setFilters({ ...filters, city: e.target.value })
          }
        />

        <input
          placeholder="Min Price"
          onChange={(e) =>
            setFilters({ ...filters, minPrice: e.target.value })
          }
        />

        <input
          placeholder="Max Price"
          onChange={(e) =>
            setFilters({ ...filters, maxPrice: e.target.value })
          }
        />

        <button type="submit">Search</button>
      </form>

      {/* 🔹 Listings */}
      {listings.length === 0 ? (
        <p>Loading listings...</p>
      ) : (
        listings.map((listing) => (
          <div
            key={listing._id}
            style={{ border: "1px solid white", margin: "10px" }}
          >
            {/* ✅ IMAGE */}
            {listing.images?.picture_url && (
              <img
                src={listing.images.picture_url}
                alt=""
                width="200"
              />
            )}

            <h3>{listing.name}</h3>
            <p>{listing.address?.market}</p>
            <p>${listing.price}</p>

            <Link to={`/listing/${listing._id}`}>
              View Details
            </Link>
          </div>
        ))
      )}
    </div>
  );
}

export default Browse;