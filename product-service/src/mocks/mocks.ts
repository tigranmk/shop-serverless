import { v4 as uuidv4 } from 'uuid';

const firstProductId = uuidv4();
const secondProductId = uuidv4();
const thirdProductId = uuidv4();

export const raspberryPiModels = [
  {
    id: firstProductId,
    price: 35.99,
    title: "Raspberry Pi 4 Model B",
    description: "Raspberry Pi 4 Model B"
  },
  {
    id: secondProductId,
    price: 49.99,
    title: "Raspberry Pi 4 Model B (8GB RAM)",
    description: "Raspberry Pi 4 Model B (8GB RAM)"
  },
  {
    id: thirdProductId,
    price: 5.00,
    title: "Raspberry Pi Zero",
    description: "Raspberry Pi Zero"
  },
  {
    id: uuidv4(),
    price: 54.99,
    title: "Raspberry Pi 400",
    description: "Raspberry Pi 400"
  },
  {
    id: uuidv4(),
    price: 9.99,
    title: "Raspberry Pi Zero W",
    description: "Raspberry Pi Zero W"
  }
];


export const raspberryPiModelsStocks = [
  {
    product_id: firstProductId,
    count: 4,
  },
  {
    product_id: secondProductId,
    count: 1,
  },
  {
    product_id: thirdProductId,
    count: 100,
  }
]