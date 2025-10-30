// src/markup/components/TestConnection.js
import React, { useState } from 'react';

function TestConnection() {
  const [status, setStatus] = useState('Click to test connection');
  const [response, setResponse] = useState('');

  const testConnection = async () => {
    setStatus('Testing...');
    
    try {
      const testUrl = `${process.env.REACT_APP_API_URL}/api/employee/login`;
      setStatus(`Testing: ${testUrl}`);
      
      const res = await fetch(testUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          employee_email: 'test@test.com', 
          employee_password: 'password123' 
        })
      });
      
      const text = await res.text();
      setResponse(`Status: ${res.status}\n\nResponse: ${text}`);
      
    } catch (error) {
      setResponse(`Error: ${error.message}`);
    }
  };

  return (
    <div style={{ 
      padding: '20px', 
      background: '#f0f0f0', 
      border: '1px solid #ccc',
      margin: '20px'
    }}>
      <h3>Backend Connection Test</h3>
      <button onClick={testConnection}>Test Backend Connection</button>
      <div style={{ marginTop: '10px' }}>
        <strong>Status:</strong> {status}
      </div>
      <pre style={{ 
        background: 'white', 
        padding: '10px', 
        marginTop: '10px',
        overflow: 'auto',
        maxHeight: '200px'
      }}>
        {response}
      </pre>
    </div>
  );
}

export default TestConnection;