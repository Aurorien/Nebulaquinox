describe("Dockyard Integration Tests", () => {
  it("should make a GET request and get an array as response", () => {
    cy.request("GET", "/data").then((response) => {
      expect(response.status).to.equal(200);
      expect(response.body).that.is.an("array");
    });
  });

  it("should submit a POST request and get message successful for POST", () => {
    const spaceshipName = "TestSpaceship";
    const dockingStatusId = 1;
    cy.request("POST", "/data/post", {
      spaceshipName,
      dockingStatusId,
    }).then((response) => {
      expect(response.status).to.equal(200);
      expect(response.body).to.include(
        "Data successfully inserted into the database"
      );
    });
  });
});
