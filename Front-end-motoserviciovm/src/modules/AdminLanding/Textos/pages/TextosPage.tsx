import React, { useEffect, useState } from 'react';
import { Button, Box, TextField, Typography, CircularProgress, Alert } from '@mui/material';
import { Save, Plus } from 'lucide-react';
import * as textoSvc from '../../../../services/texto.services';
import type { TextoType } from '../../../../types/textoType';
import LoadingMoto from '../../../../components/utils/LoadginMoto';
import { successToast } from '../../../../utils/toast';

const TextosPage: React.FC = () => {
  const [texto, setTexto] = useState<TextoType | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<TextoType>({});

  useEffect(() => {
    fetchTextos();
  }, []);

  const fetchTextos = async () => {
    setLoading(true);
    try {
      const res = await textoSvc.getTextos();
      const textoRecord = res.length > 0 ? res[0] : null;
      setTexto(textoRecord);
      setFormData(textoRecord || {});
    } catch (error) {
      console.error('Error fetching textos:', error);
      setTexto(null);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof TextoType, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value || undefined,
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (texto?.id) {
        await textoSvc.putTexto(texto.id, formData);
        successToast('Textos actualizados con éxito');
      } else {
        const result = await textoSvc.postTexto(formData);
        setTexto(result);
        successToast('Textos creados con éxito');
      }
      await fetchTextos();
    } catch (error) {
      console.error('Error saving textos:', error);
      alert('Error al guardar los textos');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingMoto />;

  return (
    <Box sx={{ p: 2, maxWidth: 1000, mx: 'auto' }}>
      <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>
        Gestionar Textos del Sitio
      </Typography>

      {!texto?.id && (
        <Alert severity="info" sx={{ mb: 3 }}>
          No hay textos registrados. Crea uno nuevo para personalizar el contenido del sitio.
        </Alert>
      )}

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          variant='standard'
          label="Título del Logo"
          value={formData.logoTitle || ''}
          onChange={(e) => handleChange('logoTitle', e.target.value)}
          fullWidth
          disabled={saving}
          multiline
          rows={2}
        />

        <TextField
          variant='standard'
          label="Texto Footer"
          value={formData.footerText || ''}
          onChange={(e) => handleChange('footerText', e.target.value)}
          fullWidth
          disabled={saving}
          multiline
          rows={3}
        />

        <TextField
            variant='standard'
          label="Texto Servicios"
          value={formData.textoServicio || ''}
          onChange={(e) => handleChange('textoServicio', e.target.value)}
          fullWidth
          disabled={saving}
          multiline
          rows={3}
        />

        <TextField
            variant='standard'
          label="Texto About"
          value={formData.textoAbout || ''}
          onChange={(e) => handleChange('textoAbout', e.target.value)}
          fullWidth
          disabled={saving}
          multiline
          rows={4}
        />

        <TextField
            variant='standard'
          label="Texto IA (Diagnóstico)"
          value={formData.textoIA || ''}
          onChange={(e) => handleChange('textoIA', e.target.value)}
          fullWidth
          disabled={saving}
          multiline
          rows={3}
        />

        <TextField
            variant='standard'
          label="Texto Cita"
          value={formData.textoCita || ''}
          onChange={(e) => handleChange('textoCita', e.target.value)}
          fullWidth
          disabled={saving}
          multiline
          rows={3}
        />

        <Button
          variant="contained"
          startIcon={saving ? <CircularProgress size={20} /> : texto?.id ? <Save size={20} /> : <Plus size={20} />}
          onClick={handleSave}
          disabled={saving}
          sx={{ mt: 2 }}
        >
          {saving ? 'Guardando...' : texto?.id ? 'Actualizar' : 'Crear Textos'}
        </Button>
      </Box>
    </Box>
  );
};

export default TextosPage;
