// Simple test script to verify backend is working
console.log('🧪 Testing AI Diet Planner Backend...\n');

const TEST_URL = 'http://localhost:5000';

async function testEndpoint(name, method, url, body = null) {
  try {
    const options = {
      method,
      headers: { 'Content-Type': 'application/json' },
    };
    
    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(url, options);
    const data = await response.json();
    
    if (response.ok) {
      console.log(`✅ ${name}: PASS`);
      console.log(`   Response:`, data);
    } else {
      console.log(`❌ ${name}: FAIL`);
      console.log(`   Error:`, data);
    }
  } catch (error) {
    console.log(`❌ ${name}: ERROR`);
    console.log(`   ${error.message}`);
  }
  console.log('');
}

async function runTests() {
  console.log('Testing Backend Endpoints...\n');
  
  // Test 1: Health Check
  await testEndpoint(
    'Health Check',
    'GET',
    `${TEST_URL}/api/health`
  );
  
  // Test 2: Save Plan
  await testEndpoint(
    'Save Diet Plan',
    'POST',
    `${TEST_URL}/api/save-plan`,
    {
      dietPlan: 'Test diet plan content',
      userInfo: { age: 28, gender: 'Male', weight: 70 },
      parsedData: { bmi: '22.8', calories: '2450' }
    }
  );
  
  // Test 3: Get History
  await testEndpoint(
    'Get History',
    'GET',
    `${TEST_URL}/api/history`
  );
  
  console.log('═══════════════════════════════════════');
  console.log('✅ All tests completed!');
  console.log('\n💡 To test PDF generation, use the web UI:');
  console.log('   1. Run: npm run dev:all');
  console.log('   2. Open: http://localhost:5173');
  console.log('   3. Generate plan and click "Download PDF"');
  console.log('═══════════════════════════════════════');
}

// Run tests
runTests().catch(console.error);
