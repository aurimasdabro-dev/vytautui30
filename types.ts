
export interface Message {
  role: 'user' | 'assistant';
  content: string;
  transferToHuman?: boolean;
}

export interface PlumberInfo {
  name: string;
  phone: string;
  email: string;
  experience: string;
  specialization: string;
  region: string;
}

export const PLUMBER_DATA: PlumberInfo = {
  name: "Vytautas Bartušis",
  phone: "+370 678 05425",
  email: "info@vytautui.aurimoweb.store",
  experience: "15+ metų",
  specialization: "Nauja statyba, vandentiekis, šildymas",
  region: "Vilnius (+50km)"
};
