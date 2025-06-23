import jsPDF from 'jspdf';

// Configuração de fontes para suporte a caracteres especiais
const configurePDFFont = (doc) => {
  // Configurar encoding para suportar caracteres especiais
  try {
    doc.setFont('helvetica');
  } catch (error) {
    console.warn('Font configuration error:', error);
  }
};

// Função para formatar data em português
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Função para adicionar cabeçalho do PDF
const addHeader = (doc, title) => {
  configurePDFFont(doc);
  
  // Título principal
  doc.setFontSize(20);
  doc.setTextColor(139, 92, 246); // Purple
  doc.text('FitnessTracker - Relatorio de Dados', 20, 30);
  
  // Subtítulo
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text(title, 20, 45);
  
  // Data de geração
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Gerado em: ${formatDate(new Date().toISOString())}`, 20, 55);
  
  // Linha separadora
  doc.setDrawColor(200, 200, 200);
  doc.line(20, 65, 190, 65);
  
  return 75; // Retorna a posição Y onde o conteúdo deve começar
};

// Função para adicionar rodapé
const addFooter = (doc, pageNumber = 1) => {
  const pageHeight = doc.internal.pageSize.height;
  
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  
  // Linha separadora
  doc.setDrawColor(200, 200, 200);
  doc.line(20, pageHeight - 25, 190, pageHeight - 25);
  
  // Texto do rodapé
  doc.text('FitnessTracker - Seus dados de fitness', 20, pageHeight - 15);
  doc.text(`Página ${pageNumber}`, 170, pageHeight - 15);
};

// Função para quebrar texto longo
const wrapText = (doc, text, maxWidth) => {
  const words = text.split(' ');
  const lines = [];
  let currentLine = '';
  
  words.forEach(word => {
    const testLine = currentLine + (currentLine ? ' ' : '') + word;
    const textWidth = doc.getTextWidth(testLine);
    
    if (textWidth < maxWidth) {
      currentLine = testLine;
    } else {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
    }
  });
  
  if (currentLine) lines.push(currentLine);
  return lines;
};

// Exportar dados das ferramentas (ToolsPage)
export const exportToolsDataToPDF = (userData, currentUser) => {
  const doc = new jsPDF();
  let yPosition = addHeader(doc, 'Dados das Ferramentas de Fitness');
  
  // Informações do usuário
  if (currentUser) {
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text('Informacoes do Usuario:', 20, yPosition);
    yPosition += 10;
    
    doc.setFontSize(11);
    doc.setTextColor(60, 60, 60);
    if (currentUser.displayName) {
      doc.text(`Nome: ${currentUser.displayName}`, 25, yPosition);
      yPosition += 8;
    }
    doc.text(`Email: ${currentUser.email}`, 25, yPosition);
    yPosition += 15;
  }
  
  // Dados de IMC
  if (userData.bmi) {
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text('Indice de Massa Corporal (IMC):', 20, yPosition);
    yPosition += 10;
    
    doc.setFontSize(11);
    doc.setTextColor(60, 60, 60);
    doc.text(`Altura: ${userData.height} cm`, 25, yPosition);
    yPosition += 8;
    doc.text(`Peso: ${userData.weight} kg`, 25, yPosition);
    yPosition += 8;
    doc.text(`IMC: ${userData.bmi}`, 25, yPosition);
    yPosition += 8;
    doc.text(`Categoria: ${userData.category}`, 25, yPosition);
    yPosition += 8;
    if (userData.lastBMIUpdate) {
      doc.text(`Ultima atualizacao: ${formatDate(userData.lastBMIUpdate)}`, 25, yPosition);
    }
    yPosition += 15;
  }
  
  // Dados de Gordura Corporal
  if (userData.bodyFat) {
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text('Gordura Corporal:', 20, yPosition);
    yPosition += 10;
    
    doc.setFontSize(11);
    doc.setTextColor(60, 60, 60);
    doc.text(`Percentual de Gordura: ${userData.bodyFat}%`, 25, yPosition);
    yPosition += 8;
    doc.text(`Categoria: ${userData.bodyFatCategory}`, 25, yPosition);
    yPosition += 8;
    doc.text(`Metodo: ${userData.bodyFatMethod}`, 25, yPosition);
    yPosition += 8;
    if (userData.leanMass) {
      doc.text(`Massa Magra: ${userData.leanMass} kg`, 25, yPosition);
      yPosition += 8;
    }
    if (userData.fatMass) {
      doc.text(`Massa Gorda: ${userData.fatMass} kg`, 25, yPosition);
      yPosition += 8;
    }
    if (userData.lastBodyFatUpdate) {
      doc.text(`Ultima atualizacao: ${formatDate(userData.lastBodyFatUpdate)}`, 25, yPosition);
    }
    yPosition += 15;
  }
  
  // Dados de Calorias
  if (userData.bmr || userData.tdee) {
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text('Dados Caloricos:', 20, yPosition);
    yPosition += 10;
    
    doc.setFontSize(11);
    doc.setTextColor(60, 60, 60);
    if (userData.bmr) {
      doc.text(`Taxa Metabolica Basal (TMB): ${userData.bmr} cal/dia`, 25, yPosition);
      yPosition += 8;
    }
    if (userData.tdee) {
      doc.text(`Gasto Energetico Total (GET): ${userData.tdee} cal/dia`, 25, yPosition);
      yPosition += 8;
    }
    if (userData.lastCalorieUpdate) {
      doc.text(`Ultima atualizacao: ${formatDate(userData.lastCalorieUpdate)}`, 25, yPosition);
    }
    yPosition += 15;
  }
  
  addFooter(doc);
  
  const fileName = `relatorio_fitness_${currentUser?.email || 'usuario'}_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
};

