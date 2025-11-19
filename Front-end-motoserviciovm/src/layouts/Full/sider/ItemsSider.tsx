import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Toolbar from "@mui/material/Toolbar";
import MenuItems from "./MenuItems";
import { Avatar } from "@mui/material";
import { useGoTo } from "../../../hooks/useGoTo";
import { useAuthStore } from "../../../store/useAuthStore";


const ItemsSider = () => {
    const user = useAuthStore(state => state.user);
    const goTo = useGoTo()
    const userPermisos = user?.permisos || [];
    const filteredMenu = MenuItems.filter((item, index) => {
        if (item.type === "modulo") {

            return userPermisos.includes(item.permiso);
        }
        
        if (item.type === "divider") {
            const nextItem = MenuItems[index + 1];
            return nextItem && nextItem.type === "modulo" && userPermisos.includes(nextItem.permiso);
        }
        
        return false;
    });
    
return (
    <Box>
      <Toolbar className="aspect-3/1 p-1.5 flex justify-center items-center" >
            <Avatar variant="rounded" src="/public/icons/logo_mediano.png" sx={{width: "100px", padding: "1px"}}/>
      </Toolbar>
      <List>
        {filteredMenu.map((item) => (
          <ListItem key={item.name} disablePadding>
            {item.type === "modulo" ? (
              <ListItemButton sx={{'&:hover':{ backgroundColor: 'transparent' }}} onClick={() => {item.link ? goTo(item.link) : null}}>
                <ListItemIcon sx={{ 
                  color: '#596d80',
                  minWidth: 35 
                  }}>
                  {item.icon ? <item.icon size={23} /> : null}
                </ListItemIcon>
                <ListItemText style={{overflowWrap: "anywhere", color: '#596d80',}}  primary={item.name} />
              </ListItemButton>
            ) : null}
            {item.type === "divider" ? (
              <Box 
                sx={{ 
                  width: '100%', 
                  px: 2, 
                  py: 1.5,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  color: '#9ca3af',
                }}
              >
                {item.icon ? (
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    color: '#b0b8c1',
                    minWidth: 35
                  }}>
                    <item.icon size={18} />
                  </Box>
                ) : null}
                <Box sx={{ 
                  flex: 1,
                  fontSize: 12, 
                  fontWeight: 600,
                  letterSpacing: 0.5,
                  textTransform: 'uppercase',
                  color: '#b0b8c1'
                }}>
                  {item.Text}
                </Box>
                <Box sx={{ 
                  flex: 0,
                  height: 1,
                  bgcolor: '#e5e7eb',
                  ml: 1
                }} />
              </Box>
            ) : null}
          </ListItem>
        ))}
      </List>
    </Box>
  );
}


export default ItemsSider;