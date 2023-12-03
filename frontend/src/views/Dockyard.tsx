import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import "./Dockyard.css";
import axios from "axios";
import Dropdown from "../components/Dropdown";

interface ApiResponse {
  spaceshipid: number;
  spaceshipname: string;
  dockingstatusname: string;
}

interface DockingStatus {
  dockingstatusid: number;
  dockingstatusname: string;
}

interface FormData {
  spaceshipName: string;
  dockingStatusId: number | null;
}

function Home() {
  const [dockingStatusData, setDockingStatusData] = useState<DockingStatus[]>(
    []
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/data/docking-status");
        console.log("Docking-Status response.data", response.data);

        setDockingStatusData(response.data);
      } catch (error) {
        console.error("Error fetching docking status data:", error);
      }
    };

    fetchData();
  }, []);

  const [data, setData] = useState<ApiResponse[] | null>(null),
    [loading, setLoading] = useState<boolean>(true),
    [formData, setFormData] = useState<FormData>({
      spaceshipName: "",
      dockingStatusId: null,
    });

  const handleSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const jsonData = JSON.stringify({
      spaceshipName: formData.spaceshipName,
      dockingStatusId: formData.dockingStatusId,
    });

    axios
      .post("/data/post", jsonData, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log("Add spaceship - response.data", response.data);
        fetchDataAndReload();
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setFormData({
          spaceshipName: "",
          dockingStatusId: null,
        });
      });
  }

  const isSubmitDisabled = !(
    formData.spaceshipName && formData.dockingStatusId
  );

  const setDataCallback = useCallback((data: ApiResponse[] | null) => {
    setData(data);
  }, []);

  useEffect(() => {
    axios
      .get("/data")
      .then((response) => {
        setDataCallback(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, [setDataCallback]);

  function fetchDataAndReload() {
    axios
      .get("/data")
      .then((response) => {
        setDataCallback(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }

  const [editMode, setEditMode] = useState<number | null>(null);

  const handleEdit = (spaceshipId: number) => {
    setEditMode(spaceshipId);
  };

  const handleSave = (spaceshipId: number, dockingStatusId: number | null) => {
    axios
      .put(`/data/edit/${spaceshipId}`, { dockingStatusId })
      .then(() => {
        console.log(`Spaceship ${spaceshipId} updated successfully`);
        fetchDataAndReload();
        setEditMode(null); // Exit edit mode
      })
      .catch((error) => {
        console.error(`Error updating spaceship ${spaceshipId}:`, error);
      })
      .finally(() => {
        setFormData({
          spaceshipName: "",
          dockingStatusId: null,
        });
      });
  };

  const handleDeparted = (spaceshipId: number) => {
    axios
      .delete(`/data/depart/${spaceshipId}`)
      .then(() => {
        console.log(`Spaceship ${spaceshipId} departed successfully`);
        fetchDataAndReload();
      })
      .catch((error) => {
        console.error(`Error departing spaceship ${spaceshipId}:`, error);
      });
  };

  return (
    <>
      <nav>
        <Link to="/">Home</Link>
      </nav>
      <h1>Spaceship dockyard</h1>
      <div className="add-spaceship-wrapper">
        <div className="add-spaceship-title-wrapper">
          <h2 className="add-spaceship">Add spaceship</h2>
        </div>
        <form onSubmit={handleSubmit}>
          <label>
            Name:
            <div>
              <input
                name="spaceshipName"
                onChange={handleInput}
                value={formData.spaceshipName}
              />
            </div>
          </label>
          <label>
            Docking status:
            <div>
              <Dropdown
                formData={formData}
                handleSelect={handleSelect}
                dockingStatusData={dockingStatusData}
              />
            </div>
          </label>
          <button type="submit" disabled={isSubmitDisabled}>
            Add
          </button>
        </form>
      </div>
      <div>
        {loading ? (
          <p>Loading...</p>
        ) : (
          data && (
            <div className="spaceship-list-wrapper">
              <div className="spaceship-list">
                <h2>Docked spaceships:</h2>
                <ol className="spaceship-ol">
                  {data.map((data) => (
                    <li key={data.spaceshipid} className="spaceship-li-name">
                      <span>
                        <div className="spaceship-li-label">
                          Spaceship name:
                        </div>{" "}
                        {data.spaceshipname}{" "}
                      </span>
                      <span>
                        {editMode === data.spaceshipid ? (
                          <div>
                            <label>
                              Docking status:
                              <Dropdown
                                formData={formData}
                                handleSelect={handleSelect}
                                dockingStatusData={dockingStatusData}
                              />
                            </label>
                            {formData.dockingStatusId && (
                              <button
                                type="button"
                                onClick={() =>
                                  handleSave(
                                    data.spaceshipid,
                                    formData.dockingStatusId
                                  )
                                }
                              >
                                Save
                              </button>
                            )}
                          </div>
                        ) : (
                          <>
                            <span>
                              <div className="spaceship-li-label">
                                Docking status:
                              </div>{" "}
                              {data.dockingstatusname}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleEdit(data.spaceshipid)}
                            >
                              Edit
                            </button>
                          </>
                        )}
                      </span>
                      <div>
                        <button
                          onClick={() => handleDeparted(data.spaceshipid)}
                          className="button-departed"
                        >
                          Departed
                        </button>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          )
        )}
      </div>
    </>
  );
}

export default Home;
