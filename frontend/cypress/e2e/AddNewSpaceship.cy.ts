describe("Visit", () => {
  it("visits the site and goes into edit mode and add a spaceship to the list", () => {
    cy.visit("http://localhost:5173");
    cy.get("a").click();
    cy.get("#plus-button").click();
    cy.get("#add-spaceship-form");
    cy.get("#add-name").type("Voyager");
    cy.get("#dropdown").select("Docked");
    cy.intercept("POST", "/data/post").as("postData");
    cy.get("#add-button").click();
    cy.wait("@postData").then((interception) => {
      const responseBody = interception.response.body;
      expect(responseBody).to.include(
        "Data successfully inserted into the database"
      );
    });
  });
});
