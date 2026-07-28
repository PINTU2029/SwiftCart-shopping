import React from 'react';

const Rating = ({ value, text }) => {
  return (
    <div className="flex items-center gap-1 text-amber-400 text-sm my-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star}>
          {value >= star ? '★' : value >= star - 0.5 ? '½' : '☆'}
        </span>
      ))}
      {text && <span className="text-xs text-slate-500 ml-1">({text})</span>}
    </div>
  );
};

export default Rating;