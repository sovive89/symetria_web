export const SPECIALTIES = [
  "Biomedicina Estética",
  "Odontologia Estética",
  "Estética Avançada",
  "Micropigmentação",
  "Tricologia",
  "Clínica",
] as const;

export const INTEREST_AREAS = [
  "Pele",
  "Rosto",
  "Cabelo",
  "Tricologia",
  "Sobrancelha",
  "Micropigmentação",
  "Procedimentos corporais",
] as const;

export const WEEKDAYS = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"] as const;

export const TIME_SLOTS = [
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
] as const;

export const CONSENT_LABELS: Record<string, string> = {
  full: "Acesso completo",
  partial: "Acesso parcial",
  revoked: "Acesso revogado",
};

export const STATUS_LABELS: Record<string, string> = {
  pending: "Aguardando confirmação",
  confirmed: "Confirmado",
  completed: "Concluído",
  cancelled: "Cancelado",
};

export const AI_DISCLAIMER =
  "Esta ferramenta auxilia na organização das informações e não substitui avaliação profissional.";
