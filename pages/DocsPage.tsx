import React from 'react';

const DocsPage: React.FC = () => {
  return (
    <div style={{ paddingTop: '64px' }}>
      <iframe
        src="/docs/index.html"
        title="Odara Documentation"
        style={{
          width: '100%',
          height: 'calc(100vh - 64px)',
          border: 'none',
          display: 'block',
        }}
      />
    </div>
  );
};

export default DocsPage;
