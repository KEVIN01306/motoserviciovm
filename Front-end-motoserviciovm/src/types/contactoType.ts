export interface ContactoType {
  id?: number;
  email: string;
  direccion: string;
  telefono: string;
  textoWhatsapp?: string | null;
  telefonoWhatsapp?: string | null;
}

export const emptyContacto: ContactoType = {
  email: '',
  direccion: '',
  telefono: '',
  textoWhatsapp: null,
  telefonoWhatsapp: null,
};