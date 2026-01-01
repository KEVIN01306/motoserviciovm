import prisma from '../src/configs/db.config.js';

const PERMISOS_SEED = [
  { permiso: "usuarios:create", modulo: "USUARIOS", estadoId: 1 },
  { permiso: "usuarios:view", modulo: "USUARIOS", estadoId: 1 },
  { permiso: "usuarios:detail", modulo: "USUARIOS", estadoId: 1 },
  { permiso: "usuarios:delete", modulo: "USUARIOS", estadoId: 1 },
  { permiso: "usuarios:edit", modulo: "USUARIOS", estadoId: 1 },
  { permiso: "roles:view", modulo: "ROLES", estadoId: 1 },
  { permiso: "roles:create", modulo: "ROLES", estadoId: 1 },
  { permiso: "roles:edit", modulo: "ROLES", estadoId: 1 },
  { permiso: "permisos:view", modulo: "PERMISOS", estadoId: 1 },
  { permiso: "permisos:edit", modulo: "PERMISOS", estadoId: 1 },
  { permiso: "sucursales:view", modulo: "SUCURSALES", estadoId: 1 },
  { permiso: "sucursales:create", modulo: "SUCURSALES", estadoId: 1 },
  { permiso: "sucursales:edit", modulo: "SUCURSALES", estadoId: 1 },
  { permiso: "sucursales:detail", modulo: "SUCURSALES", estadoId: 1 },
  { permiso: "sucursales:delete", modulo: "SUCURSALES", estadoId: 1 },
  { permiso: "lineas:view", modulo: "LINEAS", estadoId: 1 },
  { permiso: "lineas:create", modulo: "LINEAS", estadoId: 1 },
  { permiso: "lineas:edit", modulo: "LINEAS", estadoId: 1 },
  { permiso: "lineas:detail", modulo: "LINEAS", estadoId: 1 },
  { permiso: "lineas:delete", modulo: "LINEAS", estadoId: 1 },
  { permiso: "marcas:view", modulo: "MARCAS", estadoId: 1 },
  { permiso: "marcas:create", modulo: "MARCAS", estadoId: 1 },
  { permiso: "marcas:edit", modulo: "MARCAS", estadoId: 1 },
  { permiso: "marcas:detail", modulo: "MARCAS", estadoId: 1 },
  { permiso: "marcas:delete", modulo: "MARCAS", estadoId: 1 },

  { permiso: "cilindradas:view", modulo: "CILINDRADAS", estadoId: 1 },
  { permiso: "cilindradas:create", modulo: "CILINDRADAS", estadoId: 1 },
  { permiso: "cilindradas:edit", modulo: "CILINDRADAS", estadoId: 1 },
  { permiso: "cilindradas:detail", modulo: "CILINDRADAS", estadoId: 1 },
  { permiso: "cilindradas:delete", modulo: "CILINDRADAS", estadoId: 1 },

  { permiso: "modelos:view", modulo: "MODELOS", estadoId: 1 },
  { permiso: "modelos:create", modulo: "MODELOS", estadoId: 1 },
  { permiso: "modelos:edit", modulo: "MODELOS", estadoId: 1 },
  { permiso: "modelos:detail", modulo: "MODELOS", estadoId: 1 },
  { permiso: "modelos:delete", modulo: "MODELOS", estadoId: 1 },

  { permiso: "motos:view", modulo: "MOTOS", estadoId: 1 },
  { permiso: "motos:create", modulo: "MOTOS", estadoId: 1 },
  { permiso: "motos:edit", modulo: "MOTOS", estadoId: 1 },
  { permiso: "motos:detail", modulo: "MOTOS", estadoId: 1 },
  { permiso: "motos:delete", modulo: "MOTOS", estadoId: 1 },
  
  { permiso: "opcioneservicios:view", modulo: "OPCIONESERVICIOS", estadoId: 1 },
  { permiso: "opcioneservicios:create", modulo: "OPCIONESERVICIOS", estadoId: 1 },
  { permiso: "opcioneservicios:edit", modulo: "OPCIONESERVICIOS", estadoId: 1 },
  { permiso: "opcioneservicios:detail", modulo: "OPCIONESERVICIOS", estadoId: 1 },
  { permiso: "opcioneservicios:delete", modulo: "OPCIONESERVICIOS", estadoId: 1 },
  
  { permiso: "tiposervicios:view", modulo: "TIPOSERVICIOS", estadoId: 1 },
  { permiso: "tiposervicios:create", modulo: "TIPOSERVICIOS", estadoId: 1 },
  { permiso: "tiposervicios:edit", modulo: "TIPOSERVICIOS", estadoId: 1 },
  { permiso: "tiposervicios:detail", modulo: "TIPOSERVICIOS", estadoId: 1 },
  { permiso: "tiposervicios:delete", modulo: "TIPOSERVICIOS", estadoId: 1 },

  { permiso: "categoriaproducto:view", modulo: "CATEGORIAPRODUCTO", estadoId: 1 },
  { permiso: "categoriaproducto:create", modulo: "CATEGORIAPRODUCTO", estadoId: 1 },
  { permiso: "categoriaproducto:edit", modulo: "CATEGORIAPRODUCTO", estadoId: 1 },
  { permiso: "categoriaproducto:detail", modulo: "CATEGORIAPRODUCTO", estadoId: 1 },
  { permiso: "categoriaproducto:delete", modulo: "CATEGORIAPRODUCTO", estadoId: 1 },
  
  { permiso: "productos:view", modulo: "PRODUCTOS", estadoId: 1 },
  { permiso: "productos:create", modulo: "PRODUCTOS", estadoId: 1 },
  { permiso: "productos:edit", modulo: "PRODUCTOS", estadoId: 1 },
  { permiso: "productos:detail", modulo: "PRODUCTOS", estadoId: 1 },
  { permiso: "productos:delete", modulo: "PRODUCTOS", estadoId: 1 },

  { permiso: "inventarios:view", modulo: "INVENTARIOS", estadoId: 1 },
  { permiso: "inventarios:create", modulo: "INVENTARIOS", estadoId: 1 },
  { permiso: "inventarios:edit", modulo: "INVENTARIOS", estadoId: 1 },
  { permiso: "inventarios:detail", modulo: "INVENTARIOS", estadoId: 1 },
  { permiso: "inventarios:delete", modulo: "INVENTARIOS", estadoId: 1 },

  { permiso: "enparqueo:view", modulo: "ENPARQUEO", estadoId: 1 },
  { permiso: "enparqueo:create", modulo: "ENPARQUEO", estadoId: 1 },
  { permiso: "enparqueo:salida", modulo: "ENPARQUEO", estadoId: 1 },
  { permiso: "enparqueo:detail", modulo: "ENPARQUEO", estadoId: 1 },

  { permiso: "enreparacion:view", modulo: "ENREPARACION", estadoId: 1 },
  { permiso: "enreparacion:create", modulo: "ENREPARACION", estadoId: 1 },
  { permiso: "enreparacion:salida", modulo: "ENREPARACION", estadoId: 1 },
  { permiso: "enreparacion:edit", modulo: "ENREPARACION", estadoId: 1 },
  { permiso: "enreparacion:detail", modulo: "ENREPARACION", estadoId: 1 },

  { permiso: "ventas:view", modulo: "VENTAS", estadoId: 1 },
  { permiso: "ventas:create", modulo: "VENTAS", estadoId: 1 },
  { permiso: "ventas:edit", modulo: "VENTAS", estadoId: 1 },
  { permiso: "ventas:detail", modulo: "VENTAS", estadoId: 1 },
  { permiso: "ventas:finalize", modulo: "VENTAS", estadoId: 1 },
  { permiso: "ventas:cancel", modulo: "VENTAS", estadoId: 1 },

  { permiso: "servicios:view", modulo: "SERVICIOS", estadoId: 1 },
  { permiso: "servicios:create", modulo: "SERVICIOS", estadoId: 1 },
  { permiso: "servicios:edit", modulo: "SERVICIOS", estadoId: 1 },
  { permiso: "servicios:detail", modulo: "SERVICIOS", estadoId: 1 },
  { permiso: "servicios:salida", modulo: "SERVICIOS", estadoId: 1 },

  { permiso: "ingresos-egresos:create", modulo: "INGRESOSEGRESOS", estadoId: 1 },
  { permiso: "ingresos-egresos:view", modulo: "INGRESOSEGRESOS", estadoId: 1 },
  { permiso: "ingresos-egresos:edit", modulo: "INGRESOSEGRESOS", estadoId: 1 },
  { permiso: "ingresos-egresos:detail", modulo: "INGRESOSEGRESOS", estadoId: 1 },
  { permiso: "ingresos-egresos:delete", modulo: "INGRESOSEGRESOS", estadoId: 1 },
  { permiso: "ingresos-egresos:finalize", modulo: "INGRESOSEGRESOS", estadoId: 1 },
  { permiso: "ingresos-egresos:cancel", modulo: "INGRESOSEGRESOS", estadoId: 1 },

  { permiso: "contabilidad:view", modulo: "CONTABILIDAD", estadoId: 1 },

  { permiso: "home:view", modulo: "HOME", estadoId: 1 },
];

