import React, { useEffect, useState } from 'react';
import { CButton, CButtonGroup, CCard, CCardBody, CCardHeader, CCol, CDataTable, CForm, CFormGroup, CInput, CLabel, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle, CRow, CSelect, CTextarea } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import useApi from '../services/api';

export default () => {
    const api = useApi();
    const [loading, setLoading] = useState(true);
    const [list, setList] = useState([]);
    const [modalUnitList, setModalUnitList] = useState([]);
    const [modalAreaList, setModalAreaList] = useState([]);
    const [unitId, setUnitId] = useState(0);
    const [areaId, setAreaId] = useState(0);
    const [dateField,setDateField] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [modalLoading, setModalLoading] = useState(false);
    const [delLoading, setDelLoading] = useState(false);
    const [modalId, setModalId] = useState('');


    const fields = [
        {label: 'Unidade', key: 'name_unit', sorter: false},
        {label: 'Área', key: 'name_area', sorter: false},
        {label: 'Data da reserva', key: 'reservation_date',_style:{width: '250px'}},
        {label: 'Ações', key: 'actions', _style:{width: '1px'}, sorter: false, filter: false},
    ];

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleAddModal = () => {
        setModalId('');
        setUnitId();
        setAreaId();
        setDateField('');
        setShowModal(true);
    };

    const handleEditButton = (id) => {
        let index = list.findIndex(v=>v.id===id);
        setModalId(list[index]['id']);
        setUnitId(list[index]['id_unit']);
        setAreaId(list[index]['id_area']);
        setDateField(list[index]['reservation_date']);
        setShowModal(true);
    };

    const handleDelButton = async (index) => {
        if(window.confirm('Tem certeza que deseja excluir?')){
            setDelLoading(true);
            const result = await api.removeReservation(list[index]['id']);
            setDelLoading(false);
            if(result.error === ''){
                getList();
            }else{
                alert(result.error);
            }
        } 
    };

    
    const handleSaveModal = async () => {
        if(unitId && areaId && dateField){
            setModalLoading(true);
            let result;
            let data = {
                id_unit: unitId,
                id_area: areaId,
                reservation_date: dateField
            };
            if(modalId === ''){
                result = await api.addReservation(data);
            }else{
                result = await api.updateReservation(modalId, data);
            }            
            setModalLoading(false);
            if(result.error === ''){
                setShowModal(false);
                getList();
            }else{
                alert(result.error);
            }
        }else{
            alert('Preencha os campos!');
        }
    };
   
    useEffect(() => {
        getList();
        getUnitsList();
        getAreasList();
    },[]);

    const getList = async () => {
        setLoading(true);
        const result = await api.getReservations();
        setLoading(false);
        if(result.error === ''){
            setList(result.list);
        }else{
            alert(result.error);
        }
    };
    const getUnitsList = async () => {
        const result = await api.getUnits();
        if(result.error === ''){
            setModalUnitList(result.list);
        }
    };
    const getAreasList = async () => {
        const result = await api.getAreas();
        if(result.error === ''){
            setModalAreaList(result.list);
        }
    };
    return (
        <>
            <CRow>
                <CCol>
                    <h2>Reservas</h2>
                    <CCard>
                        <CCardHeader>
                            <CButton 
                            color="primary" 
                            onClick={handleAddModal}
                            disabled={modalUnitList.length===0||modalAreaList.length===0}
                            >
                                <CIcon name="cil-check" /> Nova Reserva
                            </CButton>
                        </CCardHeader>
                        <CCardBody>
                            <CDataTable 
                                items={list}
                                fields={fields}
                                loading={loading}
                                noItemsViewSlot=" "
                                columnFilter
                                sorter
                                hover
                                striped
                                bordered
                                pagination
                                itemsPerPage={10}
                                scopedSlots={{
                                    'reservation_date': (item, index) => (
                                        <td>
                                            {item.reservation_date_formatted}
                                        </td>
                                    )
                                ,
                                    'actions': (item, index) => (
                                        <td>
                                            <CButtonGroup>
                                                <CButton size="sm" color="info" disabled={modalUnitList.length===0||modalAreaList.length===0||delLoading} onClick={()=>handleEditButton(item.id)}>Editar</CButton>
                                                <CButton size="sm" color="danger" disabled={delLoading} onClick={()=>handleDelButton(index)}>Excluir</CButton>
                                            </CButtonGroup>
                                        </td>
                                    )
                                }}
                            />
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>

            <CModal show={showModal} onClose={handleCloseModal}>
                <CModalHeader closeButton>
                    <CModalTitle>
                        {modalId===''? 'Novo': 'Editar'} Reserva 
                    </CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <CForm>
                        <CFormGroup>
                            <CLabel htmlFor="unit">Unidade</CLabel>
                            <CSelect
                                id="unit"
                                custom
                                onChange={e=>setUnitId(e.target.value)}
                                disabled={modalLoading}
                                value={unitId}
                            >
                                {modalUnitList.map((item, index)=>(
                                    <option
                                        key={index}
                                        value={item.id}
                                    >
                                        {item.name}
                                    </option>
                                ))}
                            </CSelect>
                        </CFormGroup>
                        <CFormGroup>
                            <CLabel htmlFor="area">Área</CLabel>
                            <CSelect
                                id="area"
                                custom
                                onChange={e=>setAreaId(e.target.value)}
                                disabled={modalLoading}
                                value={areaId}
                            >
                                {modalAreaList.map((item, index)=>(
                                    <option
                                        key={index}
                                        value={item.id}
                                    >
                                        {item.title}
                                    </option>
                                ))}
                            </CSelect>
                        </CFormGroup>
                        <CFormGroup>
                            <CLabel htmlFor="date">Data da Reserva</CLabel>
                            <CInput
                                type="text"
                                id="date"
                                value={dateField}
                                onChange={e=>setDateField(e.target.value)}
                                disabled={modalLoading}
                            />
                        </CFormGroup>                            
                        <CButton
                            color="primary"
                            onClick={handleSaveModal}
                            disabled={modalLoading}
                        >
                            {modalLoading ? 'Carregando...' : 'Salvar'}
                        </CButton>
                        <CButton 
                            color="secondary"
                            onClick={handleCloseModal}
                            disabled={modalLoading}
                        >
                            Cancelar
                        </CButton>
                    </CForm>
                </CModalBody>
            </CModal>

        </>
    );
}