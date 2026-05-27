// Test the email API endpoint
const fetch = require('node-fetch'); // You might need: npm install node-fetch

// Alternative using built-in modules
const http = require('http');

async function testEmailAPI() {
  console.log('🧪 Testing Email API Endpoint...\n');

  const data = JSON.stringify({
    to: 'joshikhagendra83@gmail.com',
    subject: 'Test Email from API',
    message: 'This is a test email sent through the FAD Platform API endpoint!'
  });

  const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/test-email',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(data)
    }
  };

  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let responseData = '';

      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        try {
          const result = JSON.parse(responseData);
          console.log('✅ API Response:', result);
          
          if (result.success) {
            console.log('🎉 Email sent successfully!');
            console.log('📧 Check your inbox:', 'joshikhagendra83@gmail.com');
          } else {
            console.log('❌ Email failed:', result.message);
            console.log('Error:', result.error);
          }
          
          resolve(result);
        } catch (error) {
          console.error('❌ Failed to parse response:', error);
          console.log('Raw response:', responseData);
          reject(error);
        }
      });
    });

    req.on('error', (error) => {
      console.error('❌ Request failed:', error.message);
      reject(error);
    });

    req.write(data);
    req.end();
  });
}

// Run the test
testEmailAPI().catch(console.error);