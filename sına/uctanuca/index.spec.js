let url = 'http://localhost:1453/'
context('Otag Uctan Uca Sınama', () => {
  it('O.ready ve Element.prototype.pitch ve .to', () => {
    cy.visit(url)
    cy.get('.Kabuk')
  })
})
context('Image.prototype', () => {
  it('.set() ile src belirleme', () => {
    cy.visit(url)
    cy.get('.Bet img')
    cy.get('.Bet img').should(e => expect(e[0]).to.have.property('src', url + 'img/otag.svg'))
  })
  it('.value src\'ye eşit', () => {
    cy.visit(url)
    cy.get('.Bet img')
    cy.get('.Bet img').should(e => expect(e[0]).to.have.property('value', url + 'img/otag.svg')) // ))
  })
  it('.loader var', () => {
    cy.visit(url)
    cy.get('.Bet img')
    cy.get('.Bet img').should(e => expect(e[0]).to.have.property('loader')) // ))
  })
})
context('Sanal', () => {
  it('.props', () => {
    cy.visit(url)
    let el
    cy.get('.Ana.Bet').should(e => expect((el = e[0].sanal).name).to.eq('Ana Bet'))
    cy.window().then((win) => {
      el.name = 'Ana'
      expect(win.document.title).to.eq('Ana')
    })
  })

  it('.V()', () => {
    cy.visit(url)
    cy.get('.Kabuk')
    cy.get('.Kabuk').should(e => expect(e[0].sanal.V('yönlendir').el).to.have.property('id'))
    cy.log('V("gövde:kol:el") yazımı')
    cy.get('.Kabuk').should(e => expect(e[0].sanal.V('yönlendir:dizelge').el).to.have.property('id'))
  })
})

context('Element.prototype', () => {
  it('.has()', () => {
    cy.visit(url)
    cy.get('.Bet').should(e => expect(e[0].sanal.View).to.have.property('açıklama'))
  })

  it('.Class()', () => {
    cy.visit(url)
    cy.get('.Bet .desc').should('have.class', 'açık') // ))
  })
  it('.set()', () => {
    cy.visit(url)
    cy.get('.Bet .desc').contains('Otağ\'a Hoşgeldiniz') // ))
  })
})
context('Page', () => {
  it('yönlendirme', () => {
    cy.visit(url)
    cy.location().its('href')
      .should('eq', url + '#/ana')
  })
  it('yol bulabiliyor', () => {
    cy.visit(url)
    cy.get('a[href="/#/hakkında"]').click()
    cy.location().its('href')
      .should((URL) => expect(decodeURI(URL.replace(url, ''))).to.eq('#/hakkında'))
    cy.get('.Hakkında')
  })
  it('once()', () => {
    cy.visit(url)
    cy.get('.Bet .desc').should('have.class', 'açık')
  })
  it('Bet adı', () => {
    cy.visit(url)
    let el
    cy.get('.Ana.Bet').should(e => expect((el = e[0].sanal).name).to.eq('Ana Bet'))
  })
  it('Bet adı duyalılığının yönlendirme ve belge adına etkisi', () => {
    cy.visit(url + '#/hakkında')
    let el
    cy.get('.Hakkında.Bet').should(e => expect((el = e[0].sanal).name).to.eq('Hakkında'))
    cy.window().then((win) => {
      el.name = 'Hk.'
      expect(win.document.title).to.eq('Hk.')
      cy.get('a[href="/#/hakkında"]').should(e => expect(e[0].innerHTML).to.eq('Hk.'))
    })
  })
})