import React, { useState }from 'react'
import { useHistory } from 'react-router-dom'
import {
  CAlert,
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CInput,
  CInputGroup,
  CInputGroupPrepend,
  CInputGroupText,
  CRow
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import useApi from '../services/api';

const Login = () => {
  const api = useApi();
  const history = useHistory();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLoginButton = async () => {
    if(email && password){
      setLoading(true);
      const result = await api.login(email, password);
      setLoading(false);
      if(result.error === ''){
        localStorage.setItem('token', result.token);
        history.push('/');
      }else{
        setError(result.error);
      }
    }else{
      setError("E-mail/Senha estão errados.")
    }
  };

  return (
    <div className="c-app c-default-layout flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md="4">
            <CCardGroup>
              <CCard className="p-3">
                <CCardBody>
                  <CForm>
                    <h1>Login</h1>
                    <p className="text-muted">Digite seus dados de acesso!</p>
                    {error !== '' &&
                      <CAlert color="danger">{error}</CAlert>
                    }
                    <CInputGroup className="mb-2">
                      <CInputGroupPrepend>
                        <CInputGroupText>
                          <CIcon name="cil-user" />
                        </CInputGroupText>
                      </CInputGroupPrepend>
                      <CInput disabled={loading} type="text" placeholder="E-mail" value={email} onChange={e=>setEmail(e.target.value)}/>
                    </CInputGroup>
                    <CInputGroup className="mb-3">
                      <CInputGroupPrepend>
                        <CInputGroupText>
                          <CIcon name="cil-lock-locked" />
                        </CInputGroupText>
                      </CInputGroupPrepend>
                      <CInput disabled={loading} type="password" placeholder="Senha" value={password} onChange={e=>setPassword(e.target.value)} />
                    </CInputGroup>
                    <CRow>
                      <CCol xs="6">
                        <CButton 
                          color="primary" 
                          className="px-4"
                          onClick={handleLoginButton}
                          disabled={loading}
                        >
                          {loading ? 'Carregando... ':'Entrar'}
                        </CButton>
                      </CCol>
                      <CCol xs="6" className="text-right">
                        <CButton color="link" className="px-0">Esqueceu sua senha?</CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
