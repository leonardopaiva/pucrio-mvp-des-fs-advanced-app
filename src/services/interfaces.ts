
export type Appointment = {
  id: string;
  name: string;
  doctor: string;
  doctor_name: string;
  location: string;
  location_name: string;
  date: string | Date;
  observation: string;
  img: string;
  tag: string;
  description: string;
  user_id: string;
};

export type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
};