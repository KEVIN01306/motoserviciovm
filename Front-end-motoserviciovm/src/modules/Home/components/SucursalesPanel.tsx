import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import { getSucursales } from "../../../services/sucursal.services";
import { getUsers } from "../../../services/users.services";
import type { SucursalType } from "../../../types/sucursalType";
import type { UserGetType } from "../../../types/userType";
import Loading from "../../../components/utils/Loading";
import ErrorCard from "../../../components/utils/ErrorCard";
import SucursalCard from "./SucursalCard";

const SucursalesPanel = () => {
    const [sucursales, setSucursales] = useState<SucursalType[]>([])
    const [users, setUsers] = useState<UserGetType[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchData = async () => {
        try {
            setLoading(true)
            const [sucRes, usersRes] = await Promise.all([getSucursales(), getUsers()])
            setSucursales(sucRes)
            setUsers(usersRes)
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    if (loading) return <Loading />
    if (error) return <ErrorCard errorText={error} restart={fetchData} />

    // map sucursal id to count
    const counts = users.reduce<Record<number, number>>((acc, user) => {
        (user.sucursales || []).forEach((sId) => {
            if (!sId) return
            acc[Number(sId)] = (acc[Number(sId)] || 0) + 1
        })
        return acc
    }, {})

    return (
        <Box display="flex" gap={2} flexWrap="wrap" alignItems="flex-start">
            {sucursales.map((sucursal) => (
                <Box key={sucursal.id}>
                    <SucursalCard nombre={sucursal.nombre} direccion={sucursal.direccion} usuariosCount={counts[Number(sucursal.id)] || 0} />
                </Box>
            ))}
        </Box>
    )
}

export default SucursalesPanel;
