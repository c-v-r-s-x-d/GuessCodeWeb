const ActivityStatus = ({ status }) => {
  const getStatusClass = () => {
    switch (status) {
      case 1:
        return 'status-offline';
      case 2:
        return 'status-away';
      case 3:
        return 'status-online';
      default:
        return 'status-offline';
    }
  };

  return <div className={`activity-status ${getStatusClass()}`} />;
}; 