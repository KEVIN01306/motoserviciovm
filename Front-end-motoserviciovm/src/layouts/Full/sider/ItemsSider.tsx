import { useState } from "react";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Toolbar from "@mui/material/Toolbar";
import Collapse from "@mui/material/Collapse";
import Avatar from "@mui/material/Avatar";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import MenuItems from "./MenuItems";
import { useGoTo } from "../../../hooks/useGoTo";
import { useAuthStore } from "../../../store/useAuthStore";

const ItemsSider = () => {
  const user = useAuthStore((state) => state.user);
  const goTo = useGoTo();
  const userPermisos = user?.permisos || [];
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

  const visibleGroups = MenuItems.map((group) => {
    const children = (group.children || []).filter((c: any) => userPermisos.includes(c.permiso));
    return { ...group, children };
  }).filter((g) => (g.children || []).length > 0);

  const toggleGroup = (moduleName: string) => {
    setOpenGroups((prev) => ({ ...prev, [moduleName]: !prev[moduleName] }));
  };

  return (
    <Box>
      <Toolbar className="aspect-3/1 p-1.5 flex justify-center items-center">
        <Avatar variant="rounded" src="/public/icons/logo_mediano.png" sx={{ width: "100px", padding: "1px" }} />
      </Toolbar>
      <List>
        {visibleGroups.map((group: any) => {
          const Icon = group.icon as any;
          const isOpen = !!openGroups[group.module];
          return (
            <Box key={group.module}>
              <ListItem disablePadding style={{overflowWrap: "anywhere"}}>
                <ListItemButton onClick={() => toggleGroup(group.module)} sx={{ justifyContent: "space-between" }}>
                  <ListItemIcon sx={{ color: "#9ca3af", minWidth: 35 }}>{Icon ? <Icon /> : null}</ListItemIcon>
                  <ListItemText sx={{ color: "#9ca3af", fontSize: 12, fontWeight: 700, textTransform: "uppercase" }} primary={group.module} />
                  {isOpen ? <ExpandLess sx={{ color: "#9ca3af" }} /> : <ExpandMore sx={{ color: "#9ca3af" }} />}
                </ListItemButton>
              </ListItem>

              <Collapse in={isOpen} timeout="auto" unmountOnExit>
                <List component="div" disablePadding style={{overflowWrap: "anywhere"}}>
                  {group.children.map((child: any) => {
                    const ChildIcon = child.icon as any;
                    return (
                      <ListItem key={child.name} disablePadding>
                        <ListItemButton sx={{ pl: 4 }} onClick={() => (child.link ? goTo(child.link) : null)}>
                          <ListItemIcon sx={{ color: "#596d80", minWidth: 35 }}>{ChildIcon ? <ChildIcon /> : null}</ListItemIcon>
                          <ListItemText sx={{ color: "#596d80" }} primary={child.name} />
                        </ListItemButton>
                      </ListItem>
                    );
                  })}
                </List>
              </Collapse>
            </Box>
          );
        })}
      </List>
    </Box>
  );
};

export default ItemsSider;