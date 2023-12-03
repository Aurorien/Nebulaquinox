import React from "react";

interface DockingStatus {
  dockingstatusid: number;
  dockingstatusname: string;
}

interface FormData {
  spaceshipName: string;
  dockingStatusId: number | null;
}

interface DropdownProps {
  formData: FormData;
  handleSelect: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  dockingStatusData: DockingStatus[];
}

const Dropdown: React.FC<DropdownProps> = ({
  formData,
  handleSelect,
  dockingStatusData,
}) => {
  return (
    <select
      name="dockingStatusId"
      onChange={handleSelect}
      value={
        formData.dockingStatusId !== null
          ? String(formData.dockingStatusId)
          : ""
      }
    >
      <option value={""} disabled>
        Select status
      </option>
      {dockingStatusData.map((status) => (
        <option key={status.dockingstatusid} value={status.dockingstatusid}>
          {status.dockingstatusname}
        </option>
      ))}
    </select>
  );
};

export default Dropdown;
