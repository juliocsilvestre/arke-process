/// <reference types="cypress" />

import fixtures from '../../fixtures/signin.fixtures.json'

const [
  {
    formData,
    formDataTriggerPasswordMinLengthError,
    formDataWithInvalidCPF,
    formDataWithInvalidPassword,
    emptyFormData,
    signinResponse,
    signinResponseWithErrors,
  },
] = fixtures

const API_URL = Cypress.env('API_URL')

interface SigninResponse {
  cpf: string
  name: string
  headers: {
    'set-cookie': string
  }
}

describe('Signin', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  afterEach(() => {
    cy.clearCookies()
  })

  it('should show error below field when submiting empty values', () => {
    const cpfInput = cy.get('input[name=cpf]')
    const passwordInput = cy.get('input[name=password]')
    const button = cy.get('button[type=submit]')

    cpfInput.should('have.value', emptyFormData.cpf)
    passwordInput.should('have.value', emptyFormData.password)

    button.click()

    const error = cy.get('p')

    error.contains(emptyFormData.message)
  })

  it('should show error below field when password min-length is not fulfiled', () => {
    const cpfInput = cy.get('input[name=cpf]')
    const passwordInput = cy.get('input[name=password]')
    const button = cy.get('button[type=submit]')

    cpfInput.type(formDataTriggerPasswordMinLengthError.cpf)
    passwordInput.type(formDataTriggerPasswordMinLengthError.password)

    button.click()

    const error = cy.get('p')

    error.contains(formDataTriggerPasswordMinLengthError.message)
  })

  it('should not authenticate with invalid cpf', () => {
    const cpfInput = cy.get('input[name=cpf]')
    const passwordInput = cy.get('input[name=password]')
    const button = cy.get('button[type=submit]')

    cpfInput.type(formDataWithInvalidCPF.cpf)
    passwordInput.type(formData.password)

    cy.intercept('POST', `${API_URL}/auth/signin`, {
      ...signinResponseWithErrors,
    }).as('signin')

    button.click().then(() => {
      cy.wait('@signin').then((interception) => {
        expect(interception.response?.statusCode).to.eq(401)
        expect(interception.response?.body.message).to.eq(signinResponseWithErrors.body.message)
        const toastError = cy.get('div').contains('Credenciais inválidas')
        toastError.should('be.visible')
      })
    })
  })

  it('should not authenticate with invalid password', () => {
    const cpfInput = cy.get('input[name=cpf]')
    const passwordInput = cy.get('input[name=password]')
    const button = cy.get('button[type=submit]')

    cpfInput.type(formData.cpf)
    passwordInput.type(formDataWithInvalidPassword.password)

    cy.intercept('POST', `${API_URL}/auth/signin`, {
      ...signinResponseWithErrors,
    }).as('signin')

    button.click().then(() => {
      cy.wait('@signin').then((interception) => {
        expect(interception.response?.statusCode).to.eq(401)
        expect(interception.response?.body.message).to.eq(signinResponseWithErrors.body.message)
        const toastError = cy.get('div').contains('Credenciais inválidas')
        toastError.should('be.visible')
      })
    })
  })

  it('should authenticate with valid values', () => {
    const cpfInput = cy.get('input[name=cpf]')
    const passwordInput = cy.get('input[name=password]')
    const button = cy.get('button[type=submit]')

    cpfInput.type(formData.cpf)
    passwordInput.type(formData.password)

    cy.intercept('POST', `${API_URL}/auth/signin`, {
      ...signinResponse,
      onResponse: (response: SigninResponse) => {
        const cookies = response.headers['set-cookie']
        for (const cookie of cookies) {
          const [name, value] = cookie.split(';')[0].split('=')
          cy.setCookie(name, value)
        }
      },
    }).as('signin')

    button.click().then(() => {
      cy.wait('@signin').then((interception) => {
        expect(interception.response?.statusCode).to.eq(200)
        expect(interception.response?.body.cpf).to.eq(signinResponse.body.cpf)
        expect(interception.response?.body.name).to.eq(signinResponse.body.name)
        cy.getCookie('carva-session').should('exist')
      })
    })
  })
})
