import { FormData } from "../views/Dockyard";
import { useEffect, useState } from "react";
import axios from "axios";

interface DropdownProps {
  formData: FormData;
  handleSelect: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

export interface DockingStatus {
  dockingstatusid: number;
  dockingstatusname: string;
}

const Dropdown: React.FC<DropdownProps> = ({ formData, handleSelect }) => {
  const [dockingStatusData, setDockingStatusData] = useState<DockingStatus[]>(
    []
  );
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/data/docking-status");

        setDockingStatusData(response.data);
      } catch (error) {
        console.error("Error fetching docking status data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <select
      name="dockingStatusId"
      onChange={handleSelect}
      value={
        formData.dockingStatusId !== null
          ? String(formData.dockingStatusId)
          : ""
      }
      id="dropdown"
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
