const axios = require('axios');
const { exerciseImages } = require('../src/services/exerciseMediaService');

async function testImageUrl(name, url) {
  try {
    const response = await axios.head(url);
    if (response.status === 200) {
      console.log(`✅ ${name}: OK`);
      return true;
    } else {
      console.log(`❌ ${name}: Status ${response.status}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ ${name}: ${error.message}`);
    return false;
  }
}

async function testAllImages() {
  console.log('Testando URLs das imagens...\n');
  
  const results = [];
  const failedImages = [];
  
  for (const [name, url] of Object.entries(exerciseImages)) {
    const isValid = await testImageUrl(name, url);
    results.push({ name, url, isValid });
    if (!isValid) {
      failedImages.push(name);
    }
  }
  
  console.log('\nResumo:');
  console.log(`Total de imagens: ${results.length}`);
  console.log(`Funcionando: ${results.filter(r => r.isValid).length}`);
  console.log(`Com erro: ${failedImages.length}`);
  
  if (failedImages.length > 0) {
    console.log('\nExercícios com imagens quebradas:');
    failedImages.forEach(name => console.log(`- ${name}`));
  }
}

testAllImages().catch(console.error); 