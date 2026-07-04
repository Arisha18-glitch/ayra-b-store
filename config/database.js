'use strict';

const mongoose = require('mongoose');

let isConnected = false;

function getConnectionURI() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI environment variable is not defined.');
  }
  return uri;
}

async function connectDatabase() {
  if (isConnected) {
    return mongoose.connection;
  }

  mongoose.set('strictQuery', true);

  const connectionOptions = {
    serverSelectionTimeoutMS: 8000,
    socketTimeoutMS: 45000,
    maxPoolSize: 10,
    minPoolSize: 2,
    retryWrites: true,
    w: 'majority'
  };

  const connection = mongoose.connection;

  connection.on('connected', function () {
    isConnected = true;
    console.log('[DB] MongoDB connection established.');
  });

  connection.on('disconnected', function () {
    isConnected = false;
    console.warn('[DB] MongoDB connection lost.');
  });

  connection.on('error', function (err) {
    isConnected = false;
    console.error('[DB] MongoDB connection error:', err.message);
  });

  try {
    await mongoose.connect(getConnectionURI(), connectionOptions);
    return connection;
  } catch (err) {
    isConnected = false;
    console.error('[DB] Initial connection failed:', err.message);
    throw err;
  }
}

function getConnectionState() {
  return {
    connected: isConnected,
    readyState: mongoose.connection.readyState,
    host: mongoose.connection.host || null
  };
}

module.exports = { connectDatabase, getConnectionState };
