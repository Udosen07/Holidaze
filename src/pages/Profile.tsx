import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import {
  getProfile,
  updateProfile,
  deleteBooking,
  updateBooking,
  deleteVenue,
  updateVenue,
} from "../services/api";
import { format } from "date-fns";
import { BackButton } from "../components/BackButton";
import { useNavigate } from "react-router-dom";

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal states
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showVenueModal, setShowVenueModal] = useState(false);
  const [currentEditItem, setCurrentEditItem] = useState<any>(null);

  // Form states
  const [profileForm, setProfileForm] = useState({
    bio: "",
    avatar: { url: "" },
    banner: { url: "" },
    venueManager: false,
  });

  const [bookingForm, setBookingForm] = useState({
    dateFrom: "",
    dateTo: "",
    guests: 0,
  });

  const [venueForm, setVenueForm] = useState({
    name: "",
    description: "",
    price: 0,
    maxGuests: 0,
    meta: {
      wifi: false,
      parking: false,
      breakfast: false,
      pets: false,
    },
    location: {
      address: "",
      city: "",
      zip: "",
      country: "",
      continent: "",
      lat: 0,
      lng: 0,
    },
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (!user?.name) return;

        setLoading(true);
        const data = await getProfile(user.name);
        console.log(data);
        setProfile(data.data);
        setProfileForm({
          bio: data.data.bio ?? "",
          avatar: data.data.avatar ?? { url: "" },
          banner: data.data.banner ?? { url: "" },
          venueManager: data.data.venueManager ?? false,
        });
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch profile"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user?.name]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!user?.name) return;

      const updatedProfile = await updateProfile(user.name, profileForm);
      setProfile(updatedProfile.data);

      // Update the AuthContext if any profile data changed
      setUser((prevUser) => {
        if (!prevUser) return null;

        const updatedUser = {
          ...prevUser,
          bio: profileForm.bio,
          avatar: profileForm.avatar,
          banner: profileForm.banner,
          venueManager: profileForm.venueManager,
        };

        // Update stored user data
        const storage = localStorage.getItem("userData")
          ? localStorage
          : sessionStorage;
        const storedUserData = storage.getItem("userData");

        if (storedUserData) {
          storage.setItem("userData", JSON.stringify(updatedUser));
        }

        return updatedUser;
      });

      setShowProfileModal(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update profile");
    }
  };

  const handleBookingUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!currentEditItem?.id) return;

      const updatedBooking = await updateBooking(
        currentEditItem.id,
        bookingForm
      );

      // Update the bookings list
      setProfile((prev: any) => ({
        ...prev,
        bookings: prev.bookings.map((booking: any) =>
          booking.id === currentEditItem.id ? updatedBooking.data : booking
        ),
      }));

      setShowBookingModal(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update booking");
    }
  };

  const handleBookingDelete = async (id: string) => {
    try {
      await deleteBooking(id);

      // Update the bookings list
      setProfile((prev: any) => ({
        ...prev,
        bookings: prev.bookings.filter((booking: any) => booking.id !== id),
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete booking");
    }
  };

  const handleVenueUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!currentEditItem?.id) return;

      const updatedVenue = await updateVenue(currentEditItem.id, venueForm);

      // Update the venues list
      setProfile((prev: any) => ({
        ...prev,
        venues: prev.venues.map((venue: any) =>
          venue.id === currentEditItem.id ? updatedVenue.data : venue
        ),
      }));

      setShowVenueModal(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update venue");
    }
  };

  const handleVenueDelete = async (id: string) => {
    try {
      await deleteVenue(id);

      // Update the venues list
      setProfile((prev: any) => ({
        ...prev,
        venues: prev.venues.filter((venue: any) => venue.id !== id),
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete venue");
    }
  };

  const openBookingModal = (booking: any) => {
    setCurrentEditItem(booking);
    setBookingForm({
      dateFrom: booking.dateFrom,
      dateTo: booking.dateTo,
      guests: booking.guests,
    });
    setShowBookingModal(true);
  };

  const openVenueModal = (venue: any) => {
    setCurrentEditItem(venue);
    setVenueForm({
      name: venue.name,
      description: venue.description,
      price: venue.price,
      maxGuests: venue.maxGuests,
      meta: {
        wifi: venue.meta?.wifi ?? false,
        parking: venue.meta?.parking ?? false,
        breakfast: venue.meta?.breakfast ?? false,
        pets: venue.meta?.pets ?? false,
      },
      location: {
        address: venue.location?.address ?? "",
        city: venue.location?.city ?? "",
        zip: venue.location?.zip ?? "",
        country: venue.location?.country ?? "",
        continent: venue.location?.continent ?? "",
        lat: venue.location?.lat ?? 0,
        lng: venue.location?.lng ?? 0,
      },
    });
    setShowVenueModal(true);
  };

  const handleBackClick = () => {
    navigate("/");
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  if (error)
    return <div className="text-red-500 text-center mt-8">Error: {error}</div>;
  if (!profile)
    return <div className="text-center mt-8">No profile data found</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Error message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <BackButton onClick={handleBackClick} />

      {/* Profile Banner */}
      <div className="relative rounded-lg overflow-hidden mb-8 h-64">
        {profile.banner?.url ? (
          <img
            src={profile.banner.url}
            alt={profile.banner.alt ?? "Profile banner"}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-600"></div>
        )}

        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6">
          <div className="flex items-end">
            <div className="relative -mt-16 mr-6">
              <div className="w-32 h-32 rounded-full border-4 border-white overflow-hidden bg-gray-200">
                {profile.avatar?.url ? (
                  <img
                    src={profile.avatar.url}
                    alt={profile.avatar.alt ?? "Profile avatar"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl text-gray-500">
                    {profile.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
            </div>

            <div>
              <h1 className="text-3xl font-bold text-white">{profile.name}</h1>
              <p className="text-white opacity-90">{profile.email}</p>
              {profile.venueManager && (
                <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full mt-1">
                  Venue Manager
                </span>
              )}
            </div>

            <button
              onClick={() => setShowProfileModal(true)}
              className="ml-auto bg-white text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-100 transition"
            >
              Edit Profile
            </button>
          </div>
        </div>
      </div>

      {/* Bio Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">About Me</h2>
        <p className="text-gray-700">{profile.bio ?? "No bio provided"}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <h3 className="text-lg font-medium text-gray-500">Bookings</h3>
          <p className="text-3xl font-bold text-blue-600">
            {profile._count?.bookings ?? 0}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <h3 className="text-lg font-medium text-gray-500">Venues</h3>
          <p className="text-3xl font-bold text-blue-600">
            {profile._count?.venues ?? 0}
          </p>
        </div>
      </div>

      {/* Bookings Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">My Bookings</h2>
        </div>

        {profile.bookings?.length > 0 ? (
          <div className="space-y-4">
            {profile.bookings.map((booking: any) => (
              <div
                key={booking.id}
                className="border rounded-lg p-4 hover:shadow-md transition"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                  <div className="mb-4 md:mb-0">
                    <h3 className="font-medium text-lg">
                      {booking.venue.name}
                    </h3>
                    <p className="text-gray-600">
                      {booking.venue.description.substring(0, 100)}...
                    </p>
                    <div className="flex items-center mt-2">
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mr-2">
                        {booking.guests}{" "}
                        {booking.guests === 1 ? "guest" : "guests"}
                      </span>
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                        {format(new Date(booking.dateFrom), "MMM d, yyyy")} -{" "}
                        {format(new Date(booking.dateTo), "MMM d, yyyy")}
                      </span>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => openBookingModal(booking)}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleBookingDelete(booking.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            You don't have any bookings yet.
          </div>
        )}
      </div>

      {/* Venues Section (only for venue managers) */}
      {profile.venueManager && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">My Venues</h2>
          </div>

          {profile.venues?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {profile.venues.map((venue: any) => (
                <div
                  key={venue.id}
                  className="border rounded-lg overflow-hidden hover:shadow-md transition"
                >
                  {venue.media?.[0]?.url ? (
                    <img
                      src={venue.media[0].url}
                      alt={venue.media[0].alt ?? venue.name}
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-500">
                      No Image
                    </div>
                  )}

                  <div className="p-4">
                    <h3 className="font-medium text-lg mb-1">{venue.name}</h3>
                    <p className="text-gray-600 text-sm mb-2">
                      {venue.description.substring(0, 60)}...
                    </p>

                    <div className="flex items-center justify-between mt-4">
                      <div>
                        <span className="font-bold text-blue-600">
                          ${venue.price}
                        </span>
                        <span className="text-gray-500 text-sm"> / night</span>
                      </div>

                      <div className="flex space-x-2">
                        <button
                          onClick={() => openVenueModal(venue)}
                          className="bg-blue-500 text-white px-2 py-1 rounded text-sm hover:bg-blue-600 transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleVenueDelete(venue.id)}
                          className="bg-red-500 text-white px-2 py-1 rounded text-sm hover:bg-red-600 transition"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              You haven't created any venues yet.
            </div>
          )}
        </div>
      )}

      {/* Edit Profile Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Edit Profile</h2>
                <button
                  onClick={() => setShowProfileModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  &times;
                </button>
              </div>

              <form onSubmit={handleProfileUpdate}>
                <div className="mb-4">
                  <label htmlFor="bio" className="block text-gray-700 mb-2">
                    Bio
                  </label>
                  <textarea
                    value={profileForm.bio}
                    name="bio"
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, bio: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={4}
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="avatar" className="block text-gray-700 mb-2">
                    Avatar URL
                  </label>
                  <input
                    type="text"
                    name="avatar"
                    value={profileForm.avatar.url}
                    onChange={(e) =>
                      setProfileForm({
                        ...profileForm,
                        avatar: { ...profileForm.avatar, url: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="mb-4">
                  <p className="block text-gray-700 mb-2">Banner URL</p>
                  <input
                    type="text"
                    value={profileForm.banner.url}
                    onChange={(e) =>
                      setProfileForm({
                        ...profileForm,
                        banner: { ...profileForm.banner, url: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="mb-4 flex items-center">
                  <input
                    type="checkbox"
                    id="venueManager"
                    checked={profileForm.venueManager}
                    onChange={(e) =>
                      setProfileForm({
                        ...profileForm,
                        venueManager: e.target.checked,
                      })
                    }
                    className="mr-2"
                  />
                  <label htmlFor="venueManager" className="text-gray-700">
                    Venue Manager
                  </label>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowProfileModal(false)}
                    className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-100 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Booking Modal */}
      {showBookingModal && currentEditItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Edit Booking</h2>
                <button
                  onClick={() => setShowBookingModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  &times;
                </button>
              </div>

              <form onSubmit={handleBookingUpdate}>
                <fieldset className="mb-4">
                  <legend className="block text-gray-700 mb-2">Venue</legend>
                  <p className="font-medium">{currentEditItem.venue.name}</p>
                </fieldset>

                <div className="mb-4">
                  <label htmlFor="checkin" className="block text-gray-700 mb-2">
                    Check-in Date
                  </label>
                  <input
                    id="checkin"
                    type="date"
                    value={bookingForm.dateFrom}
                    onChange={(e) =>
                      setBookingForm({
                        ...bookingForm,
                        dateFrom: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="checkout"
                    className="block text-gray-700 mb-2"
                  >
                    Check-out Date
                  </label>
                  <input
                    id="checkout"
                    type="date"
                    value={bookingForm.dateTo}
                    onChange={(e) =>
                      setBookingForm({
                        ...bookingForm,
                        dateTo: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="guests" className="block text-gray-700 mb-2">
                    Number of Guests
                  </label>
                  <input
                    id="guests"
                    type="number"
                    min="1"
                    max={currentEditItem.venue.maxGuests}
                    value={bookingForm.guests}
                    onChange={(e) =>
                      setBookingForm({
                        ...bookingForm,
                        guests: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Maximum guests: {currentEditItem.venue.maxGuests}
                  </p>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowBookingModal(false)}
                    className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-100 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                  >
                    Update Booking
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Venue Modal */}
      {showVenueModal && currentEditItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Edit Venue</h2>
                <button
                  onClick={() => setShowVenueModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  &times;
                </button>
              </div>

              <form onSubmit={handleVenueUpdate}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="mb-4">
                    <label
                      htmlFor="venue-name"
                      className="block text-gray-700 mb-2"
                    >
                      Name
                    </label>
                    <input
                      id="venue-name"
                      type="text"
                      value={venueForm.name}
                      onChange={(e) =>
                        setVenueForm({ ...venueForm, name: e.target.value })
                      }
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label
                      htmlFor="venue-price"
                      className="block text-gray-700 mb-2"
                    >
                      Price per night ($)
                    </label>
                    <input
                      id="venue-price"
                      type="number"
                      min="0"
                      value={venueForm.price}
                      onChange={(e) =>
                        setVenueForm({
                          ...venueForm,
                          price: parseFloat(e.target.value),
                        })
                      }
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="venue-description"
                    className="block text-gray-700 mb-2"
                  >
                    Description
                  </label>
                  <textarea
                    id="venue-description"
                    value={venueForm.description}
                    onChange={(e) =>
                      setVenueForm({
                        ...venueForm,
                        description: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={4}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="mb-4">
                    <label
                      htmlFor="venue-guests"
                      className="block text-gray-700 mb-2"
                    >
                      Max Guests
                    </label>
                    <input
                      id="venue-guests"
                      type="number"
                      min="1"
                      value={venueForm.maxGuests}
                      onChange={(e) =>
                        setVenueForm({
                          ...venueForm,
                          maxGuests: parseInt(e.target.value),
                        })
                      }
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <p className="block text-gray-700 mb-2">Amenities</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="wifi"
                        checked={venueForm.meta.wifi}
                        onChange={(e) =>
                          setVenueForm({
                            ...venueForm,
                            meta: { ...venueForm.meta, wifi: e.target.checked },
                          })
                        }
                        className="mr-2"
                      />
                      <label htmlFor="wifi">WiFi</label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="parking"
                        checked={venueForm.meta.parking}
                        onChange={(e) =>
                          setVenueForm({
                            ...venueForm,
                            meta: {
                              ...venueForm.meta,
                              parking: e.target.checked,
                            },
                          })
                        }
                        className="mr-2"
                      />
                      <label htmlFor="parking">Parking</label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="breakfast"
                        checked={venueForm.meta.breakfast}
                        onChange={(e) =>
                          setVenueForm({
                            ...venueForm,
                            meta: {
                              ...venueForm.meta,
                              breakfast: e.target.checked,
                            },
                          })
                        }
                        className="mr-2"
                      />
                      <label htmlFor="breakfast">Breakfast</label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="pets"
                        checked={venueForm.meta.pets}
                        onChange={(e) =>
                          setVenueForm({
                            ...venueForm,
                            meta: { ...venueForm.meta, pets: e.target.checked },
                          })
                        }
                        className="mr-2"
                      />
                      <label htmlFor="pets">Pets Allowed</label>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <h3 className="text-lg font-medium mb-2">Location</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="venue-address"
                        className="block text-gray-700 mb-2"
                      >
                        Address
                      </label>
                      <input
                        id="venue-address"
                        type="text"
                        value={venueForm.location.address}
                        onChange={(e) =>
                          setVenueForm({
                            ...venueForm,
                            location: {
                              ...venueForm.location,
                              address: e.target.value,
                            },
                          })
                        }
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="venue-city"
                        className="block text-gray-700 mb-2"
                      >
                        City
                      </label>
                      <input
                        id="venue-city"
                        type="text"
                        value={venueForm.location.city}
                        onChange={(e) =>
                          setVenueForm({
                            ...venueForm,
                            location: {
                              ...venueForm.location,
                              city: e.target.value,
                            },
                          })
                        }
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="venue-zip"
                        className="block text-gray-700 mb-2"
                      >
                        ZIP Code
                      </label>
                      <input
                        id="venue-zip"
                        type="text"
                        value={venueForm.location.zip}
                        onChange={(e) =>
                          setVenueForm({
                            ...venueForm,
                            location: {
                              ...venueForm.location,
                              zip: e.target.value,
                            },
                          })
                        }
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="venue-country"
                        className="block text-gray-700 mb-2"
                      >
                        Country
                      </label>
                      <input
                        id="venue-country"
                        type="text"
                        value={venueForm.location.country}
                        onChange={(e) =>
                          setVenueForm({
                            ...venueForm,
                            location: {
                              ...venueForm.location,
                              country: e.target.value,
                            },
                          })
                        }
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="venue-continent"
                        className="block text-gray-700 mb-2"
                      >
                        Continent
                      </label>
                      <input
                        id="venue-continent"
                        type="text"
                        value={venueForm.location.continent}
                        onChange={(e) =>
                          setVenueForm({
                            ...venueForm,
                            location: {
                              ...venueForm.location,
                              continent: e.target.value,
                            },
                          })
                        }
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowVenueModal(false)}
                    className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-100 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                  >
                    Update Venue
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
