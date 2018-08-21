let url = 'http://localhost:1453/'
context('Otag Uctan Uca Sınama', () => {
  it('O.ready ve Element.prototype.html', () => {
    cy.visit(url)
    cy.get('.Uygulama')
  })
  it('O.Disk', () => {
    cy.window().then((win) => {
      win.O.Disk.ornek=1
      cy.log('O.Disk.ornek=1')
      expect(win.O.Disk.ornek).to.eq(1)
      delete win.O.Disk.ornek
      cy.log('delete O.Disk.ornek')
      expect(win.O.Disk.ornek).to.eq(null)
    })
  })
})
context('Image.prototype', () => {
  it('.set() ile src belirleme', () => {
    cy.visit(url)
    cy.get('.Bet img')
    cy.get('.Bet img').should(e=>expect(e[0]).to.have.property('src',url+'img/otag.svg'))
  })
  it('.value src\'ye eşit', () => {
    cy.visit(url)
    cy.get('.Bet img')
    cy.get('.Bet img').should(e=>expect(e[0]).to.have.property('value',url+'img/otag.svg')) //))
  })
  it('.loader var', () => {
    cy.visit(url)
    cy.get('.Bet img')
    cy.get('.Bet img').should(e=>expect(e[0]).to.have.property('loader')) //))
  })
})
context('Element.prototype', () => {
  it('.prop()', () => {
    cy.visit(url)
    cy.window().then((win) => {
      expect(win.O.Page.routes.ana.name).to.eq('Ana Bet')
    })
  })
  it('.has()', () => {
    cy.visit(url)
    cy.get('.Bet').should(e=>expect(e[0].View).to.have.property('açıklama'))
  })
  it('.V()', () => {
    cy.visit(url)
    cy.get('.Uygulama')
    cy.get('.Uygulama').should(e=>expect(e[0].V('yönlendir')).to.have.property('id'))
    cy.log('V("gövde:kol:el") yazımı')
    cy.get('.Uygulama').should(e=>expect(e[0].V('yönlendir:dizelge')).to.have.property('id'))
  })
  it('.Class()', () => {
    cy.visit(url)
    cy.get('.Bet .desc').should('have.class','açık') //))
  })
  it('.set()', () => {
    cy.visit(url)
    cy.get('.Bet .desc').contains('Otağ\'a Hoşgeldiniz') //))
  })
  it('.link()', () => {
    cy.visit(url)
    cy.get('.Yönlendir a').click() 
    cy.location().its('href').should((URL)=>expect(decodeURI(URL.replace(url,''))).to.eq('#/hakkında'))
  })
})

context('Page', () => {
  it('yönlendirme', () => {
    cy.visit(url)
    cy.location().its('href').should('eq', url+'#/ana')
  })
  it('yol bulabiliyor', () => {
    cy.visit(url)
    cy.get('.Yönlendir a').click()
    cy.location().its('href').should((URL)=>expect(decodeURI(URL.replace(url,''))).to.eq('#/hakkında'))
    cy.get('.Hakkında')
  })
  it('once()', () => {
    cy.visit(url)
    cy.get('.Bet .desc').should('have.class','açık')
  })
})