import React from "react";

const FeedbackForm = ({ feedback, setFeedback, handleSubmitFeedback }) => {
  return (
    <form className="feedback-form" onSubmit={handleSubmitFeedback}>
      <h2>✨ Share Your Feedback</h2>
      <textarea
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
        placeholder="Tell us what you think..."
      />
      <button type="submit">Submit Feedback</button>
    </form>
  );
};

export default FeedbackForm;
