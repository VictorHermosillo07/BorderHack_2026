// Datos de prueba para modo demo

import { FoulAnalysisResult } from '../types';

export const MOCK_VERDICTS: FoulAnalysisResult[] = [
  {
    verdict: 'FOUL',
    explanation: 'Contacto claro de mano contra el balón. El defensor extiende el brazo de forma antinatural en el área de penalti. Penalti según Law 12.1.',
    confidence: 0.95,
    details: {
      contact_severity: 'high',
      player_position: 'Área de penalti, defensor',
      ball_position: 'En trayecto hacia gol',
    },
  },
  {
    verdict: 'YELLOW_CARD',
    explanation: 'Falta táctica clara. El jugador efectúa una entrada de tackling fuera del juego sin intentar ganar el balón. Conducta antideportiva según Law 12.3.',
    confidence: 0.88,
    details: {
      contact_severity: 'medium',
      player_position: 'Mediocampo',
      ball_position: 'A 3 metros del jugador',
    },
  },
  {
    verdict: 'RED_CARD',
    explanation: 'Contacto violento directo a la cabeza del rival. Jugador efectúa una patada clara sin intención de jugar el balón. Expulsión por conducta violenta según Law 12.2.',
    confidence: 0.92,
    details: {
      contact_severity: 'high',
      player_position: 'Lado derecho del campo',
      ball_position: 'A 2 metros, en posesión del rival',
    },
  },
  {
    verdict: 'PLAY_ON',
    explanation: 'Contacto mínimo entre jugadores durante disputa normal del balón. No hay impedimento claro. El juego debe continuar según las Reglas de Juego.',
    confidence: 0.91,
    details: {
      contact_severity: 'low',
      player_position: 'Centro del campo',
      ball_position: 'En disputa entre dos jugadores',
    },
  },
];

export const getRandomMockVerdict = (): FoulAnalysisResult => {
  return MOCK_VERDICTS[Math.floor(Math.random() * MOCK_VERDICTS.length)];
};
