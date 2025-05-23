import React, { useState } from "react";
import { Calendar, Users, X } from "lucide-react";
import { createBooking } from "../services/api";
import type { Venue } from "../types";

interface BookNowModalProps {
  venue: Venue;
  onClose: () => void;
  onBookingSuccess: () => void;
}

export const BookNowModal: React.FC<BookNowModalProps> = ({
  venue,
  onClose,
  onBookingSuccess,
}) => {
  const [bookingData, setBookingData] = useState({
    dateFrom: "",
    dateTo: "",
    guests: 1,
    venueId: venue.id,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBookingData((prev) => ({
      ...prev,
      [name]: name === "guests" ? parseInt(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validate dates
    if (new Date(bookingData.dateFrom) >= new Date(bookingData.dateTo)) {
      setError("Check-out date must be after check-in date");
      setLoading(false);
      return;
    }

    // Validate guests
    if (bookingData.guests < 1 || bookingData.guests > venue.maxGuests) {
      setError(`Number of guests must be between 1 and ${venue.maxGuests}`);
      setLoading(false);
      return;
    }

    try {
      await createBooking(bookingData);
      onBookingSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create booking");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold truncate">
              Book {venue.name}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 flex-shrink-0"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">
                <Calendar className="inline h-5 w-5 mr-2" />
                Check-in Date
              </label>
              <input
                type="date"
                name="dateFrom"
                value={bookingData.dateFrom}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                min={new Date().toISOString().split("T")[0]}
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">
                <Calendar className="inline h-5 w-5 mr-2" />
                Check-out Date
              </label>
              <input
                type="date"
                name="dateTo"
                value={bookingData.dateTo}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                min={
                  bookingData.dateFrom || new Date().toISOString().split("T")[0]
                }
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 mb-2">
                <Users className="inline h-5 w-5 mr-2" />
                Number of Guests (Max: {venue.maxGuests})
              </label>
              <input
                type="number"
                name="guests"
                value={bookingData.guests}
                onChange={handleInputChange}
                min="1"
                max={venue.maxGuests}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-100 transition"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition flex items-center justify-center"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  "Confirm Booking"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
