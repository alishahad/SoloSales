async function run() {
  try {
    const res = await fetch('http://localhost:3000/api/generate-logo', { method: 'POST' });
    console.log('Status:', res.status);
    console.log('Headers:', Object.fromEntries(res.headers.entries()));
    const text = await res.text();
    console.log('Body:', text);
  } catch (e) {
    console.error('Error:', e);
  }
}
run();
