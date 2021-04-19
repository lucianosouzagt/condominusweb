import React, { useEffect, useState } from 'react';
import { CButton, CButtonGroup, CCard, CCardBody, CCardHeader, CCol, CDataTable, CForm, CFormGroup, CImg, CInput, CLabel, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle, CRow, CTextarea } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import useApi from '../services/api';

export default () => {
    const api = useApi();
    const [loading, setLoading] = useState(true);
    const [list, setList] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [modalLoading, setModalLoading] = useState(false);
    const [delLoading, setDelLoading] = useState(false);
    const [modalDesc, setModalDesc] = useState('');
    const [modalWhere, setModalWhere] = useState('');
    const [modalFileField, setModalFileField] = useState('');
    const [modalId, setModalId] = useState('');


    const fields = [
        {label: 'Título', key: 'title'},
        {label: 'Propriedade', key: 'unit_name',_style:{width: '70px'}},
        {label: 'Status', key: 'status',_style:{width: '100px'}},
        {label: 'Data de criação', key: 'datecreated_formate',_style:{width: '170px'}},
        {label: 'Ações', key: 'actions', _style:{width: '1px'},sorter: false, filter: false},
    ];

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleAddModal = () => {
        setModalId('');
        setModalDesc('');
        setModalWhere('');
        setShowModal(true);
    };

    const handleDoneButton = async (index) => {
        setDelLoading(true);
        const result = await api.doneFoundAndLost(list[index]['id']);
        getList();
        setDelLoading(false);
    }

    const handleEditButton = (index) => {
        setModalId(list[index]['id']);
        setModalDesc(list[index]['description']);
        setModalWhere(list[index]['where']);
        setShowModal(true);
    };

    const handleDelButton = async (index) => {
        if(window.confirm('Tem certeza que deseja excluir?')){
            setDelLoading(true);
            const result = await api.removeFoundAndLost(list[index]['id']);
            setDelLoading(false);
            if(result.error === ''){
                getList();
            }else{
                alert(result.error);
            }
        } 
    };

    
    const handleSaveModal = async () => {
        if(modalDesc && modalWhere){
            setModalLoading(true);
            let result;
            let data = {
                description: modalDesc,
                where: modalWhere,
            };
            if(modalId === ''){
                if(modalFileField){
                    data.file = modalFileField;
                    result = await api.addFoundAndLost(data);
                }else{
                    alert('Selecione o arquivo!');
                    setModalLoading(false);
                    return;
                }
            }else{
                if(modalFileField){
                    data.file = modalFileField;
                }
                result = await api.updateFoundAndLost(modalId, data);
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
        const result = await api.getWarnings();
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
                    <h2>Ocorências</h2>
                    <CCard>
                        <CCardHeader>
                            <CButton color="primary" onClick={handleAddModal}>
                                <CIcon name="cil-check" /> Nova Ocorência
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
                                itemsPerPage={5}
                                scopedSlots={{
                                    'photo': (item, index) => (
                                        <CImg src={item.photo} className="m-3" width="50px"/>
                                    ),
                                    'actions': (item, index) => (
                                        <td>
                                            <CButtonGroup>
                                                <CButton size="sm" color="success" disabled={delLoading} onClick={()=>handleDoneButton(index)}>
                                                    {item.status == "lost" ?  <CIcon name="cil-check" /> : <CIcon name="cil-ban" />}                                                    
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
                        {modalId===''? 'Nova': 'Editar'} Ocorência
                    </CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <CFormGroup>
                        <CLabel htmlFor="description">Descrição</CLabel>
                        <CInput
                            type="text"
                            id="description"
                            placeholder="Digite a descrição"
                            value={modalDesc}
                            onChange={e=>setModalDesc(e.target.value)}
                            disabled={modalLoading}
                        />
                    </CFormGroup>
                    <CFormGroup>
                        <CLabel htmlFor="where">Onde foi encontrado</CLabel>
                        <CInput
                            type="text"
                            id="where"
                            placeholder="Digite o local"
                            value={modalWhere}
                            onChange={e=>setModalWhere(e.target.value)}
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