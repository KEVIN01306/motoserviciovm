import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Checkbox, Typography } from "@mui/material";
import type { PermisoType } from "../../../types/permisoType";
import type { RolGetType } from "../../../types/rolType";

type Props = {
  groupedModules: Array<[string, PermisoType[]]>
  roles: RolGetType[]
  rolePermSets: Map<string, Set<number>>
  isEditing: boolean
  onCheckboxChange: (roleId: string, permisoId: number, checked: boolean) => void
}

const PermissionsTable = ({ groupedModules, roles, rolePermSets, isEditing, onCheckboxChange }: Props) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ width: 200 }}>Módulo</TableCell>
            <TableCell>Permiso</TableCell>
            {roles.map((role) => (
              <TableCell key={role.id} align="center">{role.rol}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {groupedModules.map(([modulo, perms]) => (
            perms.map((perm, idx) => (
              <TableRow key={String(perm.id)}>
                {idx === 0 && (
                  <TableCell rowSpan={perms.length} sx={{ verticalAlign: 'top' }}>
                    <Typography fontWeight={700}>{modulo}</Typography>
                  </TableCell>
                )}
                <TableCell>
                  <Typography>{perm.permiso}</Typography>
                  <Typography variant="caption" color="text.secondary">ID: {perm.id}</Typography>
                </TableCell>
                {roles.map((role, rIdx) => (
                  <TableCell key={rIdx} align="center">
                    <Checkbox
                      checked={rolePermSets.get(String(role.id))?.has(Number(perm.id)) || false}
                      disabled={!isEditing}
                      onChange={(e) => {
                        if (isEditing) onCheckboxChange(String(role.id), Number(perm.id), e.target.checked)
                      }}
                    />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default PermissionsTable
