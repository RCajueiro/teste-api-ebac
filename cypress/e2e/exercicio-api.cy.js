/// <reference types="cypress" />
import usuarios from '../usuarios/usuarios.contract'
import { faker } from '@faker-js/faker';

describe('Testes da Funcionalidade Usuários', () => {

  it('Deve validar contrato de usuários', () => {
    cy.request('usuarios').then(response => {
      return usuarios.validateAsync(response.body)
    })
  });

  it('Deve listar usuários cadastrados', () => {
    cy.request({
      method: 'GET',
      url: 'usuarios'
  }).should((response) => {
      expect(response.status).equal(200)
      expect(response.body).to.have.property('usuarios')
  }) 
  });

  it('Deve cadastrar um usuário com sucesso', () => {
    var nome = faker.person.firstName()
    var email = faker.internet.email()

    cy.cadastrarUsuario(nome, email, 'teste', 'true') 
    .should((response) => {
      expect(response.status).equal(201)
      expect(response.body.message).equal('Cadastro realizado com sucesso')
    })
  });

  it('Deve validar um usuário com email inválido', () => {
    cy.request('usuarios').then(response => {
      var nome = faker.person.firstName()
      var email = response.body.usuarios[0].email
      
      cy.cadastrarUsuario(nome, email, 'teste', 'true')
      .should((response) => {
        expect(response.body.message).equal('Este email já está sendo usado')
        expect(response.status).equal(400)
      })
    })
  });

  it('Deve editar um usuário previamente cadastrado', () => {
    cy.request('usuarios').then(response => {
      let id = response.body.usuarios[0]._id
      cy.request({
        method: 'PUT',
        url: `usuarios/${id}`,
        body: {
          "nome": faker.person.firstName(),
          "email": faker.internet.email(),
          "password": "teste",
          "administrador": "true"
        }
      })
      .should(response => {
        expect(response.body.message).equal('Registro alterado com sucesso')
        expect(response.status).equal(200)
      })
    })
    })
    
    
  });

  it('Deve deletar um usuário previamente cadastrado', () => {
    var nome = faker.person.firstName()
    var email = faker.internet.email()

    cy.cadastrarUsuario(nome, email, 'teste', 'true') 
    .should((response) => {
      expect(response.status).equal(201)
      expect(response.body.message).equal('Cadastro realizado com sucesso')
    }).then(response => {
    let id = response.body._id
      cy.request({
        method: 'DELETE',
        url: `usuarios/${id}`,

      })
      .should(response => {
        expect(response.body.message).equal('Registro excluído com sucesso')
        expect(response.status).equal(200)
      })
    });
  });
