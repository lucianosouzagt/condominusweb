import React, { useEffect, useState } from 'react';
import { CButton, CButtonGroup, CCard, CCardBody, CCardHeader, CCol, CDataTable, CFormGroup, CInput, CLabel, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle, CRow, CTextarea } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import useApi from '../services/api';

export default () => {
    const api = useApi();
    const [loading, setLoading] = useState(true);
    const [list, setList] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [modalLoading, setModalLoading] = useState(false);
    const [delLoading, setDelLoading] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalBody, setModalBody] = useState('');
    const [modalId, setModalId] = useState('');


    const fields = [
        {label: 'Título', key: 'title'},
        {label: 'Data de criação', key: 'datecreated',_style:{width: '250px'}},
        {label: 'Ações', key: 'actions', _style:{width: '1px'}},
    ];

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleAddModal = () => {
        setModalId('');
        setModalTitle('');
        setModalBody('');
        setShowModal(true);
    };

    const handleEditButton = (index) => {
        setModalId(list[index]['id']);
        setModalTitle(list[index]['title']);
        setModalBody(list[index]['body']);
        setShowModal(true);
    };
    const handleDelButton = async (index) => {
        if(window.confirm('Tem certeza que deseja excluir?')){
            setDelLoading(true);
            const result = await api.removeWall(list[index]['id']);
            setDelLoading(false);
            if(result.error === ''){
                getList();
            }else{
                alert(result.error);
            }
        } 

    };

    const handleSaveModal = async () => {
        if(modalTitle && modalBody){
            setModalLoading(true);
            let result;
            let data = {
                title: modalTitle,
                body: modalBody
            };
            if(modalId === ''){
                result = await api.addWall(data);
            }else{
                result = await api.updateWall(modalId, data);
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
    },[]);

    const getList = async () => {
        setLoading(true);
        const result = await api.getWall();
        setLoading(false);
        if(result.error === ''){
            setList(result.list);
        }else{
            alert(result.error);
        }
    };
    return (
        <>
            <CRow>
                <CCol>
                    <h2>Mural de Avisos</h2>
                    <CCard>
                        <CCardHeader>
                            <CButton color="primary" onClick={handleAddModal}>
                                <CIcon name="cil-check" /> Novo Aviso
                            </CButton>
                        </CCardHeader>
                        <CCardBody>
                            <CDataTable 
                                items={list}
                                fields={fields}
                                loading={loading}
                                noItemsViewSlot=" "
                                hover
                                striped
                                bordered
                                pagination
                                itemsPerPage={3}
                                scopedSlots={{
                                    'actions': (item, index) => (
                                        <td>
                                            <CButtonGroup>
                                                <CButton color="info" disabled={delLoading} onClick={()=>handleEditButton(index)}>Editar</CButton>
                                                <CButton color="danger" disabled={delLoading} onClick={()=>handleDelButton(index)}>
                                                    {delLoading ? 'Excluindo...' : 'Excluir'}
                                                </CButton>
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
                        {modalId===''? 'Novo': 'Editar'} Aviso    
                    </CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <CFormGroup>
                        <CLabel>Título do aviso</CLabel>
                        <CInput
                            type="text"
                            id="title"
                            placeholder="Digite um título"
                            value={modalTitle}
                            onChange={e=>setModalTitle(e.target.value)}
                            disabled={modalLoading}
                        />
                    </CFormGroup>
                    <CFormGroup>
                        <CLabel>Aviso</CLabel>
                        <CTextarea
                            id="title"
                            placeholder="Digite o aviso"
                            value={modalBody}
                            onChange={e=>setModalBody(e.target.value)}
                            disabled={modalLoading}
                        />
                    </CFormGroup>
                </CModalBody>
                <CModalFooter>
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
                </CModalFooter>
            </CModal>

        </>
    );
}