async function main() {
  await prisma.estado.createMany({
    data: [
      { id: 1, estado: 'Activo' },
      { id: 2, estado: 'Inactivo' },
      { id: 3, estado: 'En Parqueo' },
      { id: 4, estado: 'En Reparacion' },
      { id: 5, estado: 'En Servicio' },
      { id: 6, estado: 'Entregado' },
      { id: 7, estado: 'En Espera' },
      { id: 8, estado: 'Confirmado' },
      { id: 9, estado: 'Cancelado' },
    ],
    skipDuplicates: true,
  });

  await prisma.tipoContabilidad.createMany({
    data: [
      { id: 1, tipo: 'Ingreso' },
      { id: 2, tipo: 'Egreso' },
    ],
    skipDuplicates: true,
  });
  
  await prisma.moduloTaller.createMany({
    data: [
      { id: 1, modulo: 'CONTROL TALLER' },
      { id: 2, modulo: 'CONTROL REPUESTOS' },
    ],
    skipDuplicates: true,
  });

  await prisma.permiso.createMany({
    data: PERMISOS_SEED,
    skipDuplicates: true,
  });

  const permisos = await prisma.permiso.findMany({
    where: {
      permiso: {
        in: PERMISOS_SEED.map(p => p.permiso),
      },
    },
    select: { id: true },
  });

  await prisma.rol.upsert({
    where: { rol: 'ADMIN' },
    update: {
      descripcion: 'Administrador del sistema',
      estadoId: 1,
      permisos: {
        set: permisos.map(p => ({ id: p.id })),
      },
    },
    create: {
      rol: 'ADMIN',
      descripcion: 'Administrador del sistema',
      estadoId: 1,
      permisos: {
        connect: permisos.map(p => ({ id: p.id })),
      },
    },
  });
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });