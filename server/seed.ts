import { storage } from "./storage";

export async function seedDatabase() {
  console.log("🌱 Inicializando Carga Masiva de Datos de Simulación para Fábrica Metalmecánica MES Industria 4.0...");

  // 1. Clientes
  const client1 = await storage.createClient({
    name: "TechGrid Metalmecánica S.A.",
    email: "compras@techgrid.com",
    phone: "+54 11 4588-9000",
    address: "Av. Industrial 4500, Buenos Aires",
    taxId: "30-71234567-8"
  });

  const client2 = await storage.createClient({
    name: "ElectroDistribuidora Norte",
    email: "proyectos@electronorte.com",
    phone: "+54 351 422-1100",
    address: "Ruta 20 Km 12, Córdoba",
    taxId: "30-68991234-5"
  });

  const client3 = await storage.createClient({
    name: "Industrias Automotrices Cuyo",
    email: "abastecimiento@autocuyo.com",
    phone: "+54 261 445-8000",
    address: "Parque Industrial Mendoza",
    taxId: "30-54112233-9"
  });

  // 2. Proveedores
  await storage.createSupplier({
    name: "Aluminios del Sur S.A.",
    email: "ventas@alumsur.com",
    phone: "+54 11 4990-1234",
    address: "Parque Industrial Pilar",
    taxId: "30-55443322-1"
  });

  await storage.createSupplier({
    name: "Siderúrgica MetalMet Rosario",
    email: "contacto@metalmet.com",
    phone: "+54 341 512-4000",
    address: "Zona Industrial Rosario",
    taxId: "30-99887766-4"
  });

  // 3. Materias Primas / Componentes Base (BOM)
  const c1 = await storage.createComponent({
    name: "Barra de Aluminio 6061-T6 (Ø 50mm)",
    description: "Extrusión de precisión para mecanizado CNC",
    type: "connector",
    stock: 450,
    minStock: 100,
    weight: 2.4,
    cost: 18.5,
    alWeight: 2.4,
    brWeight: 0,
    minutesPerPiece: 12
  });

  const c2 = await storage.createComponent({
    name: "Lingote de Bronce SAE 660",
    description: "Aleación autolubricante para bujes antifricción",
    type: "connector",
    stock: 300,
    minStock: 50,
    weight: 4.1,
    cost: 32.0,
    alWeight: 0,
    brWeight: 4.1,
    minutesPerPiece: 18
  });

  const c3 = await storage.createComponent({
    name: "Placa de Acero Inoxidable 316L (6mm)",
    description: "Laminado austeníctico resistente a ambientes marinos",
    type: "chain",
    stock: 180,
    minStock: 40,
    weight: 8.5,
    cost: 65.0,
    minutesPerPiece: 25
  });

  const c4 = await storage.createComponent({
    name: "Bulón de Alta Resistencia M10x30 Inox",
    description: "Tornillería grado 8.8 para ensamble crítico",
    type: "connector",
    stock: 3500,
    minStock: 500,
    weight: 0.08,
    cost: 1.2,
    bolts: 1,
    boltMeasurement: "M10x30",
    boltType: "inoxidable"
  });

  // 4. Generación de 20+ Productos / SKUs Metalmecánicos Reales
  const productCatalog = [
    { name: "Conector de Alta Tensión CAT-500", desc: "Terminal de aluminio de alta conductividad para subestaciones 132kV", type: "connector" },
    { name: "Morsetería de Distribución MD-100", desc: "Conjunto de retención de acero y bronce para tendidos aéreos", type: "chain" },
    { name: "Eje de Transmisión Principal 45mm", desc: "Eje de acero aleado AISI 4140 rectificado para reductores industriales", type: "connector" },
    { name: "Carcasa de Aluminio CNC para Motor", desc: "Bloque monoblock mecanizado en 5 ejes con tolerancias IT6", type: "connector" },
    { name: "Engranaje Cónico Helicoidal Z30", desc: "Rueda dentada cementada con perfil de diente rectificado", type: "chain" },
    { name: "Buje Antifricción Bronce SAE 660", desc: "Elemento de desgaste para bancadas pesadas", type: "connector" },
    { name: "Flanche de Acero Inoxidable ANSI B16.5", desc: "Bridas de acople para cañerías de alta presión", type: "chain" },
    { name: "Disco de Freno Industrial Neumático", desc: "Disco ventilado con tratamiento térmico antidesgaste", type: "connector" },
    { name: "Válvula Esférica de Bronce 2 Pulgadas", desc: "Cuerpo mecanizado paso total para fluidos corrosivos", type: "connector" },
    { name: "Soporte de Cadena de Arrastre pesada", desc: "Estructura articulada de acero reforzado para transportadores", type: "chain" },
    { name: "Acople Flexible de Goma y Aluminio", desc: "Amortiguador de vibraciones torsionales para motorductores", type: "connector" },
    { name: "Prensaestopas Mecánico de Bronce M25", desc: "Sellado hermético IP68 para blindaje de cables", type: "connector" },
    { name: "Polea Acanalada de Aluminio Tipo SPA", desc: "Polea de transmisión sincronizada de 4 gargantas", type: "connector" },
    { name: "Pasador de Acero Cementado Ø 25mm", desc: "Pin de articulación endurecido a 60 HRC", type: "chain" },
    { name: "Tensor Hidráulico de Cadena Industrial", desc: "Sistema de amortiguación automática para líneas continuas", type: "chain" },
    { name: "Cuerpo de Bomba Centrífuga de Bronce", desc: "Fundición marina de alta durabilidad", type: "connector" },
    { name: "Placa de Desgaste bimetálica 10mm", desc: "Chapa de acero con recubrimiento de carburo de cromo", type: "chain" },
    { name: "Soporte de Rodamiento oscilante UCP208", desc: "Cojinete de fundición gris con rodamiento de bolas", type: "chain" },
    { name: "Niple de Acero Inoxidable 316L 1 Pulgada", desc: "Conexión roscada NPT para piping de procesos", type: "connector" },
    { name: "Abrazadera de Retención Inox de 3 Puntos", desc: "Fijación de suspensión para torres de transmisión", type: "chain" },
    { name: "Conector Rápido Neumático Ø 8mm", desc: "Acople para líneas de aire comprimido de alta presión", type: "connector" },
    { name: "Tobera de Pulverización Cónica Inox", desc: "Boquilla de acero inoxidable para sistemas de lavado industrial", type: "chain" },
    { name: "Filtro de Aceite Hidráulico Alta Eficiencia", desc: "Elemento filtrante de 10 micras para sistemas de potencia fluida", type: "connector" },
    { name: "Válvula Reguladora de Flujo Unidireccional", desc: "Control de velocidad para actuadores neumáticos e hidráulicos", type: "chain" },
    { name: "Sensor de Presión Absoluta 0-10 Bar", desc: "Transductor para monitoreo de sistemas de vacío y sobrepresión", type: "connector" }
  ];

  const createdProducts = [];
  for (let i = 0; i < productCatalog.length; i++) {
    const item = productCatalog[i];
    const prod = await storage.createProduct({
      name: item.name,
      description: item.desc,
      type: item.type as any,
      components: [
        { componentId: (i % 2 === 0 ? c1.id : c2.id), quantity: (i % 3) + 1 },
        { componentId: c4.id, quantity: (i % 4) + 2 }
      ],
      imageUrl: `/images/sku-${i + 1}.png`
    });
    createdProducts.push(prod);
  }

  // 5. Máquinas / Work Centers con Telemetría Sensorizada
  const m1 = await storage.createMachine({
    code: "CNC-01",
    name: "Centro de Mecanizado CNC 5 Ejes Haas VF-4",
    type: "CNC",
    location: "Nave A - Mecanizado de Alta Precisión",
    status: "RUNNING",
    oee: 89.4,
    availability: 94.2,
    performance: 96.0,
    quality: 98.8,
    temperature: 42.5,
    rpm: 8500,
    currentOrder: "OP-2026-001",
    operator: "Ing. Carlos Gómez"
  });

  const m2 = await storage.createMachine({
    code: "TRN-01",
    name: "Torno CNC Paralelo Mazak Quick Turn",
    type: "Torno",
    location: "Nave A - Tornería CNC",
    status: "RUNNING",
    oee: 91.2,
    availability: 95.0,
    performance: 97.1,
    quality: 99.0,
    temperature: 38.2,
    rpm: 3200,
    currentOrder: "OP-2026-002",
    operator: "Téc. Roberto Fernández"
  });

  const m3 = await storage.createMachine({
    code: "FRS-01",
    name: "Fresadora Universal BridgePort",
    type: "Fresadora",
    location: "Nave B - Mecanizado General",
    status: "IDLE",
    oee: 76.5,
    availability: 80.0,
    performance: 97.0,
    quality: 98.5,
    temperature: 24.0,
    rpm: 0,
    currentOrder: "-",
    operator: "Téc. Marcelo Silva"
  });

  const m4 = await storage.createMachine({
    code: "LAS-01",
    name: "Cortadora Láser de Fibra Óptica 6kW Trumpf",
    type: "Corte Laser",
    location: "Nave C - Corte y Conformado",
    status: "MAINTENANCE",
    oee: 62.0,
    availability: 65.0,
    performance: 98.0,
    quality: 97.2,
    temperature: 21.0,
    rpm: 0,
    currentOrder: "-",
    operator: "Mantenimiento Preventivo"
  });

  const m5 = await storage.createMachine({
    code: "PRS-01",
    name: "Prensa Hidráulica de Estampado 200T",
    type: "Prensa",
    location: "Nave C - Estampado",
    status: "STOPPED",
    oee: 45.0,
    availability: 50.0,
    performance: 92.0,
    quality: 97.8,
    temperature: 19.5,
    rpm: 0,
    currentOrder: "-",
    operator: "En Parada no Programada"
  });

  // 6. Generación de 15 Órdenes de Producción (Completadas, En Proceso, Retrasadas)
  const statuses = ["Completada", "En Proceso", "Retrasada"];
  const clientsList = [client1.name, client2.name, client3.name];

  for (let i = 1; i <= 15; i++) {
    const orderNum = `OP-2026-${i.toString().padStart(3, '0')}`;
    const status = statuses[i % 3];
    const client = clientsList[i % clientsList.length];
    const prod = createdProducts[i % createdProducts.length];

    const wo = await storage.createWorkOrder({
      title: `OT-2026-${100 + i}`,
      client,
      status: status === "Completada" ? "Completado" : status === "Retrasada" ? "Detenido" : "En Proceso",
      dueDate: `2026-07-${(10 + i).toString().padStart(2, '0')}`,
      priority: i % 2 === 0 ? "high" : "medium",
      description: `Fabricación de lote de ${prod.name} para cliente ${client}.`
    });

    await storage.createProductionOrder({
      workOrderId: wo.id,
      orderNumber: orderNum,
      client,
      status,
      dueDate: `2026-07-${(10 + i).toString().padStart(2, '0')}`,
      products: [
        {
          id: prod.id,
          name: prod.name,
          quantity: 100 * (i % 5 + 1),
          rawMaterials: [
            { id: c1.id, name: c1.name, stockQuantity: 450, requiredQuantity: 200 },
            { id: c4.id, name: c4.name, stockQuantity: 3500, requiredQuantity: 800 }
          ]
        }
      ]
    });
  }

  // 7. Trazabilidad & Pasaporte Digital (8+ Lotes Certificados ISO 9001)
  for (let j = 1; j <= 8; j++) {
    const prod = createdProducts[j % createdProducts.length];
    const machine = [m1, m2, m3, m4, m5][j % 5];
    await storage.createTraceability({
      batchNumber: `LOT-2026-${8890 + j}`,
      productId: prod.id,
      productName: prod.name,
      rawMaterialBatch: `COLADA-ACERO-316L-${j}09`,
      machineCode: machine.code,
      operator: machine.operator || "Téc. Certificado ISO",
      timestamp: new Date(Date.now() - j * 24 * 3600 * 1000).toISOString(),
      qualityPassed: j !== 4, // 1 lote rejected for demonstration
      notes: j === 4
        ? "Rechazado por rugosidad superficial fuera de tolerancia Ra > 1.6µm."
        : `Certificado de Calidad ISO 9001 Nº CERT-2026-${500 + j} Aprobado sin observaciones.`
    });
  }

  // 8. Alertas en Tiempo Real
  await storage.createAlert({
    machineCode: "PRS-01",
    severity: "CRITICAL",
    message: "Parada no programada: Presión hidráulica por debajo de umbral mínimo (120 bar)",
    timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
    acknowledged: false
  });

  await storage.createAlert({
    machineCode: "LAS-01",
    severity: "WARNING",
    message: "Mantenimiento preventivo programado alcanzado (500hs de lente óptico)",
    timestamp: new Date(Date.now() - 120 * 60000).toISOString(),
    acknowledged: true
  });

  console.log("✅ Carga Masiva de 20 SKUs, 15 Órdenes de Producción y Trazabilidad ISO 9001 completada con éxito.");
}
