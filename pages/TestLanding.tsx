import React from 'react';

const TestLanding: React.FC = () => {
  return (
    <div style={{ padding: '50px', textAlign: 'center' }}>
      <h1 style={{ fontSize: '48px', color: '#076AC2' }}>
        ✅ Landing Page Funcionando!
      </h1>
      <p style={{ fontSize: '24px', marginTop: '20px' }}>
        Se você está vendo esta mensagem, a rota "/" está funcionando corretamente.
      </p>
      <div style={{ marginTop: '40px' }}>
        <a href="/login" style={{ padding: '15px 30px', background: '#076AC2', color: 'white', textDecoration: 'none', borderRadius: '8px', fontSize: '18px' }}>
          Ir para Login
        </a>
      </div>
    </div>
  );
};

export default TestLanding;
