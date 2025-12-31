import { Typography } from "@mui/material"
import {type TypographyVariant } from "@mui/material"

type LinkStylesNavigateProps = {
    label: string,
    onClick: () => void
    variant: TypographyVariant
}

const LinkStylesNavigate = ({ label, onClick, variant }: LinkStylesNavigateProps) => {

    return (
        <>
            <Typography color='primary' variant={variant} sx={{textDecoration: "underline", cursor: "pointer"}} onClick={onClick}>{label}</Typography>
        </>
    )
}

export default LinkStylesNavigate;