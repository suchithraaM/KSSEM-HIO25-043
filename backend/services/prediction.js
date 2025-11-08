// lightweight predict function used in /book
// replace with TF model call when ready

function predictWaitTime(department) {
  // heuristic by department: e.g., cardiology busier, longer waits
  const base = { General: 10, Cardiology: 20, Neurology: 18, Ophthalmology: 8, Orthopedics: 15 };
  const deptBase = base[department] || 12;
  // small random jitter
  return Math.max(3, Math.round(deptBase + (Math.random() * 6 - 3)));
}

async function trainModel() {
  // placeholder: build/train tfjs model using historical data if available
  console.log('🧠 trainModel() placeholder - implement TF training here if needed');
  return true;
}

module.exports = { predictWaitTime, trainModel };
