import { useState } from "react";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { create } from '../services/orchestrator';
import { Constanst } from '../utils/constanst';
import TicketModal from '../components/Ticket';
import useCustomer from './../hooks/useCustomer';

const validationSchema = Yup.object().shape({
    customerData: Yup.object().shape({
        document: Yup.string().required('El documento es requerido').matches(/^[0-9]+$/, "Solo se permiten números").min('8', 'Ingrese número de documento correctamente'),
        name: Yup.string().required('El nombre es requerido'),
        email: Yup.string().required('El correo electrónico es requerido'),
        phone: Yup.string().required('El teléfono es requerido').matches(/^\d{9}$/, "El número de celular debe tener exactamente 9 dígitos")
    }),
    flightData: Yup.object().shape({
        origin: Yup.string().required('El origen es requerido'),
        destination: Yup.string().required('El destino es requerido'),
        departureTime: Yup.string().required('La fecha de salida es requerida'),
        amount: Yup.number(),
        seating: Yup.array().of(
            Yup.object().shape({
                number: Yup.string().required(''),
                price: Yup.number().required('').min(1, 'Debe ser mayor a 0')
            })
        ).min(1, 'Debe haber al menos un asiento')
    })
});

const Reservation = () => {
    const [lstDestinations, setLstDestinations] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [reservationData, setReservationData] = useState(null);
    const { handleSearchByDocument, loading, error } = useCustomer();

    const formik = useFormik({
        initialValues: {
            customerData: {
                document:'',
                name:'',
                email:'',
                phone:''
            },
            flightData: {
                origin:'',
                destination:'',
                departureTime:'',
                amount:0,
                seating:[{ number:'', price:0 }]
            }
        },
        validationSchema,
        onSubmit: async (values, { resetForm }) => {
            try {
                values.flightData.amount = values.flightData.seating.length;
                const response = await create(values);
                console.log(response);

                if(response.status) {
                    toast.success('Reserva pagada');
                    setIsModalOpen(true);
                    setReservationData({
                        customerData: values.customerData,
                        flightData: response.data
                    });
                    resetForm();
                }
            }
            catch (error) {
                toast.error('Error al crear reservación');
                console.log(error);
            }
        }
    })

    const handleAddSeat = () => {
        const validate = formik.values.flightData.seating.length;

        console.log(validate);
        if(validate + 1 > Constanst.MAXIMUM_QUANTITY) {
            toast.warning('Solo puede comprar 4 asientos');
            return;
        }

        const newSeat = { number: '', price: '' };
        formik.setFieldValue('flightData.seating', [...formik.values.flightData.seating, newSeat]);
    };

    const handleRemoveSeat = (index) => {
        const updatedSeating = formik.values.flightData.seating.filter((_, i) => i !== index);
        formik.setFieldValue('flightData.seating', updatedSeating);
    };

    const handleDestinations = (event) => {
        const origin = event.target.value;
        formik.setFieldValue('flightData.origin', origin);

        setLstDestinations(Constanst.CITIES.filter(w => w.value !== origin));
    }

    const handleSeating = (index, event) => {
        const number = event.target.value;
        const record = Constanst.SEATING.find(w => w.number === number); 
        
        const validate = formik.values.flightData.seating.find(w => w.number == record.number);
        if(validate) {
            toast.warning('Asiento ya seleccionado');
            formik.setFieldValue(`flightData.seating[${index}].number`, '');
            formik.setFieldValue(`flightData.seating[${index}].price`, '');
            return;
        }
        
        formik.setFieldValue(`flightData.seating[${index}].number`, record.number);
        formik.setFieldValue(`flightData.seating[${index}].price`, record.price);
    }

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleGetCustomer = async (event) => {
        const document = event.target.value;
        formik.setFieldValue('customerData.document', document);
        if(document.length >= 8) {
            const response = await handleSearchByDocument(document);
            if(response) {
                formik.setFieldValue('customerData.document', response.document);
                formik.setFieldValue('customerData.name', response.name);
                formik.setFieldValue('customerData.email', response.email);
                formik.setFieldValue('customerData.phone', response.phone);
            }
            return;
        }

        formik.setFieldValue('customerData.name', '');
        formik.setFieldValue('customerData.email', '');
        formik.setFieldValue('customerData.phone', '');
    }

    return (
        <div className="w-4/5 mx-auto">
            <ToastContainer />
            <h2 className="text-2xl font-bold">Crear Reserva</h2>
            <form onSubmit={formik.handleSubmit} className="flex flex-col w-full" autoComplete="off">
                <div className="flex flex-row gap-2 mt-5 mb-3">
                    <h3 className="font-semibold">Datos de cliente</h3>
                </div>
                <div className="flex flex-row gap-2">
                    <div className="w-1/4">
                        <label className="font-semibold">Documento</label>
                        {loading ? (
                            <div className="w-full h-10 bg-gray-200 animate-pulse rounded-md"></div>
                        ) : (
                            <input type="text"
                                value={formik.values.customerData.document}
                                onChange={handleGetCustomer}
                                className="w-full p-2 border border-gray-300 rounded" 
                            />
                        )}
                        {formik.touched.customerData?.document && formik.errors.customerData?.document && (
                            <p className="text-red-500">{formik.errors.customerData.document}</p>
                        )}
                        
                    </div>
                    <div className="w-3/4">
                        <label className="font-semibold">Nombre</label>
                        <input type="text" className="w-full p-2 border border-gray-300 rounded" {...formik.getFieldProps('customerData.name')} />
                        {formik.touched.customerData?.name && formik.errors.customerData?.name && (
                            <p className="text-red-500">{formik.errors.customerData.name}</p>
                        )}
                    </div>
                </div>
                <div className="flex flex-row gap-2">
                    <div className="w-3/4">
                        <label className="block mb-1 font-semibold">Correo</label>
                        <input type="email" className="w-full p-2 border border-gray-300 rounded" {...formik.getFieldProps('customerData.email')} />
                        {formik.touched.customerData?.email && formik.errors.customerData?.email && (
                            <p className="text-red-500">{formik.errors.customerData.email}</p>
                        )}
                    </div>
                    <div className="w-1/4">
                        <label className="block mb-1 font-semibold">Teléfono</label>
                        <input type="text" className="w-full p-2 border border-gray-300 rounded" {...formik.getFieldProps('customerData.phone')} />
                        {formik.touched.customerData?.phone && formik.errors.customerData?.phone && (
                            <p className="text-red-500">{formik.errors.customerData.phone}</p>
                        )}
                    </div>
                </div>

                <div className="flex flex-row gap-2 mt-5 mb-3">
                    <h3 className="font-semibold">Datos de reservación</h3>
                </div>

                <div className="flex flex-row gap-2">
                    <div className="w-1/4">
                        <label className="block mb-1 font-semibold">Origen</label>
                        <select
                            value={formik.values.flightData.origin}
                            onChange={handleDestinations}
                            className="w-full p-2 border border-gray-300 rounded"
                        >
                            <option value="">Seleccionar</option>
                            {Constanst.CITIES.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        {formik.touched.flightData?.origin && formik.errors.flightData?.origin && (
                            <p className="text-red-500">{formik.errors.flightData.origin}</p>
                        )}
                    </div>
                    <div className="w-1/4">
                        <label className="block mb-1 font-semibold">Destino</label>
                        <select
                            {...formik.getFieldProps('flightData.destination')}
                            className="w-full p-2 border border-gray-300 rounded"
                        >
                            <option value="">Seleccionar</option>
                            {lstDestinations.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        {formik.touched.flightData?.destination && formik.errors.flightData?.destination && (
                            <p className="text-red-500">{formik.errors.flightData.destination}</p>
                        )}
                    </div>
                    <div className="w-1/4">
                        <label className="block mb-1 font-semibold">Fecha de Salida</label>
                        <input
                            type="datetime-local"
                            {...formik.getFieldProps('flightData.departureTime')}
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                        {formik.touched.flightData?.departureTime && formik.errors.flightData?.departureTime && (
                            <p className="text-red-500">{formik.errors.flightData.departureTime}</p>
                        )}
                    </div>
                </div>
                <div className="flex flex-row gap-2 mt-5 mb-3 text-center items-center">
                    <h3 className="font-semibold">Asientos:</h3>
                    <button
                        type="button"
                        onClick={handleAddSeat}
                        className="bg-blue-500 text-white px-4 py-2 rounded-md"
                        >Agregar Asiento
                    </button>
                </div>
                <div className="flex flex-row gap-2">
                    {formik.values.flightData.seating.map((seat, index) => (
                        <div key={index} className="space-y-2">
                            <h3 className="text-lg font-semibold">Asiento {index + 1}</h3>
                            <div>
                                <label className="block mb-1 font-semibold">Número</label>
                                <select
                                    value={seat.number}
                                    onChange={(event) => handleSeating(index, event)}
                                    className="w-full p-2 border border-gray-300 rounded"
                                >
                                    <option value="">Seleccionar</option>
                                    {Constanst.SEATING.map((option) => (
                                        <option key={`${option.number}_${index}`} value={option.number}>
                                            {option.number}
                                        </option>
                                    ))}
                                </select>
                                {formik.errors.flightData?.seating?.[index]?.number && (
                                    <p className="text-red-500">{formik.errors.flightData.seating[index].number}</p>
                                )}
                            </div>
                            <div>
                                <label className="block mb-1 font-semibold">Precio</label>
                                <input
                                    type="number"
                                    min="1"
                                    readOnly
                                    value={seat.price}
                                    onChange={(e) => formik.setFieldValue(`flightData.seating[${index}].price`, e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded"
                                />
                                {formik.errors.flightData?.seating?.[index]?.price && (
                                    <p className="text-red-500">{formik.errors.flightData.seating[index].price}</p>
                                )}
                            </div>
                            <button type="button"
                                onClick={() => handleRemoveSeat(index)}
                                className="bg-red-500 text-white px-2 py-1 rounded mt-2 font-semibold"
                            >X
                            </button>
                        </div>
                    ))}
                </div>     
                
                <div className="flex flex-row gap-2">
                    <button 
                        type="submit"
                        className="bg-green-500 text-white w-1/3 px-4 py-2 rounded-md mt-4"
                    >Crear Reserva</button>
                </div>

                
            </form>

            <TicketModal 
                isOpen={isModalOpen}
                onClose={closeModal}
                reservationData={reservationData}
            />
        </div>
    );
};

export default Reservation;