import React, { useEffect, useState } from 'react';
import { CButton, CButtonGroup, CCard, CCardBody, CCardHeader, CCol, CDataTable, CForm, CFormGroup, CInput, CLabel, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle, CRow, CTextarea } from '@coreui/react';
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
    const [modalFileField, setModalFileField] = useState('');
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
        setShowModal(true);
    };

    const handleDownloadButton = (index) => {
        window.open(list[index]['fileurl']);
    }

    const handleEditButton = (index) => {
        setModalId(list[index]['id']);
        setModalTitle(list[index]['title']);
        setShowModal(true);
    };

    const handleDelButton = async (index) => {
        if(window.confirm('Tem certeza que deseja excluir?')){
            setDelLoading(true);
            const result = await api.removeDoc(list[index]['id']);
            setDelLoading(false);
            if(result.error === ''){
                getList();
            }else{
                alert(result.error);
            }
        } 
    };

    
    const handleSaveModal = async () => {
        if(modalTitle){
            setModalLoading(true);
            let result;
            let data = {
                title: modalTitle,
            };
            if(modalId === ''){
                if(modalFileField){
                    data.file = modalFileField;
                    result = await api.addDocFile(data);
                }else{
                    alert('Selecione o arquivo!');
                    setModalLoading(false);
                    return;
                }
            }else{
                if(modalFileField){
                    data.file = modalFileField;
                }
                result = await api.updateDocFile(modalId, data);
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
        const result = await api.getDoc();
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
                    <h2>Reservas</h2>
                    <CCard>
                        <CCardHeader>
                            <CButton color="primary" onClick={handleAddModal}>
                                <CIcon name="cil-check" /> Novo Documento
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
                                itemsPerPage={5}
                                scopedSlots={{
                                    'actions': (item, index) => (
                                        <td>
                                            <CButtonGroup>
                                                <CButton size="sm" color="success" disabled={delLoading} onClick={()=>handleDownloadButton(index)}>
                                                    <CIcon name="cil-cloud-download" />
                                                </CButton>
                                                <CButton size="sm" color="info" disabled={delLoading} onClick={()=>handleEditButton(index)}>Editar</CButton>
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
                        {modalId===''? 'Novo': 'Editar'} Documento 
                    </CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <CForm>
                        <CFormGroup>
                            <CLabel htmlFor="title">Título do documento</CLabel>
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
                            <CLabel htmlFor="file">Arquivo</CLabel>
                            <CInput
                                type="file"
                                id="file"
                                name="file"
                                onChange={e=>setModalFileField(e.target.files[0])}
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