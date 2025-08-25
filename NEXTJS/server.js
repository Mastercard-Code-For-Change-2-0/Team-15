const { WebSocketServer } = require('ws');

// Store all connected clients
let connectedClients = [];

console.log('🚀 Starting WebSocket server...');

// Create WebSocket server on port 8080
const wss = new WebSocketServer({ 
  port: 8080,
  perMessageDeflate: false
});

console.log('✅ WebSocket server running on ws://localhost:8080');

// Handle new connections
wss.on('connection', function connection(ws, request) {
  console.log('🎉 New client connected! Total clients:', connectedClients.length + 1);
  
  // Add client to our list
  connectedClients.push(ws);
  
  // Send welcome message
  const welcomeMessage = {
    type: 'welcome',
    message: `Welcome! You are client #${connectedClients.length}`,
    timestamp: new Date().toISOString(),
    totalClients: connectedClients.length
  };
  
  ws.send(JSON.stringify(welcomeMessage));
  
  // Notify other clients about new user
  const userJoinedMessage = {
    type: 'system',
    message: `A new user joined the chat! (${connectedClients.length} total users)`,
    timestamp: new Date().toISOString()
  };
  
  // Send to all OTHER clients (not the new one)
  connectedClients.forEach(client => {
    if (client !== ws && client.readyState === 1) {
      client.send(JSON.stringify(userJoinedMessage));
    }
  });

  // Handle incoming messages
  ws.on('message', function message(data) {
    console.log('📨 Received message:', data.toString());
    
    try {
      const messageData = JSON.parse(data.toString());
      
      // Create broadcast message
      const broadcastMessage = {
        type: 'chat',
        user: messageData.user || 'Anonymous',
        message: messageData.message,
        timestamp: new Date().toISOString(),
        totalClients: connectedClients.length
      };

      console.log('📡 Broadcasting to', connectedClients.length, 'clients');

      // Send to ALL connected clients
      connectedClients.forEach(client => {
        if (client.readyState === 1) { // Check if connection is open
          client.send(JSON.stringify(broadcastMessage));
        }
      });

    } catch (error) {
      console.error('❌ Error parsing message:', error);
      
      // Send error message back to sender
      if (ws.readyState === 1) {
        ws.send(JSON.stringify({
          type: 'error',
          message: 'Invalid message format',
          timestamp: new Date().toISOString()
        }));
      }
    }
  });

 

  // Handle client disconnect
  ws.on('close', function close() {
    console.log('👋 Client disconnected');
    
    // Remove from clients list
    connectedClients = connectedClients.filter(client => client !== ws);
    console.log('👥 Remaining clients:', connectedClients.length);
    
    // Notify other clients about user leaving
    const userLeftMessage = {
      type: 'system',
      message: `A user left the chat. (${connectedClients.length} remaining users)`,
      timestamp: new Date().toISOString()
    };
    
    connectedClients.forEach(client => {
      if (client.readyState === 1) {
        client.send(JSON.stringify(userLeftMessage));
      }
    });
  });

  // Handle connection errors
  ws.on('error', function error(err) {
    console.error('🚨 Client connection error:', err);
    
    // Remove from clients list
    connectedClients = connectedClients.filter(client => client !== ws);
    console.log('👥 Remaining clients after error:', connectedClients.length);
  });
});

// Handle server errors
wss.on('error', function error(err) {
  console.error('🚨 WebSocket server error:', err);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down WebSocket server...');
  
  // Close all client connections
  connectedClients.forEach(client => {
    if (client.readyState === 1) {
      client.send(JSON.stringify({
        type: 'system',
        message: 'Server is shutting down. Please refresh to reconnect.',
        timestamp: new Date().toISOString()
      }));
      client.close();
    }
  });
  
  // Close server
  wss.close(() => {
    console.log('✅ WebSocket server closed');
    process.exit(0);
  });
});

console.log('📱 WebSocket server is ready for connections!');
