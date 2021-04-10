const week = [
  [
    {
      startHour: 6,
      startMinutes: 0,
      endHour: 9,
      endMinutes: 0,
      duration: 180,
      totals: 119,
      travelDuration: 18,
    },
    {
      startHour: 6,
      startMinutes: 0,
      endHour: 9,
      endMinutes: 0,
      duration: 180,
      totals: 117,
      travelDuration: 6,
    },
  ],
  [
    {
      startHour: 11,
      startMinutes: 30,
      endHour: 13,
      endMinutes: 0,
      duration: 90,
      totals: 105,
      travelDuration: 18,
    },
    {
      startHour: 11,
      startMinutes: 30,
      endHour: 13,
      endMinutes: 0,
      duration: 90,
      totals: 98,
      travelDuration: 6,
    },
  ],
  [
    {
      startHour: 17,
      startMinutes: 0,
      endHour: 21,
      endMinutes: 15,
      duration: 255,
      totals: 120,
      travelDuration: 18,
    },
    {
      startHour: 17,
      startMinutes: 0,
      endHour: 21,
      endMinutes: 15,
      duration: 255,
      totals: 76,
      travelDuration: 6,
    },
  ],
];

const weekend = [
  [
    {
      startHour: 13,
      startMinutes: 0,
      endHour: 15,
      endMinutes: 0,
      duration: 120,
      totals: 107,
      travelDuration: 8,
    },
    {
      startHour: 13,
      startMinutes: 0,
      endHour: 15,
      endMinutes: 0,
      duration: 120,
      totals: 105,
      travelDuration: 1,
    },
  ],
  [
    {
      startHour: 7,
      startMinutes: 0,
      endHour: 9,
      endMinutes: 30,
      duration: 150,
      totals: 107,
      travelDuration: 8,
    },
    {
      startHour: 7,
      startMinutes: 0,
      endHour: 9,
      endMinutes: 30,
      duration: 150,
      totals: 105,
      travelDuration: 1,
    },
  ],
  [
    {
      startHour: 18,
      startMinutes: 0,
      endHour: 20,
      endMinutes: 0,
      duration: 120,
      totals: 80,
      travelDuration: 8,
    },
    {
      startHour: 18,
      startMinutes: 0,
      endHour: 20,
      endMinutes: 0,
      duration: 150,
      totals: 54,
      travelDuration: 1,
    },
  ],
  [
    {
      startHour: 16,
      startMinutes: 30,
      endHour: 22,
      endMinutes: 0,
      duration: 330,
      totals: 80,
      travelDuration: 8,
    },
    {
      startHour: 16,
      startMinutes: 30,
      endHour: 22,
      endMinutes: 0,
      duration: 330,
      totals: 54,
      travelDuration: 1,
    },
  ],
];

const razones = [
  "Mantenimiento Áreas Verdes",
  "Mantenimiento Sistemas Eléctricos",
  "Reparaciones menores en vía",
  "Colisiones Varias",
  "Cierres Preventivos",
  "Manifestaciones Generales (Colectividad y sectores Particulares).",
];

const probInterrupcion = [
  350 / 525600, // 0.00086
  197 / 525600, // 0.00068
];

const densidadMax = 125;
