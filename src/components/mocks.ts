import { COLORS } from "@/components/constants";
import type { IEvent, IUser } from "@/components/interfaces";
import { SERVICES } from "@/components/types/services";

export const USERS_MOCK: IUser[] = [
  {
    id: "f3b035ac-49f7-4e92-a715-35680bf63175",
    name: "Michael Doe",
    picturePath: null,
  },
  {
    id: "3e36ea6e-78f3-40dd-ab8c-a6c737c3c422",
    name: "Alice Johnson",
    picturePath: null,
  },
  {
    id: "a7aff6bd-a50a-4d6a-ab57-76f76bb27cf5",
    name: "Robert Smith",
    picturePath: null,
  },
  {
    id: "dd503cf9-6c38-43cf-94cc-0d4032e2f77a",
    name: "Emily Davis",
    picturePath: null,
  },
  {
    id: "e1a2b3c4-d5f6-7890-abcd-1234567890ef",
    name: "Sophia Brown",
    picturePath: null,
  },
  {
    id: "f7g8h9i0-j1k2-3456-lmno-789012345678",
    name: "James Wilson",
    picturePath: null,
  },
  {
    id: "g9h0i1j2-k3l4-5678-mnop-901234567890",
    name: "Olivia Martinez",
    picturePath: null,
  },
];

// ================================== //

const mockGenerator = (numberOfEvents: number): IEvent[] => {
  const result: IEvent[] = [];
  let currentId = 1;

  const randomNurse = require("@/components/types/services").NURSES[
    Math.floor(
      Math.random() * require("@/components/types/services").NURSES.length
    )
  ];

  // Date range: 30 days before and after now
  const now = new Date();
  const startRange = new Date(now);
  startRange.setDate(now.getDate() - 30);
  const endRange = new Date(now);
  endRange.setDate(now.getDate() + 30);

  // Create an event happening now
  const defaultStartDate = new Date(now);
  defaultStartDate.setHours(9, 0, 0, 0); // Set to 9 AM

  const randomService = SERVICES[Math.floor(Math.random() * SERVICES.length)];
  const currentEvent = {
    id: currentId++,
    startDate: defaultStartDate.toISOString(),
    endDate: new Date(
      defaultStartDate.getTime() + randomService.duration * 60000
    ).toISOString(),
    title: randomService.name,
    service: randomService.name,
    color: COLORS[Math.floor(Math.random() * COLORS.length)].value,
    observation:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    nurse: randomNurse.name,
    user: randomNurse,
  };

  result.push(currentEvent);

  // Generate the remaining events
  for (let i = 0; i < numberOfEvents - 1; i++) {
    // Determine if this is a multi-day event (10% chance)
    const isMultiDay = Math.random() < 0.1;

    const startDate = new Date(
      startRange.getTime() +
        Math.random() * (endRange.getTime() - startRange.getTime())
    );

    // Set time between 8 AM and 8 PM
    startDate.setHours(
      8 + Math.floor(Math.random() * 12),
      Math.floor(Math.random() * 60),
      0,
      0
    );

    const endDate = new Date(startDate);
    const randomService = SERVICES[Math.floor(Math.random() * SERVICES.length)];

    if (isMultiDay) {
      // Multi-day event: Add 1-4 days
      const additionalDays = Math.floor(Math.random() * 4) + 1;
      endDate.setDate(startDate.getDate() + additionalDays);
      endDate.setHours(
        8 + Math.floor(Math.random() * 12),
        Math.floor(Math.random() * 60),
        0,
        0
      );
    } else {
      // Same-day event: Use service duration
      endDate.setMinutes(endDate.getMinutes() + randomService.duration);
    }

    result.push({
      id: currentId++,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      title: randomService.name,
      service: randomService.name,
      color: COLORS[Math.floor(Math.random() * COLORS.length)].value,
      observation:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      nurse: randomNurse.name,
      user: randomNurse,
    });
  }

  return result;
};

export const CALENDAR_ITEMS_MOCK: IEvent[] = mockGenerator(80);
