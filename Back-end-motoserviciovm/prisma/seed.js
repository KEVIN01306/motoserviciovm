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
  
  { permiso: "home:view", modulo: "HOME", estadoId: 1 },
];

async function main() {
  await prisma.estado.createMany({
    data: [
      { id: 1, estado: 'Activo' },
      { id: 2, estado: 'Inactivo' },
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