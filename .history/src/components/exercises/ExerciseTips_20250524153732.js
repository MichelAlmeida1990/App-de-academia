// src/components/exercises/ExerciseTips.js

import React from 'react';
import { 
  FaLightbulb, 
  FaExclamationTriangle, 
  FaCheck, 
  FaInfoCircle 
} from 'react-icons/fa';

const TipItem = ({ icon, title, children, type = "info" }) => {
  const getIconColor = () => {
    switch(type) {
      case "warning": return "orange.500";
      case "success": return "green.500";
      case "error": return "red.500";
      case "info":
      default: return "blue.500";
    }
  };

  return (
    <div mb={4} style={{display: "flex"}}
      <div mr={3} mt={1}>
        <Icon as={icon} color={getIconColor()} boxSize={5} />
      </div>
      <div>
        <span fontWeight="bold" mb={1}>{title}</span>
        {children}
      </div>
    </div>
  );
};

const ExerciseTips = ({ 
  commonMistakes = [], 
  formTips = [], 
  safetyTips = [], 
  variations = [] 
}) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const headingColor = useColorModeValue('gray.700', 'white');
  const accordionBg = useColorModeValue('gray.50', 'gray.700');

  return (
    <div 
      bg={bgColor}
      borderRadius="lg"
      boxShadow="md"
      border="1px"
      borderColor={borderColor}
      mb={6}
      overflow="hidden"
    >
      <div p={5}>
        <h2 as="h3" size="md" mb={4} color={headingColor}>
          Dicas e Informações Adicionais
        </h2>

        <Accordion allowMultiple defaultIndex={[0]} mb={4}>
          {formTips.length > 0 && (
            <AccordionItem border="1px" borderColor={borderColor} borderRadius="md" mb={3} bg={accordionBg}>
              <h2>
                <AccordionButton py={3}>
                  <div flex="1" textAlign="left" fontWeight="medium">
                    <div alignItems="center" style={{display: "flex"}}
                      <Icon as={FaCheck} mr={2} color="green.500" />
                      Dicas de Forma Correta
                    </div>
                  </div>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4}>
                <UnorderedList spacing={2}>
                  {formTips.map((tip, index) => (
                    <ulItem key={index}>{tip}</li>
                  ))}
                </UnorderedList>
              </AccordionPanel>
            </AccordionItem>
          )}

          {commonMistakes.length > 0 && (
            <AccordionItem border="1px" borderColor={borderColor} borderRadius="md" mb={3} bg={accordionBg}>
              <h2>
                <AccordionButton py={3}>
                  <div flex="1" textAlign="left" fontWeight="medium">
                    <div alignItems="center" style={{display: "flex"}}
                      <Icon as={FaExclamationTriangle} mr={2} color="orange.500" />
                      Erros Comuns a Evitar
                    </div>
                  </div>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4}>
                <UnorderedList spacing={2}>
                  {commonMistakes.map((mistake, index) => (
                    <ulItem key={index}>{mistake}</li>
                  ))}
                </UnorderedList>
              </AccordionPanel>
            </AccordionItem>
          )}

          {safetyTips.length > 0 && (
            <AccordionItem border="1px" borderColor={borderColor} borderRadius="md" mb={3} bg={accordionBg}>
              <h2>
                <AccordionButton py={3}>
                  <div flex="1" textAlign="left" fontWeight="medium">
                    <div alignItems="center" style={{display: "flex"}}
                      <Icon as={FaInfoCircle} mr={2} color="blue.500" />
                      Dicas de Segurança
                    </div>
                  </div>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4}>
                <Alert status="info" borderRadius="md">
                  <AlertIcon />
                  Sempre consulte um profissional antes de iniciar um novo programa de exercícios.
                </Alert>
                <UnorderedList spacing={2} mt={3}>
                  {safetyTips.map((tip, index) => (
                    <ulItem key={index}>{tip}</li>
                  ))}
                </UnorderedList>
              </AccordionPanel>
            </AccordionItem>
          )}

          {variations.length > 0 && (
            <AccordionItem border="1px" borderColor={borderColor} borderRadius="md" mb={3} bg={accordionBg}>
              <h2>
                <AccordionButton py={3}>
                  <div flex="1" textAlign="left" fontWeight="medium">
                    <div alignItems="center" style={{display: "flex"}}
                      <Icon as={FaLightbulb} mr={2} color="yellow.500" />
                      Variações do Exercício
                    </div>
                  </div>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4}>
                <UnorderedList spacing={2}>
                  {variations.map((variation, index) => (
                    <ulItem key={index}>{variation}</li>
                  ))}
                </UnorderedList>
              </AccordionPanel>
            </AccordionItem>
          )}
        </Accordion>
      </div>
    </div>
  );
};

export default ExerciseTips;




