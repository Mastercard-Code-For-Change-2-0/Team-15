'use client';

import { useState, useEffect, useRef } from 'react';

export default function ChatComponent() {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [username, setUsername] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState(''); // New: Track connection errors
  const [isReconnecting, setIsReconnecting] = useState(false); // New: Track reconnection attempts
  
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const connectWebSocket = () => {
      try {
        console.log('🔌 Attempting to connect to WebSocket server...');
        setConnectionError(''); // Clear previous errors
        setIsReconnecting(false);
        
        const ws = new WebSocket('ws://localhost:8080');
        
        // Connection opened successfully
        ws.onopen = function() {
          console.log('✅ Connected to WebSocket server');
          setIsConnected(true);
          setSocket(ws);
          setConnectionError('');
          setIsReconnecting(false);
        };

        // Message received from server
        ws.onmessage = function(event) {
          console.log('📩 Message received:', event.data);
          
          try {
            const messageData = JSON.parse(event.data);
            setMessages(prevMessages => [...prevMessages, messageData]);
          } catch (error) {
            console.error('❌ Error parsing message:', error);
          }
        };

        // Connection closed
        ws.onclose = function(event) {
          console.log('🔌 WebSocket connection closed. Code:', event.code, 'Reason:', event.reason);
          setIsConnected(false);
          setSocket(null);
          
          // Only attempt reconnection if it wasn't a clean close
          if (event.code !== 1000) { // 1000 = normal closure
            setConnectionError('Connection lost. Attempting to reconnect...');
            setIsReconnecting(true);
            
            setTimeout(() => {
              console.log('🔄 Attempting to reconnect...');
              connectWebSocket();
            }, 3000);
          }
        };

        // Connection error occurred
        ws.onerror = function(error) {
          console.error('🚨 WebSocket connection error:', error);
          setIsConnected(false);
          setConnectionError('Cannot connect to server. Make sure the WebSocket server is running on port 8080.');
          setIsReconnecting(false);
        };

      } catch (error) {
        console.error('❌ Failed to create WebSocket connection:', error);
        setConnectionError('Failed to create WebSocket connection: ' + error.message);
        setIsConnected(false);
      }
    };

    connectWebSocket();

    return () => {
      if (socket) {
        console.log('🧹 Cleaning up WebSocket connection');
        socket.close(1000, 'Component unmounting'); // Clean close
      }
    };
  }, []);

   useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (socket && socket.readyState === 1 && inputMessage.trim() && username.trim()) {
      const messageData = {
        user: username.trim(),
        message: inputMessage.trim()
      };

      console.log('📤 Sending message:', messageData);
      socket.send(JSON.stringify(messageData));
      setInputMessage('');
    } else {
      if (!username.trim()) {
        alert('Please enter your name first!');
      } else if (!inputMessage.trim()) {
        alert('Please enter a message!');
      } else if (!socket || socket.readyState !== 1) {
        alert('Not connected to server! Please wait for connection or check if server is running.');
      }
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      sendMessage();
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  // Manual reconnect function
  const handleReconnect = () => {
    if (socket) {
      socket.close();
    }
    setIsReconnecting(true);
    setConnectionError('Reconnecting...');
    
    setTimeout(() => {
      window.location.reload(); // Simple way to restart connection
    }, 1000);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>💬 WebSocket Chat App</h1>
      
      {/* Enhanced connection status */}
      <div style={{ 
        padding: '10px', 
        marginBottom: '20px', 
        borderRadius: '5px',
        backgroundColor: isConnected ? '#d4edda' : (connectionError ? '#f8d7da' : '#fff3cd'),
        color: isConnected ? '#155724' : (connectionError ? '#721c24' : '#856404'),
        border: `1px solid ${isConnected ? '#c3e6cb' : (connectionError ? '#f5c6cb' : '#ffeaa7')}`
      }}>
        <div>
          Status: {isConnected ? '🟢 Connected' : (isReconnecting ? '🟡 Reconnecting...' : '🔴 Disconnected')}
        </div>
        {connectionError && (
          <div style={{ marginTop: '5px', fontSize: '14px' }}>
            ⚠️ {connectionError}
            {!isReconnecting && (
              <button 
                onClick={handleReconnect}
                style={{
                  marginLeft: '10px',
                  padding: '2px 8px',
                  fontSize: '12px',
                  backgroundColor: 'white',
                  color: 'black',
                  border: 'none',
                  borderRadius: '3px',
                  cursor: 'pointer'
                }}
              >
                Retry Connection
              </button>
            )}
          </div>
        )}
      </div>

      {/* Rest of the component remains the same */}
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Enter your name..."
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{
            width: '100%',
            padding: '10px',
            border: '1px solid #ddd',
            borderRadius: '5px',
            fontSize: '16px'
          }}
        />
      </div>

      <div style={{
        height: '400px',
        border: '1px solid #ddd',
        borderRadius: '5px',
        padding: '10px',
        overflowY: 'scroll',
        backgroundColor: '#f9f9f9'
      }}>
        {messages.map((msg, index) => (
          <div key={index} style={{
            marginBottom: '10px',
            padding: '8px',
            backgroundColor: msg.type === 'welcome' ? '#e7f3ff' : 
                           msg.type === 'system' ? '#fff3e0' : '#fff',
            borderRadius: '5px',
            border: '1px solid #eee'
          }}>
            {msg.type === 'welcome' ? (
              <div style={{ color: '#007bff', fontStyle: 'italic' }}>
                🎉 {msg.message}
              </div>
            ) : msg.type === 'system' ? (
              <div style={{ color: '#ff9800', fontStyle: 'italic', fontSize: '14px' }}>
                📢 {msg.message}
              </div>
            ) : (
              <div>
                <strong style={{ color: '#333' }}>{msg.user}</strong>
                <span style={{ color: '#666', fontSize: '12px', marginLeft: '10px' }}>
                  {formatTime(msg.timestamp)}
                </span>
                <div style={{ marginTop: '5px' }}>{msg.message}</div>
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div style={{ display: 'flex', marginTop: '10px', gap: '10px' }}>
        <input
          type="text"
          placeholder="Type your message..."
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={!isConnected || !username.trim()}
          style={{
            flex: 1,
            padding: '10px',
            border: '1px solid #ddd',
            borderRadius: '5px',
            fontSize: '16px',
            opacity: (!isConnected || !username.trim()) ? 0.6 : 1
          }}
        />
        <button
          onClick={sendMessage}
          disabled={!isConnected || !username.trim() || !inputMessage.trim()}
          style={{
            padding: '10px 20px',
            backgroundColor: isConnected ? '#007bff' : '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: isConnected ? 'pointer' : 'not-allowed',
            fontSize: '16px'
          }}
        >
          Send 📨
        </button>
      </div>

   
    </div>
  );
}