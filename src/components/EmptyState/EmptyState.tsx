import React from 'react';
import './EmptyState.scss';

interface EmptyStateProps {
  leaguesCount: number;
  selectedIndex: number | undefined;
}

const EmptyState: React.FC<EmptyStateProps> = ({ leaguesCount, selectedIndex }) => {
  let message = '';

  if (leaguesCount === 0) {
    message = 'No leagues found matching your search. Please try a different term.';
  } else if (selectedIndex === undefined) {
    message = 'Please select a league to view its details.';
  }

  return (
    <div className="empty-state">
      <p>{message}</p>
    </div>
  );
};

export default EmptyState;
