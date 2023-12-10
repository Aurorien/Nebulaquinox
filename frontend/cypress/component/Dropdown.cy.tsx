import { ChangeEvent } from "react";
import Dropdown from "../../src/components/Dropdown";

describe("<Dropdown />", () => {
  it("mounts Dropdown and verifies that the component is rendered and interacts with the dropdown to verify handleSelect is called and the correct id value is passed on", () => {
    let selectedValue = "";
    cy.mount(
      <Dropdown
        formData={{ spaceshipName: "Raven", dockingStatusId: 4 }}
        handleSelect={(event: ChangeEvent<HTMLSelectElement>) => {
          selectedValue = event.target.value;
        }}
      />
    );
    cy.get("#dropdown").should("exist");
    cy.get("#dropdown")
      .select("Docking")
      .then(() => {
        expect(selectedValue).to.equal("2");
      });
  });
});
