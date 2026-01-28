import { Box } from "@mui/material"
import LoadingMoto from "./LoadginMoto";



const Loading = () => {


    return (
        <>
            <Box sx={{ flexGrow: 1,
                        display: "flex", 
                        justifyContent: "center",
                        alignItems: "center",
                        width: "100%",

                    }}>
                {/*<CircularProgress color="primary" />*/}
                <LoadingMoto />
            </Box>
        </>
    )
}

export default Loading;