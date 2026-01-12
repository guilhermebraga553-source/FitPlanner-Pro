
import { Exercise } from './types';

export const EXERCISE_LIBRARY: Exercise[] = [
  // PEITO
  { id: 'p1', name: 'Supino Reto com Barra', muscle: 'Peito', instructions: 'Deite no banco, segure a barra com pegada média e desça até o peito, empurrando de volta.' },
  { id: 'p2', name: 'Supino Reto com Halteres', muscle: 'Peito', instructions: 'Deitado, empurre os halteres para cima mantendo a estabilidade dos ombros.' },
  { id: 'p3', name: 'Supino Inclinado com Barra', muscle: 'Peito', instructions: 'Foco na porção superior. Desça a barra até a parte alta do peito.' },
  { id: 'p4', name: 'Supino Inclinado com Halteres', muscle: 'Peito', instructions: 'Foco na porção superior com maior amplitude de movimento.' },
  { id: 'p5', name: 'Supino Declinado com Barra', muscle: 'Peito', instructions: 'Foco na porção inferior do peitoral.' },
  { id: 'p6', name: 'Supino Declinado com Halteres', muscle: 'Peito', instructions: 'Foco na porção inferior com halteres.' },
  { id: 'p7', name: 'Chest Press (Máquina)', muscle: 'Peito', instructions: 'Empurre as manoplas à frente, mantendo as costas apoiadas.' },
  { id: 'p8', name: 'Paralelas (Ênfase em Peito)', muscle: 'Peito', instructions: 'Incline o tronco à frente para focar no peitoral inferior.' },
  { id: 'p9', name: 'Crucifixo Reto com Halteres', muscle: 'Peito', instructions: 'Abra os braços lateralmente com cotovelos levemente flexionados.' },
  { id: 'p10', name: 'Crucifixo Inclinado com Halteres', muscle: 'Peito', instructions: 'Abertura lateral focando na porção superior do peito.' },
  { id: 'p11', name: 'Crucifixo Declinado com Halteres', muscle: 'Peito', instructions: 'Abertura lateral focando na porção inferior.' },
  { id: 'p12', name: 'Crucifixo na Máquina (Peck Deck)', muscle: 'Peito', instructions: 'Junte os braços à frente mantendo a contração constante.' },
  { id: 'p13', name: 'Crucifixo Polia Alta (Foco Inferior)', muscle: 'Peito', instructions: 'Puxe de cima para baixo cruzando as mãos à frente do quadril.' },
  { id: 'p14', name: 'Crucifixo Polia Média (Geral)', muscle: 'Peito', instructions: 'Puxe do centro para a frente do peito.' },
  { id: 'p15', name: 'Crucifixo Polia Baixa (Foco Superior)', muscle: 'Peito', instructions: 'Puxe de baixo para cima cruzando à frente do rosto.' },
  { id: 'p16', name: 'Cross Over', muscle: 'Peito', instructions: 'Movimento de adução de braços com cabos.' },

  // COSTAS
  { id: 'c1', name: 'Barra Fixa (Pronada)', muscle: 'Costas', instructions: 'Puxe o corpo para cima até o queixo ultrapassar a barra.' },
  { id: 'c2', name: 'Puxada na Frente (Aberta)', muscle: 'Costas', instructions: 'Puxe a barra em direção ao peito focando na largura das costas.' },
  { id: 'c3', name: 'Puxada Atrás da Nuca', muscle: 'Costas', instructions: 'Puxe a barra por trás da cabeça (requer boa mobilidade).' },
  { id: 'c4', name: 'Remada Curvada com Barra', muscle: 'Costas', instructions: 'Tronco inclinado, puxe a barra em direção ao abdômen.' },
  { id: 'c5', name: 'Remada Cavalinho (T-Bar)', muscle: 'Costas', instructions: 'Puxe a barra entre as pernas com as mãos em pegada neutra.' },
  { id: 'c6', name: 'Remada Baixa na Polia', muscle: 'Costas', instructions: 'Sentado, puxe o triângulo em direção à cintura.' },
  { id: 'c7', name: 'Pulldown Unilateral', muscle: 'Costas', instructions: 'Foco no isolamento de cada lado da grande dorsal.' },
  { id: 'c11', name: 'Pulldown Tradicional na Polia', muscle: 'Costas', instructions: 'De pé frente à polia alta, braços estendidos, puxe a barra em direção às coxas mantendo os braços retos para isolar a grande dorsal.' },
  { id: 'c8', name: 'Pullover com Halteres', muscle: 'Costas', instructions: 'Deitado, leve o halter para trás da cabeça e puxe de volta.' },
  { id: 'c9', name: 'Levantamento Terra', muscle: 'Costas', instructions: 'Exercício composto que trabalha toda a cadeia posterior.' },
  { id: 'c10', name: 'Encolhimento para Trapézio', muscle: 'Costas', instructions: 'Eleve os ombros em direção às orelhas.' },

  // BÍCEPS
  { id: 'b1', name: 'Rosca Direta com Barra', muscle: 'Bíceps', instructions: 'Flexão de cotovelos com pegada supinada.' },
  { id: 'b2', name: 'Rosca Alternada com Halteres', muscle: 'Bíceps', instructions: 'Trabalho individual de cada braço com rotação de punho.' },
  { id: 'b3', name: 'Rosca Martelo', muscle: 'Bíceps', instructions: 'Pegada neutra para focar no braquial e braquiorradial.' },
  { id: 'b4', name: 'Rosca Scott (Máquina/Barra)', muscle: 'Bíceps', instructions: 'Apoie os braços no banco Scott para isolamento total.' },
  { id: 'b5', name: 'Rosca Concentrada', muscle: 'Bíceps', instructions: 'Sentado, apoie o cotovelo na coxa e flexione.' },
  { id: 'b6', name: 'Rosca 21', muscle: 'Bíceps', instructions: '7 reps curtas baixo, 7 curtas cima, 7 completas.' },

  // TRÍCEPS
  { id: 't1', name: 'Tríceps Testa com Barra', muscle: 'Tríceps', instructions: 'Deitado, leve a barra em direção à testa e estenda.' },
  { id: 't2', name: 'Tríceps Francês', muscle: 'Tríceps', instructions: 'Segure o peso atrás da cabeça e estenda verticalmente.' },
  { id: 't3', name: 'Tríceps Corda na Polia', muscle: 'Tríceps', instructions: 'Estenda os braços para baixo abrindo a corda no final.' },
  { id: 't4', name: 'Tríceps Coice', muscle: 'Tríceps', instructions: 'Tronco inclinado, estenda o braço para trás.' },
  { id: 't5', name: 'Mergulho no Banco', muscle: 'Tríceps', instructions: 'Apoie as mãos no banco atrás do corpo e desça o quadril.' },

  // QUADRÍCEPS
  { id: 'q1', name: 'Agachamento Livre', muscle: 'Quadríceps', instructions: 'Desça o quadril mantendo a coluna reta e joelhos alinhados.' },
  { id: 'q2', name: 'Leg Press 45', muscle: 'Quadríceps', instructions: 'Empurre a plataforma com os pés afastados na largura dos ombros.' },
  { id: 'q3', name: 'Cadeira Extensora', muscle: 'Quadríceps', instructions: 'Extensão total das pernas contra a resistência.' },
  { id: 'q4', name: 'Avanço (Passada)', muscle: 'Quadríceps', instructions: 'Dê um passo à frente e flexione o joelho até quase tocar o chão.' },
  { id: 'q5', name: 'Sissy Squat', muscle: 'Quadríceps', instructions: 'Agachamento com foco extremo no isolamento do quadríceps.' },

  // POSTERIOR DE COXA
  { id: 'pc1', name: 'Mesa Flexora', muscle: 'Posterior de Coxa', instructions: 'Deitado, flexione as pernas em direção aos glúteos.' },
  { id: 'pc2', name: 'Cadeira Flexora', muscle: 'Posterior de Coxa', instructions: 'Sentado, flexione as pernas para baixo.' },
  { id: 'pc3', name: 'Stiff com Barra', muscle: 'Posterior de Coxa', instructions: 'Desça a barra rente às pernas com joelhos semi-flexionados.' },
  { id: 'pc4', name: 'Levantamento Terra Romeno', muscle: 'Posterior de Coxa', instructions: 'Foco na extensão de quadril e alongamento dos isquiotibiais.' },

  // PANTURRILHA
  { id: 'pa1', name: 'Panturrilha em Pé', muscle: 'Panturrilha', instructions: 'Eleve os calcanhares o máximo possível.' },
  { id: 'pa2', name: 'Panturrilha Sentado', muscle: 'Panturrilha', instructions: 'Foco no músculo sóleo.' },
  { id: 'pa3', name: 'Panturrilha no Leg Press', muscle: 'Panturrilha', instructions: 'Use a plataforma do leg para flexão plantar.' },

  // ANTEBRAÇO
  { id: 'an1', name: 'Rosca Punho', muscle: 'Antebraço', instructions: 'Flexão dos punhos com a palma voltada para cima.' },
  { id: 'an2', name: 'Rosca Inversa', muscle: 'Antebraço', instructions: 'Rosca direta com pegada pronada.' },
  { id: 'an3', name: 'Farmer’s Walk', muscle: 'Antebraço', instructions: 'Caminhe segurando pesos pesados para força de preensão.' },

  // GLÚTEO MÁXIMO
  { id: 'gm1', name: 'Hip Thrust (Elevação Pélvica)', muscle: 'Glúteo', instructions: 'Apoie as costas no banco e eleve o quadril com peso.' },
  { id: 'gm2', name: 'Agachamento Sumô', muscle: 'Glúteo', instructions: 'Pés afastados e pontas para fora, foco em glúteo e adutores.' },
  { id: 'gm3', name: 'Coice na Polia', muscle: 'Glúteo', instructions: 'Chute para trás mantendo a perna estendida.' },
  { id: 'gm4', name: 'Afundo Búlgaro', muscle: 'Glúteo', instructions: 'Um pé elevado atrás no banco, desça com a outra perna.' },

  // GLÚTEO MÉDIO/MÍNIMO
  { id: 'gme1', name: 'Abdução de Quadril na Máquina', muscle: 'Glúteo', instructions: 'Afaste as pernas contra a resistência lateral.' },
  { id: 'gme2', name: 'Abdução de Quadril na Polia', muscle: 'Glúteo', instructions: 'Em pé, afaste a perna lateralmente.' },
  { id: 'gme3', name: 'Clamshell (Ostra)', muscle: 'Glúteo', instructions: 'Deitado de lado, abra os joelhos mantendo os pés juntos.' },
  { id: 'gme4', name: 'Monster Walk com Elástico', muscle: 'Glúteo', instructions: 'Caminhada lateral com resistência de mini-band.' },

  // CARDIO
  { id: 'cardio1', name: 'Corrida na Esteira', muscle: 'Cardio', instructions: 'Corrida em ritmo moderado a intenso para queima calórica.' },
  { id: 'cardio2', name: 'Bicicleta Ergométrica', muscle: 'Cardio', instructions: 'Ciclismo indoor focado em resistência cardiovascular.' },
  { id: 'cardio3', name: 'Corda (Pular Corda)', muscle: 'Cardio', instructions: 'Pular corda para queima rápida e coordenação.' },
  { id: 'cardio4', name: 'Elíptico', muscle: 'Cardio', instructions: 'Movimento de baixo impacto para queima de gordura e condicionamento.' },
];

export const MUSCLE_GROUPS = Array.from(new Set(EXERCISE_LIBRARY.map(e => e.muscle)));
