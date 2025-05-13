import { useState } from "react";
import customApi from "../custom-api/axiosInstance";

export default function FeedbackModal() {
    const [open, setOpen] = useState(false);
    const [feedback, setFeedback] = useState("");

    const handleSubmit = async () => {
        try {
            await customApi.post("/feedback", { feedback }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }           
        });

            alert("Feedback submitted. Thank you!");
            setFeedback("");
            setOpen(false);
        } catch (error) {
            console.error("Feedback submission error:", error);
            alert(error.response?.data?.error || "Failed to submit feedback.");
        }
    };

    return (
        <>
            {/* Floating Button */}
            <button
                onClick={() => setOpen(true)}
                className="fixed bottom-6 right-6 bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-blue-700"
            >
                Feedback
            </button>

            {/* Modal */}
            {open && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-md shadow-md w-96">
    <h2 className="text-xl font-semibold mb-2 heading-bounce text-gradient">🎉 Your Thoughts Matter 🎉</h2>
    <p className="text-sm text-gray-600 mb-4 italic">Help us make magic happen! ✨</p>
    <textarea
        rows={5}
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        placeholder="Share your feedback. What do you love? What can we improve?"
    />
    <div className="mt-4 flex justify-end space-x-2">
        <button
            onClick={() => setOpen(false)}
            className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
        >
            Cancel
        </button>
        <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white rounded-md hover:scale-110 transition-all ease-in-out duration-200"
        >
            Submit Feedback
        </button>
    </div>
</div>

                </div>
            )}
        </>
    );
}