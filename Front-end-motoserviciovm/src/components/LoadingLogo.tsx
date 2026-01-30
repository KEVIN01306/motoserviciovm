import { Box, Toolbar, Typography } from "@mui/material"

const LoadingLogo = () => {

    return (
        <>
            <Box sx={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
                <Toolbar className="aspect-10/10 flex justify-center items-center animate-bounce" >
                   <img src="/icons/logo_mediano.png" alt="" width={"200px"} />
                </Toolbar>
                <Typography className="animate-pulse">
                    Cargando...
                </Typography>
            </Box>
        </>
    )
}

export default LoadingLogo