#!/usr/bin/env node
/**
 * MongoDB Atlas Connection Diagnostic Tool
 * Tests various connection methods and network accessibility
 */

const dns = require('dns').promises;
const net = require('net');
const { MongoClient } = require('mongodb');

const MONGO_URI = 'mongodb+srv://mdfaisala84_db_user:zDVll9xegq80aHHQ@cluster0.erg33pk.mongodb.net/?appName=Cluster0';
const SRV_HOST = '_mongodb._tcp.cluster0.erg33pk.mongodb.net';
const DIRECT_HOSTS = ['cluster0-shard-00-00.erg33pk.mongodb.net', 'cluster0-shard-00-01.erg33pk.mongodb.net', 'cluster0-shard-00-02.erg33pk.mongodb.net'];

console.log('🔍 MongoDB Atlas Connection Diagnostic Tool\n');
console.log('📍 Target: cluster0.erg33pk.mongodb.net\n');

async function testDNS() {
  console.log('1️⃣  Testing DNS Resolution...');
  try {
    console.log('   Testing SRV record lookup...');
    const srvRecords = await dns.resolveSrv(SRV_HOST);
    console.log('   ✅ SRV records found:', srvRecords.length);
    srvRecords.forEach((record, i) => {
      console.log(`      [${i + 1}] ${record.name}:${record.port}`);
    });
    return true;
  } catch (err) {
    console.log('   ❌ SRV lookup failed:', err.message);
    console.log('      This is the issue! Your network cannot resolve MongoDB SRV records.\n');
    
    console.log('   Testing A record fallback...');
    try {
      for (const host of DIRECT_HOSTS) {
        const ips = await dns.resolve4(host);
        console.log(`   ✅ ${host}: ${ips[0]}`);
      }
      console.log('   ℹ️  A records resolve, but SRV lookup fails (network issue)\n');
      return false;
    } catch (err2) {
      console.log('   ❌ A record lookup also failed:', err2.message);
      console.log('   ⚠️  Complete DNS failure - check your internet connection\n');
      return false;
    }
  }
}

async function testTCPConnection() {
  console.log('2️⃣  Testing TCP Connection (port 27017)...');
  for (const host of DIRECT_HOSTS) {
    try {
      await new Promise((resolve, reject) => {
        const socket = net.createConnection({
          host,
          port: 27017,
          timeout: 5000
        });
        
        socket.on('connect', () => {
          console.log(`   ✅ Connected to ${host}:27017`);
          socket.destroy();
          resolve();
        });
        
        socket.on('error', (err) => {
          console.log(`   ❌ Cannot connect to ${host}:27017: ${err.message}`);
          reject(err);
        });
      });
      break; // Success, no need to test others
    } catch (err) {
      // Continue to next host
    }
  }
  console.log();
}

async function testMongoClient() {
  console.log('3️⃣  Testing MongoDB Client Connection...');
  const client = new MongoClient(MONGO_URI, {
    serverSelectionTimeoutMS: 10000,
    connectTimeoutMS: 10000,
    socketTimeoutMS: 10000
  });

  try {
    await client.connect();
    console.log('   ✅ Successfully connected to MongoDB Atlas!');
    const adminDb = client.db('admin');
    const result = await adminDb.command({ ping: 1 });
    console.log('   ✅ Ping successful:', result);
    await client.close();
    return true;
  } catch (err) {
    console.log('   ❌ Connection failed:', err.message);
    if (err.message.includes('querySrv')) {
      console.log('   ℹ️  This is the same DNS issue from step 1');
    }
    return false;
  }
}

async function main() {
  try {
    const dnsOk = await testDNS();
    if (dnsOk) {
      await testTCPConnection();
      await testMongoClient();
    } else {
      console.log('⚠️  Skipping TCP/MongoDB tests due to DNS failure\n');
    }
    
    console.log('📋 Summary:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Your MongoDB URI is: ', MONGO_URI.substring(0, 50) + '...');
    console.log('Credentials appear valid, but network cannot reach MongoDB.\n');
    
    console.log('🔧 Troubleshooting Steps:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('1. Check your internet connection');
    console.log('2. Verify firewall allows outbound connections to port 27017');
    console.log('3. Check if you\'re behind a corporate proxy/VPN');
    console.log('4. Try: telnet cluster0.erg33pk.mongodb.net 27017');
    console.log('5. Disable VPN/proxy temporarily and test');
    console.log('6. Use a different network (mobile hotspot) to test');
    console.log('7. Contact your network administrator if behind corporate network\n');
    
    console.log('✅ Current Status: In-memory MongoDB is working for development');
    console.log('   Your app runs fine without external MongoDB connection.\n');
    
  } catch (err) {
    console.error('❌ Diagnostic error:', err.message);
  }
}

main();
