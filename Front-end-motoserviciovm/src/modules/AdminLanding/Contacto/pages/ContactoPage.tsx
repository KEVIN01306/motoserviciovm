import React, { useEffect, useState } from 'react';
import { Button, Box, TextField, Typography, CircularProgress, Alert } from '@mui/material';
import { Save, Plus } from 'lucide-react';
import * as contactoSvc from '../../../../services/contacto.services';
import type { ContactoType } from '../../../../types/contactoType';
import  { emptyContacto } from '../../../../types/contactoType';
import LoadingMoto from '../../../../components/utils/LoadginMoto';
import { successToast } from '../../../../utils/toast';


const ContactoPage: React.FC = () => {
  const [contacto, setContacto] = useState<ContactoType | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<ContactoType>(emptyContacto);

  useEffect(() => {
    fetchContacto();
  }, []);

  const fetchContacto = async () => {
    setLoading(true);
    try {
      const res = await contactoSvc.getContactos();
      setContacto(res.length !== 0 ? res[0] : null);
      setFormData(res.length !== 0 ? res[0] : emptyContacto);
    } catch (error) {
      console.error('Error fetching contacto:', error);
      setContacto(null);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof ContactoType, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value || undefined,
    }));
  };

  const handleSave = async () => {
    if (!formData.email || !formData.telefono || !formData.direccion) {
      alert('Email, teléfono y dirección son requeridos');
      return;
    }

    setSaving(true);
    try {
      if (contacto?.id) {
        await contactoSvc.putContacto(contacto.id, formData);
        successToast('Contacto actualizado con éxito');
      } else {
        const result = await contactoSvc.postContacto(formData);
        setContacto(result);
        successToast('Contacto creado con éxito');
      }
      await fetchContacto();
    } catch (error) {
      console.error('Error saving contacto:', error);
      alert('Error al guardar el contacto');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingMoto />;

  return (
    <Box sx={{ p: 2, width: '100%', mx: 'auto' }}>
      <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>
        Información de Contacto
      </Typography>

      {!contacto?.id && (
        <Alert severity="info" sx={{ mb: 3 }}>
          No hay un contacto registrado. Crea uno nuevo para habilitar esta sección en el sitio.
        </Alert>
      )}

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          label="Email *"
          type="email"
          variant='standard'
          value={formData.email || ''}
          onChange={(e) => handleChange('email', e.target.value)}
          fullWidth
          disabled={saving}
        />

        <TextField
          label="Teléfono *"
          value={formData.telefono || ''}
          variant='standard'
          onChange={(e) => handleChange('telefono', e.target.value)}
          fullWidth
          disabled={saving}
        />

        <TextField
          label="Dirección *"
          value={formData.direccion || ''}
          variant='standard'
          onChange={(e) => handleChange('direccion', e.target.value)}
          fullWidth
          multiline
          rows={2}
          disabled={saving}
        />

        <TextField
          label="Teléfono WhatsApp"
          variant='standard'
          value={formData.telefonoWhatsapp || ''}
          onChange={(e) => handleChange('telefonoWhatsapp', e.target.value)}
          fullWidth
          disabled={saving}
        />

        <TextField
          label="Texto WhatsApp"
          variant='standard'
          value={formData.textoWhatsapp || ''}
          onChange={(e) => handleChange('textoWhatsapp', e.target.value)}
          fullWidth
          multiline
          rows={4}
          disabled={saving}
        />

        <Button
          variant="contained"
          startIcon={saving ? <CircularProgress size={20} /> : contacto?.id ? <Save size={20} /> : <Plus size={20} />}
          onClick={handleSave}
          disabled={saving}
          sx={{ mt: 2 }}
        >
          {saving ? 'Guardando...' : contacto?.id ? 'Actualizar' : 'Crear Contacto'}
        </Button>
      </Box>
    </Box>
  );
};

export default ContactoPage;
