import React, { useState, useEffect } from "react";
import {
  Box, Typography, TextField, Button, Paper,
  FormControlLabel, Switch, Select, MenuItem, InputLabel, FormControl, Autocomplete
} from "@mui/material";
import dayjs from "dayjs";
import { fetchComprasBetweenDates } from "../api/compraEstadisticaApi";

// ✅ Usa la versión del businessApi.js
import { fetchSesionesByEstadoAndFecha } from "../api/businessApi";

import {
  fetchTotalIngresos,
  fetchTotalGastos,
  fetchGananciaNeta,
  fetchTotalArriendosFiltrado,
  fetchAmountBetweenDates,
  fetchTotalSesionesIndividuales
} from "../api/businessApi";
import { getAllProfesionales } from "../api/profesionalApi";
import { getAllClientes } from "../api/clienteApi";
import { getAllProductos } from "../api/productoApi";
import { getAllTerapias } from "../api/terapiaApi";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const estadoOpciones = [
  "Pagado y Realizado",
  "Pagado y No Realizado",
  "No Pagado y Realizado",
  "No Pagado y No Realizado"
];

const Resumen = () => {
  const [startDate, setStartDate] = useState(dayjs().startOf('year').format("YYYY-MM-DD"));
  const [endDate, setEndDate] = useState(dayjs().endOf('year').format("YYYY-MM-DD"));
  const [totalIngresos, setTotalIngresos] = useState(0);
  const [totalGastos, setTotalGastos] = useState(0);
  const [gananciaNeta, setGananciaNeta] = useState(0);
  const [diferenciaPorcentaje, setDiferenciaPorcentaje] = useState(0);
  const [dataMensual, setDataMensual] = useState([]);
  const [detalleMensual, setDetalleMensual] = useState([]);
  const [showDetail, setShowDetail] = useState(false);

  // filtros
  const [estado, setEstado] = useState("");
  const [profesional, setProfesional] = useState(null);
  const [cliente, setCliente] = useState(null);
  const [producto, setProducto] = useState(null);
  const [terapia, setTerapia] = useState(null);

  const [profesionales, setProfesionales] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [terapias, setTerapias] = useState([]);

  const loadFilters = async () => {
    setProfesionales(await getAllProfesionales());
    setClientes(await getAllClientes());
    setProductos(await getAllProductos());
    setTerapias(await getAllTerapias());
  };

  const meses = [
    { mes: 'Enero', start: '2025-01-01', end: '2025-01-31' },
    { mes: 'Febrero', start: '2025-02-01', end: '2025-02-28' },
    { mes: 'Marzo', start: '2025-03-01', end: '2025-03-31' },
    { mes: 'Abril', start: '2025-04-01', end: '2025-04-30' },
    { mes: 'Mayo', start: '2025-05-01', end: '2025-05-31' },
    { mes: 'Junio', start: '2025-06-01', end: '2025-06-30' },
    { mes: 'Julio', start: '2025-07-01', end: '2025-07-31' },
    { mes: 'Agosto', start: '2025-08-01', end: '2025-08-31' },
    { mes: 'Septiembre', start: '2025-09-01', end: '2025-09-30' },
    { mes: 'Octubre', start: '2025-10-01', end: '2025-10-31' },
    { mes: 'Noviembre', start: '2025-11-01', end: '2025-11-30' },
    { mes: 'Diciembre', start: '2025-12-01', end: '2025-12-31' },
  ];

  const loadResumen = async () => {
    try {
      const ingresos = await fetchTotalIngresos(startDate, endDate);
      const gastos = await fetchTotalGastos(startDate, endDate);
      const neto = await fetchGananciaNeta(startDate, endDate);

      setTotalIngresos(ingresos);
      setTotalGastos(gastos);
      setGananciaNeta(neto);

      const diferencia = gastos === 0 ? 100 : ((ingresos - gastos) / gastos) * 100;
      setDiferenciaPorcentaje(diferencia.toFixed(1));
    } catch (error) {
      console.error("❌ Error cargando resumen financiero:", error);
    }
  };

  const loadDataMensual = async () => {
    const mensualData = [];

    for (const m of meses) {
      try {
        const ingresos = await fetchTotalIngresos(m.start, m.end);
        const gastos = await fetchTotalGastos(m.start, m.end);
        mensualData.push({ mes: m.mes, ingresos, gastos });
      } catch (error) {
        mensualData.push({ mes: m.mes, ingresos: 0, gastos: 0 });
      }
    }
    setDataMensual(mensualData);
  };

  const loadDetalleMensual = async () => {
    const detalleData = [];
  
    for (const m of meses) {
      try {
        const sesiones = await fetchTotalSesionesIndividuales(m.start, m.end, estado || undefined, profesional?.id_profesional);
  
        const arriendos = await fetchTotalArriendosFiltrado(m.start, m.end, estado || undefined, cliente?.id_cliente, undefined);
  
        const comprasData = await fetchComprasBetweenDates(`${m.start}T00:00:00`, `${m.end}T23:59:59`);
  
        const compras = comprasData.reduce((acc, compra) => {
          const productosFiltrados = compra.productosComprados.filter(
            (p) => !producto || p.producto?.id_producto === producto.id_producto
          );
  
          const totalCompra = productosFiltrados.reduce(
            (sum, p) => sum + (p.producto?.precio || 0) * p.cantidad,
            0
          );
  
          return acc + totalCompra;
        }, 0);
  
        const sesionesGrupalesData = await fetchSesionesByEstadoAndFecha(
          `${m.start}T00:00:00`,
          `${m.end}T23:59:59`,
          estado || null // si backend acepta null, o simplemente estado
        );
        
  
        const sesionesFiltradas = sesionesGrupalesData.filter((g) => {
          const coincideCliente = !cliente || g.cliente?.id_cliente === cliente.id_cliente;
          const coincideTerapia = !terapia || g.terapia?.id_terapia === terapia.id_terapia;
          const coincideProfesional = !profesional || g.sesiones?.some(
            (s) => s.profesional?.id_profesional === profesional.id_profesional
          );
          return coincideCliente && coincideTerapia && coincideProfesional;
        });
  
        const sesionesGrupales = sesionesFiltradas.reduce((acc, group) => {
          const subtotal = group.sesiones
            .filter((s) => !profesional || s.profesional?.id_profesional === profesional.id_profesional)
            .reduce((sum, s) => sum + (s.precio || 0), 0);
          return acc + subtotal;
        }, 0);
  
        detalleData.push({ mes: m.mes, sesiones, sesionesGrupales, arriendos, compras });
      } catch (error) {
        detalleData.push({ mes: m.mes, sesiones: 0, sesionesGrupales: 0, arriendos: 0, compras: 0 });
      }
    }
  
    console.log("🧾 Detalle generado:", detalleData);
    setDetalleMensual(detalleData);
  };
  
  useEffect(() => {
    loadFilters();
  }, []);

  useEffect(() => {
    loadResumen();
    loadDataMensual();
    loadDetalleMensual();
  }, [startDate, endDate, estado, profesional, cliente, producto, terapia]);

  return (
    <Box sx={{ paddingTop: '600px' }} display="flex" flexDirection="column" gap={4} alignItems="center">
      <Typography variant="h4">Resumen Financiero</Typography>

      <Box display="flex" gap={2} alignItems="center">
        <TextField
          label="Fecha inicio"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Fecha fin"
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
        <Button variant="contained" onClick={() => {
          loadResumen();
          loadDataMensual();
          loadDetalleMensual();
        }}>Actualizar</Button>
      </Box>

      <Box display="flex" flexWrap="wrap" gap={2} alignItems="center" justifyContent="center">
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel id="estado-label">Estado</InputLabel>
          <Select
            labelId="estado-label"
            value={estado}
            label="Estado"
            onChange={(e) => setEstado(e.target.value)}
          >
            <MenuItem value="">Todos</MenuItem>
            {estadoOpciones.map((op) => (
              <MenuItem key={op} value={op}>{op}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <Autocomplete
          options={profesionales}
          getOptionLabel={(option) => option.usuario?.nombre || ""}
          value={profesional}
          onChange={(e, newValue) => setProfesional(newValue)}
          renderInput={(params) => <TextField {...params} label="Profesional" />}
          sx={{ minWidth: 200 }}
        />

        <Autocomplete
          options={clientes}
          getOptionLabel={(option) => option.usuario?.nombre || ""}
          value={cliente}
          onChange={(e, newValue) => setCliente(newValue)}
          renderInput={(params) => <TextField {...params} label="Cliente" />}
          sx={{ minWidth: 200 }}
        />

        <Autocomplete
          options={productos}
          getOptionLabel={(option) => option.nombre || ""}
          value={producto}
          onChange={(e, newValue) => setProducto(newValue)}
          renderInput={(params) => <TextField {...params} label="Producto" />}
          sx={{ minWidth: 200 }}
        />

        <Autocomplete
          options={terapias}
          getOptionLabel={(option) => option.nombre || ""}
          value={terapia}
          onChange={(e, newValue) => setTerapia(newValue)}
          renderInput={(params) => <TextField {...params} label="Terapia" />}
          sx={{ minWidth: 200 }}
        />

        <Button variant="outlined" onClick={() => {
          setEstado(""); setProfesional(null); setCliente(null); setProducto(null); setTerapia(null);
        }}>
          Limpiar filtros
        </Button>
      </Box>

      <FormControlLabel
        control={<Switch checked={showDetail} onChange={() => setShowDetail(!showDetail)} />}
        label="Mostrar detalle ingresos"
      />

      <Box display="flex" gap={3} mt={2} flexWrap="wrap">
        <Paper elevation={3} sx={{ p: 3, minWidth: 200, textAlign: 'center' }}>
          <Typography variant="h6">Total Ingresos</Typography>
          <Typography variant="h5" color="green">${totalIngresos}</Typography>
        </Paper>
        <Paper elevation={3} sx={{ p: 3, minWidth: 200, textAlign: 'center' }}>
          <Typography variant="h6">Total Gastos</Typography>
          <Typography variant="h5" color="red">${totalGastos}</Typography>
        </Paper>
        <Paper elevation={3} sx={{ p: 3, minWidth: 200, textAlign: 'center' }}>
          <Typography variant="h6">Ganancia Neta</Typography>
          <Typography variant="h5" color={gananciaNeta >= 0 ? "green" : "red"}>${gananciaNeta}</Typography>
        </Paper>
        <Paper elevation={3} sx={{ p: 3, minWidth: 250, textAlign: 'center' }}>
          <Typography variant="h6">% Diferencia Ingresos vs Gastos</Typography>
          <Typography variant="h5" color={diferenciaPorcentaje >= 0 ? "green" : "red"}>{diferenciaPorcentaje}%</Typography>
        </Paper>
      </Box>

      <Typography variant="h5" mt={4}>
        {showDetail ? "Detalle de Ingresos Mensuales" : "Ingresos y Gastos Mensuales"}
      </Typography>

      <ResponsiveContainer width="90%" height={400}>
        {showDetail ? (
          <BarChart data={detalleMensual}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="mes" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="sesiones" stackId="a" fill="#4caf50" name="Sesiones" />
          <Bar dataKey="sesionesGrupales" stackId="a" fill="#ffcc80" name="Sesiones Grupales" />
          <Bar dataKey="arriendos" stackId="a" fill="#81c784" name="Arriendos" />
          <Bar dataKey="compras" stackId="a" fill="#aed581" name="Compras" />
        </BarChart>
        
        ) : (
          <BarChart data={dataMensual}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="mes" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="ingresos" fill="#4caf50" name="Ingresos" />
            <Bar dataKey="gastos" fill="#f44336" name="Gastos" />
          </BarChart>
        )}
      </ResponsiveContainer>
    </Box>
  );
};

export default Resumen;