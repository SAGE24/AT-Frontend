import PropTypes from "prop-types";
import './Ticket.css'

const TicketModal = ({ isOpen, onClose, reservationData }) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white p-5 rounded-lg shadow-lg max-w-md w-full">
        <div className="printable">
            <h2 className="text-xl font-bold mb-4">Boleto de Reserva</h2>
            <div className="mb-4">
            <p><strong>Cliente:</strong> {reservationData.customerData.name}</p>
            <p><strong>Origen:</strong> {reservationData.flightData.origin}</p>
            <p><strong>Destino:</strong> {reservationData.flightData.destination}</p>
            <p><strong>Fecha de Salida:</strong> {reservationData.flightData.departureTime}</p>
            <p><strong>Asientos:</strong></p>
            <ul>
                {reservationData.flightData.seating.map((seat, index) => (
                <li key={index}>{seat.number} - ${seat.price}</li>
                ))}
            </ul>
            </div>
        </div>
        
        <div className="flex justify-end">
          <button onClick={onClose} className="px-4 py-2 bg-gray-400 text-white rounded mr-2">Cerrar</button>
          <button onClick={handlePrint} className="px-4 py-2 bg-blue-500 text-white rounded">Imprimir</button>
        </div>
      </div>
    </div>
  );
};

TicketModal.propTypes = {
    isOpen: PropTypes.bool,
    onClose: PropTypes.func,
    reservationData: PropTypes.any
};

export default TicketModal;
