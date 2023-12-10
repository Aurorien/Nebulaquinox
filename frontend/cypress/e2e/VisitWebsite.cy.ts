describe("Visit", () => {
  it("visits the site on localhost", () => {
    cy.visit("http://localhost:5173");
  });
});
