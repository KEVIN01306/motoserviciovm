import React, { useState } from 'react';
import MuiTextFieldWrapper from './MuiTextFieldWrapper';
import ContactDetail from './ContactDetail';
import CalendarIcon from '@mui/icons-material/CalendarToday';
import MapPinIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import NutDecoration from './NutDecoration';

const BookingForm: React.FC = () => {
  const today = new Date().toISOString().split('T')[0];
  const [name, setName] = useState('');
  const [placa, setPlaca] = useState('');
  const [dpiNit, setDpiNit] = useState('');
  const [message, setMessage] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('');
  const [selectedServiceType, setSelectedServiceType] = useState('');
  const [selectedDate, setSelectedDate] = useState(today);
  const [selectedTime, setSelectedTime] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [lastSubmission, setLastSubmission] = useState({ date: 'N/A', time: 'N/A', placa: 'N/A', branch: 'N/A', dpiNit: 'N/A', serviceType: 'N/A' });

  const availableBranches = [
    { id: 1, name: 'Sede Principal - Ciudad Motor' },
    { id: 2, name: 'Sucursal Norte - Zona Industrial' },
    { id: 3, name: 'Sucursal Sur - El Puerto' },
  ];
  const availableTimes = ['9:00 AM', '10:00 AM', '11:00 AM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'];
  const serviceTypeOptions = ['Servicio Menor', 'Servicio Mayor', 'Otro (Reparación / Personalizado)'];

  const isSlotOccupied = (date: string, time: string) => {
    const d = new Date(); d.setDate(d.getDate() + 2);
    const occupiedDate = d.toISOString().split('T')[0];
    if (time === '10:00 AM') return true;
    if (date === occupiedDate && time === '3:00 PM') return true;
    return false;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTime || !selectedBranch || !dpiNit || !selectedServiceType) return;

    setLastSubmission({ date: selectedDate, time: selectedTime, placa, branch: selectedBranch, dpiNit, serviceType: selectedServiceType });
    setIsModalOpen(true);

    setName(''); setPlaca(''); setDpiNit(''); setMessage(''); setSelectedDate(today); setSelectedTime(''); setSelectedBranch(''); setSelectedServiceType('');
  };

  return (
    <section id="contacto" className="py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold mb-4 flex items-center text-gray-900 dark:text-white border-b border-indigo-500 pb-2 justify-center"><NutDecoration size={20} className="mr-2" />Agenda tu Servicio<NutDecoration size={20} className="ml-2" /></h2>
        <p className="text-center mb-10 text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">Selecciona tu sucursal, la fecha y hora que más te convenga, el tipo de servicio que deseas y déjanos tus datos.</p>

        <div className="MuiPaper-root grid md:grid-cols-2 gap-12 bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl border border-indigo-500/30">
          <div className="space-y-6 md:space-y-8 p-4 bg-white dark:bg-gray-800 rounded-xl">
            <h3 className="text-xl font-bold mb-4 flex items-center text-gray-900 dark:text-white border-b border-indigo-500 pb-2"><CalendarIcon className="mr-2"/>Paso 1: Selecciona Sucursal, Fecha y Hora</h3>
            <div>
              <label htmlFor="branch" className="block text-sm font-medium text-gray-300 mb-1">1. Selecciona la Sucursal (Obligatorio)</label>
              <select id="branch" value={selectedBranch} onChange={(e) => { setSelectedBranch(e.target.value); setSelectedDate(today); setSelectedTime(''); }} required className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-white">
                <option value="" disabled>--- Selecciona una sucursal ---</option>
                {availableBranches.map(b => <option key={b.id} value={b.name}>{b.name}</option>)}
              </select>
            </div>

            <div className={`space-y-2 ${!selectedBranch ? 'opacity-50 pointer-events-none' : ''}`}>
              <label htmlFor="date" className="block text-sm font-medium text-gray-300">2. Selecciona la Fecha:</label>
              <input type="date" id="date" value={selectedDate} min={today} onChange={(e) => { setSelectedDate(e.target.value); setSelectedTime(''); }} className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-white" disabled={!selectedBranch} />
            </div>

            <div className={`space-y-3 ${!selectedBranch ? 'opacity-50 pointer-events-none' : ''}`}>
              <p className="block text-sm font-medium text-gray-300">3. Selecciona la Hora (Slots Disponibles):</p>
              <div className="grid grid-cols-3 gap-2">
                {availableTimes.map(time => {
                  const isOccupied = isSlotOccupied(selectedDate, time);
                  const isSelected = selectedTime === time;
                  return (
                    <button key={time} type="button" onClick={() => !isOccupied && selectedBranch && setSelectedTime(time)} disabled={isOccupied || !selectedBranch} className={`p-2 text-sm font-bold rounded-md ${isOccupied ? 'bg-red-900 text-red-300' : isSelected ? 'bg-accent-orange text-white' : 'bg-gray-700 text-gray-200'}`}>
                      {time}
                    </button>
                  );
                })}
              </div>
            </div>

            <hr className="border-gray-700" />
            <h3 className="text-xl font-bold text-gray-300">Contacto Directo</h3>
            <ContactDetail Icon={MapPinIcon} title="Dirección Principal" value="Calle Falsa 123, Ciudad Motor" />
            <ContactDetail Icon={PhoneIcon} title="Teléfono" value="+502 5555-VMVM" />
          </div>

          <div className="p-4 space-y-5">
            <h3 className="text-xl font-bold mb-4 flex items-center text-gray-900 dark:text-white border-b border-indigo-500 pb-2">Paso 2: Confirma tus Datos</h3>
            <form onSubmit={handleSubmit} className="space-y-5">
              <MuiTextFieldWrapper label="Nombre" id="nombre" type="text" placeholder="Tu nombre completo" value={name} onChange={(e) => setName(e.target.value)} required />
              <MuiTextFieldWrapper label="Placa de la Moto (Obligatorio)" id="placa" type="text" placeholder="Ej: M123ABC" value={placa} onChange={(e) => setPlaca(e.target.value)} required />
              <MuiTextFieldWrapper label="DPI o NIT (Obligatorio)" id="dpi_nit" type="text" placeholder="Ej: 1234567890123" value={dpiNit} onChange={(e) => setDpiNit(e.target.value)} required />

              <div>
                <label htmlFor="serviceType" className="block text-sm font-medium text-gray-300 mb-1">Tipo de Servicio Requerido (Obligatorio)</label>
                <select id="serviceType" value={selectedServiceType} onChange={(e) => setSelectedServiceType(e.target.value)} required className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-white">
                  <option value="" disabled>--- Selecciona el tipo de servicio ---</option>
                  {serviceTypeOptions.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <MuiTextFieldWrapper label="Mensaje Adicional" id="mensaje" rows="4" value={message} onChange={(e) => setMessage(e.target.value)} required={false} placeholder="Detalles adicionales..." />

              <button type="submit" disabled={!selectedTime || !selectedBranch || !dpiNit || !selectedServiceType} className="w-full px-6 py-3 text-lg font-bold rounded-lg bg-accent-orange text-white">
                {(selectedTime && selectedBranch && dpiNit && selectedServiceType) ? `Confirmar Agenda para ${selectedTime}` : 'Completa todos los campos obligatorios'}
              </button>
            </form>
          </div>
        </div>

        {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-70 z-100 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl max-w-md w-full space-y-6 border border-indigo-500/30">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">¡Cita Agendada con Éxito!</h3>
              <div className="text-gray-700 space-y-2">
                <ul className='list-none space-y-1 text-sm bg-gray-50 p-3 rounded-lg border'>
                  <li><strong>Tipo de Servicio:</strong> {lastSubmission.serviceType}</li>
                  <li><strong>Placa:</strong> {lastSubmission.placa}</li>
                  <li><strong>DPI/NIT:</strong> {lastSubmission.dpiNit}</li>
                  <li><strong>Sucursal:</strong> {lastSubmission.branch}</li>
                  <li><strong>Fecha:</strong> {new Date(lastSubmission.date).toLocaleDateString('es-ES', { dateStyle: 'long' })}</li>
                  <li><strong>Hora:</strong> {lastSubmission.time}</li>
                </ul>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="w-full px-4 py-3 bg-accent-orange text-white font-bold rounded-lg">Cerrar y Volver</button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default BookingForm;
