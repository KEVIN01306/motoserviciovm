import { Box, Button, Fab } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";

type Props = {
  isEditing: boolean
  initializeEditMode: () => void
  handleCancel: () => void
  handleSave: () => void
  isSaving: boolean
}

const EditControls = ({ isEditing, initializeEditMode, handleCancel, handleSave, isSaving }: Props) => {
  return (
    <>
      {!isEditing && (
        <Fab
          color="secondary"
          aria-label="edit"
          onClick={initializeEditMode}
          sx={{ position: 'fixed', bottom: 16, right: 16 }}
        >
          <EditIcon />
        </Fab>
      )}

      {isEditing && (
        <Box sx={{ display: 'flex', gap: 2, mt: 3, justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            color="error"
            startIcon={<CancelIcon />}
            onClick={handleCancel}
            disabled={isSaving}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            color="success"
            startIcon={<SaveIcon />}
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? "Guardando..." : "Guardar"}
          </Button>
        </Box>
      )}
    </>
  )
}

export default EditControls
