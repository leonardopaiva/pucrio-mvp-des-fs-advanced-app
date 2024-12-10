
export type Appointment = {
    id: string;
    name: string;
    doctor: string;
    location: string;
    date: string | Date;
    observation: string;
    img: string;
    tag: string;
    description: string;
  };

  export type Product = {
    id: string;
    name: string;
    category: string;
    price: number;
    description: string;
  };