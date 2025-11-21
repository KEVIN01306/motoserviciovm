import { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import Loading from "../../../components/utils/Loading";
import ErrorCard from "../../../components/utils/ErrorCard";
import { getPermisos } from "../../../services/permiso.services";
import { getRoles, putRol } from "../../../services/rol.services";
import type { PermisoType } from "../../../types/permisoType";
import type { RolGetType, RolType } from "../../../types/rolType";
import { errorToast, successToast } from "../../../utils/toast";
import PermissionsTable from "../components/PermissionsTable";
import EditControls from "../components/EditControls";
import { useAuthStore } from "../../../store/useAuthStore";
import { estados } from "../../../utils/estados";

const groupByModulo = (permisos: PermisoType[]) => {
    const map = new Map<string, PermisoType[]>();
    permisos.forEach(p => {
        const mod = p.modulo ?? "OTROS";
        if (!map.has(mod)) map.set(mod, []);
        map.get(mod)!.push(p);
    });
    return Array.from(map.entries());
}

const PermisoList = () => {
    const [permisos, setPermisos] = useState<PermisoType[]>([])
    const [roles, setRoles] = useState<RolGetType[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [isEditing, setIsEditing] = useState(false)
    const [editRolePerms, setEditRolePerms] = useState<Map<string, Set<number>>>(new Map())
    const [isSaving, setIsSaving] = useState(false)
    const userlogged = useAuthStore(state => state.user)

    useEffect(() => {
        const fetchAll = async () => {
            try {
                setLoading(true)
                const [perms, rls] = await Promise.all([getPermisos(), getRoles()])
                setPermisos(perms)
                setRoles(rls)
            } catch (err: any) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        fetchAll()
    }, [])

    const initializeEditMode = () => {
        const map = new Map<string, Set<number>>()
        roles.forEach(role => {
            const ids = (role.permisos || []).map((p: any) => Number((p as any).id))
            map.set(String(role.id), new Set(ids.filter(id => !Number.isNaN(id))))
        })
        setEditRolePerms(map)
        setIsEditing(true)
    }

    const handleCheckboxChange = (roleId: string, permisoId: number, checked: boolean) => {
        setEditRolePerms(prev => {
            const newMap = new Map(prev)
            const set = newMap.get(roleId) || new Set()
            if (checked) {
                set.add(permisoId)
            } else {
                set.delete(permisoId)
            }
            newMap.set(roleId, set)
            return newMap
        })
    }

    const handleCancel = () => {
        setIsEditing(false)
        setEditRolePerms(new Map())
    }

    const handleSave = async () => {
        try {
            setIsSaving(true)
            const updates = roles.map(role => {
                const permisoIds: number[] = Array.from(editRolePerms.get(String(role.id)) || new Set())
                const rolData: RolType = {
                    rol: role.rol,
                    descripcion: role.descripcion,
                    permisos: permisoIds,
                    ...(role.id && { id: String(role.id) }),
                    estadoId: estados().activo,
                }
                return putRol(role.id, rolData)
            })

            await Promise.all(updates)
            successToast("Permisos actualizados exitosamente")
            setIsEditing(false)
            setEditRolePerms(new Map())
            
            const updatedRoles = await getRoles()
            setRoles(updatedRoles)
        } catch (err: any) {
            errorToast(err.message)
        } finally {
            setIsSaving(false)
        }
    }

    if (loading) return <Loading />
    if (error) return <ErrorCard errorText={error} restart={() => window.location.reload()} />

    const modules = groupByModulo(permisos)

    const rolePermSets = isEditing ? editRolePerms : new Map(roles.map(role => [
        String(role.id),
        new Set((role.permisos || []).map((p: any) => Number((p as any).id)).filter((id: number) => !Number.isNaN(id)))
    ]))

    return (
        <Box sx={{ position: 'relative', width: '100%', overflowX: 'auto', paddingBottom: 4 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Permisos por Módulo</Typography>

            <PermissionsTable
                groupedModules={modules}
                roles={roles}
                rolePermSets={rolePermSets}
                isEditing={isEditing}
                onCheckboxChange={handleCheckboxChange}
            />

            {
                userlogged.permisos.includes("permisos:edit") && (
                    <EditControls
                        isEditing={isEditing}
                        initializeEditMode={initializeEditMode}
                        handleCancel={handleCancel}
                        handleSave={handleSave}
                        isSaving={isSaving}
                    />
                )
            }
        </Box>
    )
}

export default PermisoList
