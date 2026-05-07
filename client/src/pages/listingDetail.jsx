import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function ListingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [listing, setListing] = useState(null);
  const [reviews, setReviews] = useState([]);

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [photo, setPhoto] = useState(null);

  // 🔹 Fetch listing
  useEffect(() => {
    fetch(`http://localhost:3000/api/listings/${id}`)
      .then((res) => res.json())
      .then((data) => setListing(data));
  }, [id]);

  // 🔹 Fetch reviews
  useEffect(() => {
    fetch("http://localhost:3000/api/reviews")
      .then((res) => res.json())
      .then((data) => {
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
      const formData = new FormData();

      formData.append("listingId", id);
      formData.append("rating", rating);
      formData.append("comment", comment);

      if (photo) {
        formData.append("photo", photo);
      }

      const res = await fetch("http://localhost:3000/api/reviews", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        alert("Review submitted");

        setReviews([...reviews, data]);

        setComment("");
        setPhoto(null);
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
      const res = await fetch(
        `http://localhost:3000/api/reviews/${reviewId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = await res.json();

      if (res.ok) {
        setReviews(reviews.filter((r) => r._id !== reviewId));
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  const currentUserId = localStorage.getItem("userId");

  const isOwnReview = (review) => {
    if (!currentUserId || !review?.userId) return false;

    return (
      review.userId._id?.toString() === currentUserId ||
      review.userId.toString() === currentUserId
    );
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
        <img
          src={listing.images.picture_url}
          width="300"
        />
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
        <div
          key={r._id}
          style={{
            border: "1px solid white",
            margin: "10px",
            padding: "10px",
          }}
        >
          <p>
            {r.userId?.firstName} {r.userId?.lastName}
          </p>

          <p>⭐ {r.rating}</p>

          <p>{r.comment}</p>

          {isOwnReview(r) && (
            <button onClick={() => handleDelete(r._id)}>
              Delete
            </button>
          )}

          {/* 🔹 Uploaded photo */}
          {r.photoPath && (
            <img
              src={`http://localhost:3000/uploads/${r.photoPath}`}
              width="200"
            />
          )}
        </div>
      ))}

      {/* 🔹 Review form */}
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

            <input
              type="file"
              accept="image/*"
              onChange={(e) => setPhoto(e.target.files[0])}
            />

            <button type="submit">
              Submit Review
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default ListingDetail;