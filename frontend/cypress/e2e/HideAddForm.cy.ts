describe("Hide form when click outside it", () => {
  it("opens the Add form by click + button and then hide the form by click outside the form", () => {
    cy.visit("http://localhost:5173");
    cy.get("a").click();
    cy.get("#plus-button").click();
    cy.get("#add-spaceship-form");
    cy.get("body").click(0, 0);
    cy.get("#plus-button");
  });
});
