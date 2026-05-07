import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Profile() {
  const [user, setUser] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/users/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to load profile");
        }

        setUser(data);
        setFirstName(data.firstName || "");
        setLastName(data.lastName || "");
      } catch (err) {
        console.error(err);
        setMessage("Unable to load profile");
      }
    };

    const fetchReviews = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/reviews", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to load reviews");
        }

        const myReviews = data.filter(
          (review) =>
            review.userId?._id?.toString() === userId ||
            review.userId?.toString() === userId
        );

        setReviews(myReviews);
      } catch (err) {
        console.error(err);
        setMessage("Unable to load reviews");
      }
    };

    fetchProfile();
    fetchReviews();
  }, [navigate, token, userId]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    navigate("/login");
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:3000/api/users/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ firstName, lastName }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Update failed");
      }

      setUser(data);
      setMessage("Profile updated successfully");
    } catch (err) {
      console.error(err);
      setMessage(err.message || "Unable to update profile");
    }
  };

  if (!user) {
    return <p>Loading profile...</p>;
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2>My Profile</h2>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <button onClick={() => navigate("/")}>Back to Listings</button>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </div>

      {message && <p>{message}</p>}

      <div>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>Name:</strong> {user.firstName} {user.lastName}
        </p>
      </div>

      <form onSubmit={handleUpdate} style={{ marginTop: "20px" }}>
        <h3>Update Name</h3>

        <input
          type="text"
          value={firstName}
          placeholder="First Name"
          onChange={(e) => setFirstName(e.target.value)}
        />

        <input
          type="text"
          value={lastName}
          placeholder="Last Name"
          onChange={(e) => setLastName(e.target.value)}
        />

        <button type="submit">Save</button>
      </form>

      <div style={{ marginTop: "30px" }}>
        <h3>My Reviews</h3>

        {reviews.length === 0 ? (
          <p>No reviews submitted yet.</p>
        ) : (
          reviews.map((review) => (
            <div
              key={review._id}
              style={{ border: "1px solid white", margin: "10px", padding: "10px" }}
            >
              <p>
                <strong>Listing:</strong>{" "}
                <Link to={`/listing/${review.listingId?._id || review.listingId}`}>
                  {review.listingId?.name || `View Listing`}
                </Link>
              </p>
              <p>⭐ {review.rating}</p>
              <p>{review.comment}</p>
              {review.photoPath && (
                <img
                  src={`http://localhost:3000/uploads/${review.photoPath}`}
                  width="200"
                  alt="Review"
                />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Profile;
