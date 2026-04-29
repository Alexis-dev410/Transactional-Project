import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function ListingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [listing, setListing] = useState(null);
  const [reviews, setReviews] = useState([]);

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  // 🔹 Protect route
  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
    }
  }, [navigate]);

  // 🔹 Fetch listing
  useEffect(() => {
    fetch(`http://localhost:3000/api/listings/${id}`)
      .then(res => res.json())
      .then(data => setListing(data));
  }, [id]);

  // 🔹 Fetch reviews
  useEffect(() => {
    fetch("http://localhost:3000/api/reviews")
      .then(res => res.json())
      .then(data => {
        const filtered = data.filter(
          (r) => r.listingId?.toString() === id
        );
        setReviews(filtered);
      });
  }, [id]);

  // 🔹 Submit review
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:3000/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          listingId: id,
          rating,
          comment,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Review submitted");
        setReviews([...reviews, data]);
        setComment("");
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Error submitting review");
    }
  };

  // 🔹 Delete review
  const handleDelete = async (reviewId) => {
  try {
    const res = await fetch(`http://localhost:3000/api/reviews/${reviewId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    const data = await res.json();
    console.log("DELETE response:", data);

    if (res.ok) {
      // ✅ Only update UI if backend succeeded
      setReviews(reviews.filter((r) => r._id !== reviewId));
    } else {
      alert(data.message || "Delete failed");
    }

  } catch (err) {
    console.error("Delete error:", err);
  }
};

  if (!listing) return <p>Loading...</p>;

  return (
    <div>
      {/* 🔹 Back */}
      <button onClick={() => navigate("/")}>
        ← Back to Listings
      </button>

      {/* 🔹 Listing info */}
      <h2>{listing.name}</h2>

      {listing.images?.picture_url && (
        <img src={listing.images.picture_url} width="300" />
      )}

      <p>{listing.summary}</p>
      <p>${listing.price}</p>
      <p>{listing.address?.street}</p>
      <p>{listing.address?.market}</p>
      <p>Type: {listing.property_type}</p>
      <p>Host: {listing.host?.host_name}</p>

      {/* 🔹 Reviews */}
      <h3>Reviews</h3>

      {reviews.length === 0 && <p>No reviews yet</p>}

      {reviews.map((r) => (
        <div key={r._id} style={{ border: "1px solid white", margin: "10px" }}>
          <p>
            {r.userId?.firstName} {r.userId?.lastName}
          </p>
          <p>⭐ {r.rating}</p>
          <p>{r.comment}</p>

          {/* ✅ DELETE BUTTON */}
          <button onClick={() => handleDelete(r._id)}>
            Delete
          </button>
        </div>
      ))}

      {/* 🔹 Add review */}
      {localStorage.getItem("token") && (
        <div>
          <h3>Add Review</h3>

          <form onSubmit={handleSubmit}>
            <input
              type="number"
              min="1"
              max="5"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
            />

            <input
              type="text"
              placeholder="Comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />

            <button type="submit">Submit Review</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default ListingDetail;