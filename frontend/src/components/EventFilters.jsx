import React from "react";

const EventFilters = ({
  category,
  setCategory,
  date,
  setDate,
  onFilterByCategory,
  onFilterByDate,
  onReset,
}) => {
  return (
    <>
      <style>{`
        .filters {
          background: rgba(28, 28, 28, 0.8);
          backdrop-filter: blur(10px);
          padding: 25px;
          border-radius: 16px;
          box-shadow: 0 0 25px rgba(198, 137, 254, 0.15);
          display: flex;
          flex-wrap: wrap;
          gap: 15px;
          justify-content: center;
          margin-bottom: 30px;
        }

        .filters input {
          background: #1c1c1c;
          border: 1px solid #3b2a57;
          color: #e6dcff;
          padding: 10px 15px;
          border-radius: 8px;
          outline: none;
          font-size: 14px;
        }

        .filters input:focus {
          border: 1px solid #bfa2f7;
          box-shadow: 0 0 10px rgba(198, 137, 254, 0.2);
        }

        .filters button {
          background: linear-gradient(93deg, #6e4bbf 0%, #c689fe 110%);
          color: #fff;
          border: none;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 600;
          text-transform: uppercase;
          padding: 10px 20px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .filters button:hover {
          transform: scale(1.05);
          box-shadow: 0 0 15px rgba(198, 137, 254, 0.4);
        }
      `}</style>

      <div className="filters">
        <input
          type="text"
          placeholder="Search by Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        <button onClick={onFilterByCategory}>Filter</button>

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <button onClick={onFilterByDate}>By Date</button>

        <button onClick={onReset}>Reset</button>
      </div>
    </>
  );
};

export default EventFilters;
