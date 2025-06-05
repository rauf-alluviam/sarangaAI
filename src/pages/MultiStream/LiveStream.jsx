import React from 'react';

const LiveStream = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '1rem' }}>
      <img
        src="http://13.202.42.73:8015/stream?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJuYW1kZW8iLCJwdXJwb3NlIjoic3RyZWFtaW5nIiwiZXhwIjoxNzQ0NDU5NzU0fQ.lLgdY1aUrc88MxFNJ44QT7ABAhnD0H1DWsY68MzI1gc"
        alt="Live Stream"
        style={{
          width: '100%',
        //   maxWidth: '900px',
          borderRadius: '10px',
          border: '2px solid #333'
        }}
      />
    </div>
  );
};

export default LiveStream;