// Exportar dados do perfil (StatsPage/ProfilePage)
export const exportProfileDataToPDF = (userData, userStats, settings) => {
  const doc = new jsPDF();
  let yPosition = addHeader(doc, 'Relatorio Completo do Perfil');
  
  // Dados do Perfil
  if (userData && Object.keys(userData).length > 0) {
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text('Dados do Perfil:', 20, yPosition);
    yPosition += 10;
    
    doc.setFontSize(11);
    doc.setTextColor(60, 60, 60);
    
    Object.entries(userData).forEach(([key, value]) => {
      if (value && key !== 'userId' && key !== 'lastUpdated') {
        let displayKey = key;
        let displayValue = value;
        
        // Traduzir chaves para português
        const translations = {
          'name': 'Nome',
          'email': 'Email',
          'height': 'Altura',
          'weight': 'Peso',
          'age': 'Idade',
          'bmi': 'IMC',
          'category': 'Categoria IMC',
          'bodyFat': 'Gordura Corporal',
          'bodyFatCategory': 'Categoria Gordura',
          'bmr': 'TMB',
          'tdee': 'GET'
        };
        
        displayKey = translations[key] || key;
        
        // Formatar valores
        if (typeof value === 'string' && value.includes('T')) {
          displayValue = formatDate(value);
        }
        
        doc.text(`${displayKey}: ${displayValue}`, 25, yPosition);
        yPosition += 8;
        
        // Verificar se precisa de nova página
        if (yPosition > 250) {
          doc.addPage();
          yPosition = 30;
        }
      }
    });
    yPosition += 10;
  }
  
  // Estatísticas
  if (userStats && Object.keys(userStats).length > 0) {
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text('Estatisticas:', 20, yPosition);
    yPosition += 10;
    
    doc.setFontSize(11);
    doc.setTextColor(60, 60, 60);
    
    Object.entries(userStats).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        doc.text(`${key}: ${value}`, 25, yPosition);
        yPosition += 8;
        
        if (yPosition > 250) {
          doc.addPage();
          yPosition = 30;
        }
      }
    });
    yPosition += 10;
  }
  
  // Configurações (resumo)
  if (settings && Object.keys(settings).length > 0) {
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text('Configuracoes do Sistema:', 20, yPosition);
    yPosition += 10;
    
    doc.setFontSize(11);
    doc.setTextColor(60, 60, 60);
    doc.text('Suas preferencias pessoais estao configuradas', 25, yPosition);
    yPosition += 8;
  }
  
  addFooter(doc);
  
  const fileName = `relatorio_perfil_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
};

export default {
  exportToolsDataToPDF,
  exportProfileDataToPDF
}; 