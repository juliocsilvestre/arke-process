/// <reference types="cypress" />

import fixtures from '../../fixtures/signin.fixtures.json'

const [{signinFormData, signinFormDataWithErrors, signinResponse, signinResponseWithErrors }] = fixtures 

const API_URL = Cypress.env('API_URL')

interface SigninResponse {
  cpf: string;
  name: string;
  headers: {
    'set-cookie': string;
  }
}

describe('Signin', () => {
  it('should not authenticate with empty values', () => {
    cy.visit('/')

    const cpfInput = cy.get('input[name=cpf]')
    const passwordInput = cy.get('input[name=password]')
    const button = cy.get('button[type=submit]')
    const error = cy.get('p')

    cpfInput.should('have.value', '')
    passwordInput.should('have.value', '')
    button.click()

    error.contains('Credenciais inválidas')
  });

  it('should not authenticate with invalid values', () => {
    cy.visit('/')

    const cpfInput = cy.get('input[name=cpf]')
    const passwordInput = cy.get('input[name=password]')
    const button = cy.get('button[type=submit]')
    const error = cy.get('p')

    cpfInput.type('12345678900')
    passwordInput.type('123456')
    button.click()

    error.contains('Credenciais inválidas')
  });

  it.skip('should not authenticate with invalid cpf', () => {
    cy.visit('/')

    const cpfInput = cy.get('input[name=cpf]')
    const passwordInput = cy.get('input[name=password]')
    const button = cy.get('button[type=submit]')
    const error = cy.get('p')

    cpfInput.type('12345678900')
    passwordInput.type(signinFormData.password)
    button.click()

    error.contains('Credenciais inválidas')
  })

  it.skip('should not authenticate with invalid password', () => {
    cy.visit('/')

    const cpfInput = cy.get('input[name=cpf]')
    const passwordInput = cy.get('input[name=password]')
    const button = cy.get('button[type=submit]')
    const toastError = cy.get('li.group.toast  div[data-content]')

    console.error(toastError)

    cpfInput.type(signinFormData.cpf)
    passwordInput.type('123456')
    button.click().then(() => {
      toastError.contains('Credenciais inválidas')
    })

  })

  it.only('should authenticate with valid values', () => {
    cy.visit('/')

    const cpfInput = cy.get('input[name=cpf]')
    const passwordInput = cy.get('input[name=password]')
    const button = cy.get('button[type=submit]')

    cpfInput.type(signinFormData.cpf)
    passwordInput.type(signinFormData.password)

    cy.intercept('POST', `${API_URL}/auth/signin`, {
      ...signinResponse,
      onResponse: (response: SigninResponse) => {
        const cookies = response.headers['set-cookie'];
        for(const cookie of cookies) {
          const [name, value] = cookie.split(';')[0].split('=');
          cy.setCookie(name, value);
        }
      }
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