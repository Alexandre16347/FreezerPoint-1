import React, { useRef, useState } from 'react'
import { Container, ContentForm, Image, Logo } from './styles'
import { Form } from '@unform/web'
import logo from '../../assets/logo.svg'
import Input from '../../components/input'
import * as Yup from 'yup'
import { useContextAutenticacao } from '../../context/authentication'
import { Link, useHistory } from 'react-router-dom'

function Register() {
  const [loginErro, setLoginErro] = useState(' ')
  const formReference = useRef(null)
  const { login } = useContextAutenticacao()
  const history = useHistory()

  const formSubmit = async data => {
    console.log(data)

    //Valida dos campos do formulário
    try {
      const scheme = Yup.object().shape({
        email: Yup.string()
          .email('Email inválido')
          .required('Você precisa digitar um email'),
        password: Yup.string()
          .min(6, 'A senha precisa ter no mínimo 6 caracteres')
          .required('Você precisa digitar uma senha')
      })
      await scheme.validate(data, { abortEarly: false })
      await login(data)
      history.push('/Home')

      // Faz a requisição da api e grava no banco de dados
      // ATENÇÃO
      // const reponse = await api.post('login', {
      //   email: data.email,
      //   senha: data.password
      // })
      // console.log(reponse.data);
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        const erros = {}
        error.inner.forEach(e => {
          erros[e.path] = e.message
        })
        console.log(erros)
        formReference.current?.setErrors(erros)
      }
      setLoginErro('Não foi possível realizar o login')
    }
  }
  return (
    <Container>
      <Logo>
        <img src={logo} alt="icon" />
      </Logo>
      <ContentForm>
        <h1 className="title">Bem vindo de volta!</h1>
        <Form ref={formReference} onSubmit={formSubmit}>
          <p>Preencha seus dados para realizar seu login</p>

          <h2>Email</h2>
          <Input name="email" type="text" placeholder="exemplo@gmail.com" />
          <h2>Senha</h2>
          <Input name="password" type="password" placeholder="Senha" />
          <button type="submit"> Login </button>
          {!!loginErro && <h2 className="erro">{loginErro}</h2>}

          <Link className="loginButton" to="/createUser">
            {' '}
            não possui uma conta? cadastre-se
          </Link>
        </Form>
      </ContentForm>
      <Image></Image>
    </Container>
  )
}

export default Register
