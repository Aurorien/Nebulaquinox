import Dockyard from "../../src/views/Dockyard";
import { BrowserRouter } from "react-router-dom";

describe("<Dockyard />", () => {
  it("renders successfully", () => {
    cy.mount(
      <BrowserRouter>
        <Dockyard />
      </BrowserRouter>
    ).then(() => {
      cy.log("Component mounted successfully");
    });
  });

  it("intercept and mocking the GET call and verifies that the received data is populating the list", () => {
    cy.fixture("spaceships.json").then((spaceships) => {
      cy.intercept(
        {
          method: "GET",
          url: "/data",
        },
        { body: spaceships }
      ).as("spaceships");

      cy.mount(
        <BrowserRouter>
          <Dockyard />
        </BrowserRouter>
      );

      cy.wait("@spaceships");

      cy.get("#spaceship-name").should("contain", "Darkvoida");
    });
  });
});
