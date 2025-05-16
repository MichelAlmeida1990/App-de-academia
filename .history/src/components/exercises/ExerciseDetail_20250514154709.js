// src/pages/ExerciseDetail.js

import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Box, 
  Container, 
  SimpleGrid, 
  Divider,
  Skeleton,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Button,
  useToast,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton
} from '@chakra-ui/react';

// Contexto
import { ExerciseContext } from '../../context/ExerciseContext';

// Componentes
import ExerciseHeader from '../../components/exercises/ExerciseHeader';
import ExerciseVideo from '../../components/exercises/ExerciseVideo';
import ExerciseInstructions from '../../components/exercises/ExerciseInstructions';
import MuscleHighlight from '../../components/exercises/MuscleHighlight';
import ExerciseTips from '../../components/exercises/ExerciseTips';
import SimilarExercises from '../../components/exercises/SimilarExercises';

const ExerciseDetail = () => {
  const { id } = useParams();
  const { exercises, savedExercises, toggleSavedExercise } = useContext(ExerciseContext);
  const [exercise, setExercise] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [similarTargetExercises, setSimilarTargetExercises] = useState([]);
  const [similarEquipmentExercises, setSimilarEquipmentExercises] = useState([]);
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    const fetchExerciseDetails = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Simulando um atraso de carregamento para demonstrar os estados de loading
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Encontrar o exercício pelo ID
        const foundExercise = exercises.find(ex => ex.id === id);
        
        if (!foundExercise) {
          throw new Error('Exercício não encontrado');
        }
        
        setExercise(foundExercise);
        
        // Encontrar exercícios similares
        const targetMuscleExercises = exercises
          .filter(ex => ex.target === foundExercise.target && ex.id !== id)
          .slice(0, 4);
          
        const equipmentExercises = exercises
          .filter(ex => ex.equipment === foundExercise.equipment && ex.id !== id)
          .slice(0, 4);
          
        setSimilarTargetExercises(targetMuscleExercises);
        setSimilarEquipmentExercises(equipmentExercises);
        
      } catch (err) {
        setError(err.message);
        console.error('Erro ao carregar detalhes do exercício:', err);
      } finally {
        setIsLoading(true);
        // Simulando carregamento completo após 1 segundo
        setTimeout(() => setIsLoading(false), 1000);
      }
    };
    
    fetchExerciseDetails();
  }, [id, exercises]);
  
  const handleSaveExercise = () => {
    if (exercise) {
      toggleSavedExercise(exercise.id);
      
      toast({
        title: savedExercises.includes(exercise.id) 
          ? 'Exercício removido dos favoritos' 
          : 'Exercício salvo nos favoritos',
        status: savedExercises.includes(exercise.id) ? 'info' : 'success',
        duration: 3000,
        isClosable: true,
        position: 'top',
      });
    }
  };
  
  const handleShareExercise = () => {
    onOpen();
    
    // Implementação real compartilharia via API Web Share se disponível
    if (navigator.share) {
      navigator.share({
        title: `Exercício: ${exercise.name}`,
        text: `Confira este exercício: ${exercise.name}`,
        url: window.location.href,
      })
      .then(() => console.log('Compartilhado com sucesso'))
      .catch((error) => console.log('Erro ao compartilhar', error));
    }
  };
  
  if (error) {
    return (
      <Container maxW="container.xl" py={8}>
        <Alert 
          status="error" 
          variant="subtle" 
          flexDirection="column" 
          alignItems="center" 
          justifyContent="center" 
          textAlign="center" 
          height="200px" 
          borderRadius="lg"
        >
          <AlertIcon boxSize="40px" mr={0} />
          <AlertTitle mt={4} mb={1} fontSize="lg">
            Erro ao carregar exercício
          </AlertTitle>
          <AlertDescription maxWidth="sm">
            {error}
          </AlertDescription>
          <Button colorScheme="red" mt={4} onClick={() => window.history.back()}>
            Voltar
          </Button>
        </Alert>
      </Container>
    );
  }
  
  return (
    <Container maxW="container.xl" py={8}>
      {isLoading ? (
        // Esqueleto de carregamento
        <Box>
          <Skeleton height="150px" mb={6} borderRadius="lg" />
          <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6} mb={8}>
            <Skeleton height="400px" borderRadius="lg" />
            <Skeleton height="400px" borderRadius="lg" />
          </SimpleGrid>
          <Skeleton height="200px" mb={6} borderRadius="lg" />
          <Skeleton height="300px" borderRadius="lg" />
        </Box>
      ) : (
        exercise && (
          <>
            <ExerciseHeader 
              name={exercise.name}
              bodyPart={exercise.bodyPart}
              equipment={exercise.equipment}
              target={exercise.target}
              onSave={handleSaveExercise}
              isSaved={savedExercises.includes(exercise.id)}
              onShare={handleShareExercise}
            />
            
            <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6} mb={8}>
              <ExerciseVideo 
                name={exercise.name}
                gifUrl={exercise.gifUrl}
                youtubeUrl={exercise.youtubeUrl}
              />
              
              <Box>
                <ExerciseInstructions 
                  instructions={exercise.instructions}
                  tips={exercise.tips}
                  level={exercise.level}
                />
                
                <MuscleHighlight 
                  targetMuscle={exercise.target}
                  secondaryMuscles={exercise.secondaryMuscles || []}
                />
              </Box>
            </SimpleGrid>
            
            <ExerciseTips 
              commonMistakes={exercise.commonMistakes || []}
              formTips={exercise.formTips || []}
              safetyTips={exercise.safetyTips || []}
              variations={exercise.variations || []}
            />
            
            <Divider my={8} />
            
            <SimilarExercises 
              targetMuscleExercises={similarTargetExercises}
              equipmentExercises={similarEquipmentExercises}
            />
            
            {/* Modal de compartilhamento */}
            <Modal isOpen={isOpen} onClose={onClose}>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>Compartilhar Exercício</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  Compartilhe este exercício com seus amigos:
                  <Box as="code" display="block" p={3} bg="gray.100" borderRadius="md" mt={3} fontSize="sm">
                    {window.location.href}
                  </Box>
                </ModalBody>
                <ModalFooter>
                  <Button colorScheme="blue" mr={3} onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    toast({
                      title: "Link copiado!",
                      status: "success",
                      duration: 2000,
                    });
                    onClose();
                  }}>
                    Copiar Link
                  </Button>
                  <Button variant="ghost" onClick={onClose}>Fechar</Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
          </>
        )
      )}
    </Container>
  );
};

export default ExerciseDetail;
